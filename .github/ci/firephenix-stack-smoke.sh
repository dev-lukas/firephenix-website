#!/usr/bin/env bash
set -euo pipefail

website_image="${IMAGE_UNDER_TEST:?IMAGE_UNDER_TEST is required}"
registry="${REGISTRY:-registry.lukas-roth.dev}"
registry_username="${REGISTRY_USERNAME:-registry}"
backend_image="${BACKEND_IMAGE:-${registry}/firephenix-backend:latest}"
browser_smoke_image="${BROWSER_SMOKE_IMAGE:-mcr.microsoft.com/playwright:v1.49.1-noble}"
workdir="$(mktemp -d)"

cleanup() {
  status=$?
  if [ "$status" -ne 0 ] && [ -f "$workdir/docker-compose.ci.yml" ]; then
    docker compose -f "$workdir/docker-compose.ci.yml" logs --no-color >&2 || true
  fi
  docker compose -f "$workdir/docker-compose.ci.yml" down -v --remove-orphans >/dev/null 2>&1 || true
  rm -rf "$workdir"
  exit "$status"
}
trap cleanup EXIT

if [ -n "${REGISTRY_PASSWORD:-}" ]; then
  printf '%s' "$REGISTRY_PASSWORD" | docker login "$registry" -u "$registry_username" --password-stdin
fi
if ! docker image inspect "$backend_image" >/dev/null 2>&1; then
  docker pull "$backend_image"
fi

cat > "$workdir/nginx.ci.conf" <<'NGINX'
events {}

http {
  server {
    listen 80;
    server_name _;

    location /api/ {
      proxy_pass http://backend:5000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
      proxy_pass http://website:80;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
NGINX

cat > "$workdir/docker-compose.ci.yml" <<'YAML'
services:
  mariadb:
    image: mariadb:11
    environment:
      MARIADB_ROOT_PASSWORD: ci-root
      MARIADB_DATABASE: firephenix
      MARIADB_USER: firephenix
      MARIADB_PASSWORD: ci-password

  valkey:
    image: valkey/valkey:8-alpine

  backend:
    image: ${BACKEND_IMAGE}
    environment:
      SECRET_KEY: ci-secret
      SITE_URL: http://localhost
      DB_HOST: mariadb
      DB_PORT: "3306"
      DB_USER: firephenix
      DB_PASSWORD: ci-password
      VALKEY_HOST: valkey
      VALKEY_PORT: "6379"
      LIMITER_STORAGE_URI: valkey://valkey:6379
      CORS_ORIGINS: http://localhost
      TS3_HOST: teamspeak-disabled
      TS3_PASSWORD: ci-disabled
    depends_on:
      - mariadb
      - valkey
    ports:
      - "127.0.0.1::5000"

  website:
    image: ${WEBSITE_IMAGE}
    depends_on:
      - backend
    ports:
      - "127.0.0.1::80"

  edge:
    image: nginx:alpine
    depends_on:
      - backend
      - website
    volumes:
      - ./nginx.ci.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "127.0.0.1::80"
YAML

export BACKEND_IMAGE="$backend_image"
export WEBSITE_IMAGE="$website_image"
docker compose -f "$workdir/docker-compose.ci.yml" up -d

backend_port="$(docker compose -f "$workdir/docker-compose.ci.yml" port backend 5000 | awk -F: '{print $NF}')"
edge_port="$(docker compose -f "$workdir/docker-compose.ci.yml" port edge 80 | awk -F: '{print $NF}')"

for path in /api/auth/check /api/ranking/stats /api/ranking/top "/api/user/online?platform=discord"; do
  response_file="$(mktemp)"
  ok=0
  for _ in $(seq 1 60); do
    if curl -fsS "http://127.0.0.1:${backend_port}${path}" -o "$response_file"; then
      if [ "$path" = "/api/auth/check" ] && ! grep -Fq '"authenticated":false' "$response_file"; then
        sleep 1
        continue
      fi
      ok=1
      break
    fi
    sleep 1
  done

  if [ "$ok" -ne 1 ]; then
    echo "Backend integration smoke failed for ${path}" >&2
    cat "$response_file" >&2 || true
    exit 1
  fi
done

for path in / /ranking /wiki /profile; do
  response_file="$(mktemp)"
  ok=0
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${edge_port}${path}" -o "$response_file" &&
      grep -Fq '<div id="app">' "$response_file"; then
      ok=1
      break
    fi
    sleep 1
  done

  if [ "$ok" -ne 1 ]; then
    echo "Website integration smoke failed for ${path}" >&2
    cat "$response_file" >&2 || true
    exit 1
  fi
done

docker run --rm \
  --network host \
  -e BASE_URL="http://127.0.0.1:${edge_port}" \
  "$browser_smoke_image" \
  bash -lc '
    set -euo pipefail

    chromium_bin="$(find /ms-playwright -path "*/chrome-linux/chrome" -type f | head -n 1)"
    if [ -z "$chromium_bin" ]; then
      echo "Chromium binary not found in Playwright image" >&2
      exit 1
    fi

    for path in / /ranking /wiki /profile; do
      page_file="$(mktemp)"
      error_file="$(mktemp)"
      if ! "$chromium_bin" \
        --headless \
        --no-sandbox \
        --disable-dev-shm-usage \
        --virtual-time-budget=10000 \
        --dump-dom \
        "${BASE_URL}${path}" > "$page_file" 2> "$error_file"; then
        echo "Browser smoke failed to load ${path}" >&2
        cat "$error_file" >&2 || true
        exit 1
      fi

      if ! grep -Fq "id=\"app\"" "$page_file"; then
        echo "Browser smoke failed for ${path}" >&2
        cat "$error_file" >&2 || true
        cat "$page_file" >&2 || true
        exit 1
      fi
    done
  '
