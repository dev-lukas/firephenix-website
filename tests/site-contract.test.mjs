import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const readAdminSource = async () => {
  const files = await Promise.all([
    read('src/components/profile/AdminDashboard.vue'),
    read('src/components/profile/admin/AdminAuditLog.vue'),
    read('src/components/profile/admin/AdminPlayerDetails.vue'),
    read('src/components/profile/admin/AdminPlayerPicker.vue'),
    read('src/components/profile/admin/AdminPlayerSearch.vue'),
    read('src/components/profile/admin/AdminReviewModal.vue'),
    read('src/components/profile/admin/AdminTttStatus.vue'),
  ]);
  return files.join('\n');
};

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
    assert.match(
      router,
      new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
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
    readAdminSource(),
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
    '/api/admin/players/search',
    '/api/admin/ranking/transfer',
    '/api/admin/ranking/ignore-role',
    '/api/admin/steam/unlink',
    '/api/admin/ttt/season-skin',
    '/api/admin/audit-log',
    '/api/gameservers/ttt/status',
    '/api/gameservers/ttt/start',
    '/api/gameservers/ttt/stop',
    '/api/gameservers/ttt/restart',
  ]) {
    assert.match(
      source,
      new RegExp(endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
  }
});

test('admin dashboard surfaces backend response messages', async () => {
  const adminDashboard = await read(
    'src/components/profile/AdminDashboard.vue'
  );

  assert.match(
    adminDashboard,
    /data\.message \|\| data\.error \|\| 'Admin-Aktion fehlgeschlagen'/
  );
});

test('admin dashboard exposes loading states for async operations', async () => {
  const admin = await readAdminSource();

  for (const expected of [
    'Spielersuche läuft',
    'Spielerdetails werden geladen',
    'TTT Status wird geladen',
    'Audit Log wird geladen',
    'Bitte nicht neu laden',
    'modalSubmitting',
  ]) {
    assert.match(admin, new RegExp(expected));
  }
});

test('admin audit log refreshes every 15 seconds and clears on unmount', async () => {
  const adminDashboard = await read(
    'src/components/profile/AdminDashboard.vue'
  );

  assert.match(adminDashboard, /setInterval\(\(\) => \{/);
  assert.match(adminDashboard, /\}, 15000\)/);
  assert.match(adminDashboard, /onUnmounted\(\(\) => \{/);
  assert.match(adminDashboard, /clearInterval\(auditRefreshTimer\)/);
});

test('admin actions use review modals with explicit notices', async () => {
  const admin = await readAdminSource();

  for (const expected of [
    'AdminReviewModal',
    'Der Spieler muss online auf dem TTT Server sein',
    'Quellkonto für das öffentliche Ranking deaktiviert',
    'Nur die ausgewählte Plattform wird abgespalten',
    'Die Ignore-Rolle betrifft nur das ausgewählte',
  ]) {
    assert.match(admin, new RegExp(expected));
  }
});

test('admin copy uses German umlauts instead of old ASCII fallbacks', async () => {
  const admin = await readAdminSource();

  for (const expected of [
    'für',
    'übertragen',
    'lösen',
    'gelöst',
    'Verknüpfung',
  ]) {
    assert.match(admin, new RegExp(expected));
  }

  assert.doesNotMatch(admin, /fuer|uebertragen|loesen|geloest|Verknuepfung/);
});

test('ranking transfer target selection is search based', async () => {
  const admin = await readAdminSource();

  assert.match(admin, /AdminPlayerPicker/);
  assert.match(admin, /\/api\/admin\/players\/search\?q=/);
  assert.doesNotMatch(admin, /target_user_id[^]*type="number"/);
});

test('admin TTT status panel reflects direct public server query', async () => {
  const statusPanel = await read(
    'src/components/profile/admin/AdminTttStatus.vue'
  );

  assert.match(statusPanel, /Direkte Serverabfrage/);
  assert.match(statusPanel, /firephenix\.de:27015/);
  assert.match(statusPanel, />Adresse</);
  assert.doesNotMatch(statusPanel, /Serverstatus aus dem Manager/);
});

test('nginx serves the SPA fallback with security headers', async () => {
  const nginx = await read('nginx.conf');

  assert.match(nginx, /try_files \$uri \$uri\/ \/index\.html;/);
  assert.match(nginx, /X-Frame-Options "SAMEORIGIN"/);
  assert.match(nginx, /X-Content-Type-Options "nosniff"/);
  assert.match(nginx, /Referrer-Policy "strict-origin-when-cross-origin"/);
});
