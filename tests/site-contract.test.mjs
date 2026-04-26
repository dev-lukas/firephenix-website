import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('router exposes all public and authenticated application routes', async () => {
  const router = await read('src/router.ts');

  for (const route of [
    "path: '/'",
    "path: '/wiki'",
    "path: '/gameserver'",
    "path: '/ranking'",
    "path: '/ranking/player-:id'",
    "path: '/profile'",
    "path: '/dataprivacy'",
    "path: '/impressum'",
  ]) {
    assert.match(router, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(router, /document\.title = `FirePhenix - /);
});

test('frontend keeps expected backend API contract paths', async () => {
  const files = await Promise.all([
    read('src/services/auth.ts'),
    read('src/components/profile/PlatformVerification.vue'),
    read('src/components/profile/ChannelCreation.vue'),
    read('src/components/profile/MoveShield.vue'),
    read('src/components/profile/SkinUnlocker.vue'),
    read('src/components/ranking/RankingList.vue'),
    read('src/views/Profile.vue'),
  ]);
  const source = files.join('\n');

  for (const endpoint of [
    '/api/auth/check',
    '/api/auth/logout',
    '/api/user',
    '/api/user/online?platform=discord',
    '/api/user/online?platform=teamspeak',
    '/api/user/profile/verification/initiate',
    '/api/user/profile/verification/verify',
    '/api/user/profile/channel',
    '/api/user/profile/channel/apex',
    '/api/user/profile/moveshield',
    '/api/user/profile/skins',
    '/api/ranking/top',
  ]) {
    assert.match(source, new RegExp(endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('nginx serves the SPA fallback with security headers', async () => {
  const nginx = await read('nginx.conf');

  assert.match(nginx, /try_files \$uri \$uri\/ \/index\.html;/);
  assert.match(nginx, /X-Frame-Options "SAMEORIGIN"/);
  assert.match(nginx, /X-Content-Type-Options "nosniff"/);
  assert.match(nginx, /Referrer-Policy "strict-origin-when-cross-origin"/);
});
