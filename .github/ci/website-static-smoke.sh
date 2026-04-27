#!/usr/bin/env bash
set -euo pipefail

image="${IMAGE_UNDER_TEST:?IMAGE_UNDER_TEST is required}"
container_id="$(docker run -d --rm -p 127.0.0.1::80 "$image")"

cleanup() {
  docker stop "$container_id" >/dev/null 2>&1 || true
}
trap cleanup EXIT

port="$(docker inspect --format '{{ (index (index .NetworkSettings.Ports "80/tcp") 0).HostPort }}' "$container_id")"

for path in / /ranking /wiki /profile; do
  response_file="$(mktemp)"
  ok=0
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${port}${path}" -o "$response_file" &&
      grep -Fq '<div id="app">' "$response_file"; then
      ok=1
      break
    fi
    sleep 1
  done

  if [ "$ok" -ne 1 ]; then
    echo "Website static smoke failed for ${path}" >&2
    cat "$response_file" >&2 || true
    docker logs "$container_id" >&2 || true
    exit 1
  fi
done
