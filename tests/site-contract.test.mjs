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
    read('src/components/gameserver/TttServerSection.vue'),
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
    '/api/admin/players/${player.id}/time',
    '/api/admin/players/${player.id}/join-date',
    '/api/admin/special-achievements',
    '/api/admin/special-achievements/grant',
    '/api/admin/special-achievements/revoke',
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

test('game server page exposes TTT status and community groups tabs', async () => {
  const files = await Promise.all([
    read('src/views/GameServer.vue'),
    read('src/components/gameserver/TttServerSection.vue'),
    read('src/components/gameserver/CommunityGroupsSection.vue'),
  ]);
  const source = files.join('\n');

  for (const expected of [
    "'ttt', 'groups'",
    'TTT Server',
    'Community',
    '/api/gameservers/ttt/status',
    'setInterval(fetchStatus, STATUS_REFRESH_MS)',
    'clearInterval(refreshTimer)',
    'FirePhenixDE',
    'https://steamcommunity.com/groups/firephenixde',
    'Star Citizen',
    'https://robertsspaceindustries.com/en/orgs/FPXORG',
    'GTA 5',
    'Der GTA 5 Gruppe kannst du nur direkt im Spiel beitreten. Melde dich bei Philip, damit er dich zur Gruppe hinzufügen kann.',
    'Flippster98 (Philip)',
    'Stellaris Modliste',
    'https://steamcommunity.com/sharedfiles/filedetails/?id=2590878195',
    'Arma 3 Modliste',
    'https://steamcommunity.com/sharedfiles/filedetails/?id=2541208071',
    'Eigene FirePhenix Gruppe oder Inhalte?',
    'Lukas irgendwo Bescheid geben',
    'mailto:admin@firephenix.de',
  ]) {
    assert.match(source, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('player achievements render TTT achievement categories and assets', async () => {
  const achievements = await read('src/components/ranking/PlayerAchievements.vue');

  for (const expected of [
    'ttt_rounds_played: 4',
    'ttt_rounds_won: 4',
    'ttt_kills: 4',
    "getTttImg('rounds_played', index)",
    "getTttImg('rounds_won', index)",
    "getTttImg('kills', index)",
    'achievements.value.ttt?.achievement_level',
    'Spiele 100 TTT Runden',
    'Gewinne 50 TTT Runden',
    'Erziele 250 TTT Eliminierungen',
  ]) {
    assert.match(achievements, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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

test('admin audit log defaults to five rows and can expand', async () => {
  const admin = await readAdminSource();

  assert.match(admin, /auditExpanded\.value \? 50 : 5/);
  assert.match(admin, /has_more/);
  assert.match(admin, /Mehr anzeigen/);
  assert.match(admin, /Weniger anzeigen/);
});

test('admin actions use review modals with explicit notices', async () => {
  const admin = await readAdminSource();

  for (const expected of [
    'AdminReviewModal',
    'Der Spieler muss online auf dem TTT Server sein',
    'Quellkonto für das öffentliche Ranking deaktiviert',
    'Nur die ausgewählte Plattform wird abgespalten',
    'Die Ignore-Rolle betrifft nur das ausgewählte',
    'Die Aktion nutzt nur verlinkte Plattformen',
    'Das Achievement wird nur auf die ausgewählte aktuell verlinkte Plattform',
  ]) {
    assert.match(admin, new RegExp(expected));
  }
});

test('admin player corrections are guarded to linked active users', async () => {
  const admin = await readAdminSource();

  for (const expected of [
    'Rankingzeit korrigieren',
    'Beitrittsdatum',
    'Spezial-Achievements',
    'aktive Spieler mit verlinkter Plattform',
    'linkedPlatforms',
    'achievementGranted',
    'Saisonzeit darf nicht größer als Gesamtzeit sein',
  ]) {
    assert.match(admin, new RegExp(expected));
  }

  assert.doesNotMatch(admin, /update:platformId/);
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
  assert.doesNotMatch(admin, /target_user_id[^<]{0,200}type="number"/);
});

test('admin TTT status panel reflects direct public server query', async () => {
  const statusPanel = await read(
    'src/components/profile/admin/AdminTttStatus.vue'
  );

  assert.match(statusPanel, /Direkte Serverabfrage/);
  assert.match(statusPanel, /firephenix\.de:27015/);
  assert.match(statusPanel, />Adresse</);
  assert.match(statusPanel, /class="status-copy"/);
  assert.doesNotMatch(statusPanel, /Serverstatus aus dem Manager/);
});

test('admin audit log labels actor separately from target', async () => {
  const auditLog = await read('src/components/profile/admin/AdminAuditLog.vue');

  assert.match(auditLog, /Akteur: \{\{ entry\.admin_steam_id \}\}/);
  assert.match(auditLog, /<dt>Akteur<\/dt>/);
  assert.match(auditLog, /<dt>Ziel<\/dt>/);
  assert.match(auditLog, /class="audit-primary"/);
});

test('nginx serves the SPA fallback with security headers', async () => {
  const nginx = await read('nginx.conf');

  assert.match(nginx, /try_files \$uri \$uri\/ \/index\.html;/);
  assert.match(nginx, /X-Frame-Options "SAMEORIGIN"/);
  assert.match(nginx, /X-Content-Type-Options "nosniff"/);
  assert.match(nginx, /Referrer-Policy "strict-origin-when-cross-origin"/);
});
