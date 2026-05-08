<template>
  <div class="admin-dashboard">
    <section class="settings-section-container">
      <div class="section-header">
        <h3>Spieler suchen</h3>
        <div class="search-row">
          <input
            v-model="searchQuery"
            class="admin-input"
            type="search"
            placeholder="Name, SteamID, Discord ID oder TeamSpeak ID"
            @keyup.enter="searchPlayers"
          />
          <BaseButton variant="primary" @click="searchPlayers">Suchen</BaseButton>
        </div>
      </div>

      <div class="settings-list">
        <button
          v-for="player in players"
          :key="player.id"
          class="settings-item player-result"
          type="button"
          @click="selectPlayer(player.id)"
        >
          <span>
            <strong>{{ player.name }}</strong>
            <small>#{{ player.id }} - Level {{ player.level }} - Division {{ player.division }}</small>
          </span>
          <span v-if="player.ranking_disabled" class="status-pill danger">Ranking deaktiviert</span>
        </button>
        <p v-if="hasSearched && players.length === 0" class="empty-state">Keine Spieler gefunden.</p>
      </div>
    </section>

    <section v-if="selectedPlayer" class="settings-section-container">
      <div class="section-header">
        <h3>{{ selectedPlayer.name }}</h3>
        <p>
          Steam: {{ selectedPlayer.steam_id || 'nicht verlinkt' }} -
          Discord: {{ selectedPlayer.discord_id || 'nicht verlinkt' }} -
          TeamSpeak: {{ selectedPlayer.teamspeak_id || 'nicht verlinkt' }}
        </p>
      </div>

      <div class="admin-grid">
        <label class="field">
          Quelle
          <input v-model.number="transfer.source_user_id" class="admin-input" type="number" />
        </label>
        <label class="field">
          Ziel
          <input v-model.number="transfer.target_user_id" class="admin-input" type="number" />
        </label>
        <label class="checkbox-field">
          <input v-model="transfer.platforms" type="checkbox" value="teamspeak" />
          TeamSpeak
        </label>
        <label class="checkbox-field">
          <input v-model="transfer.platforms" type="checkbox" value="discord" />
          Discord
        </label>
      </div>
      <textarea v-model="transfer.reason" class="admin-textarea" placeholder="Grund fuer den Ranking-Transfer"></textarea>
      <BaseButton variant="primary" @click="submitTransfer">Ranking uebertragen</BaseButton>

      <div class="divider"></div>

      <div class="admin-grid">
        <label class="field">
          User ID
          <input v-model.number="unlink.user_id" class="admin-input" type="number" />
        </label>
        <label class="field">
          Plattform
          <select v-model="unlink.platform" class="admin-input">
            <option value="teamspeak">TeamSpeak</option>
            <option value="discord">Discord</option>
          </select>
        </label>
      </div>
      <textarea v-model="unlink.reason" class="admin-textarea" placeholder="Grund fuer das Steam-Unlinking"></textarea>
      <BaseButton variant="secondary" @click="submitUnlink">Steam-Verlinkung loesen</BaseButton>

      <div class="divider"></div>

      <div class="admin-grid">
        <label class="field">
          User ID
          <input v-model.number="ignoreRole.user_id" class="admin-input" type="number" />
        </label>
        <label class="field">
          Plattform
          <select v-model="ignoreRole.platform" class="admin-input">
            <option value="teamspeak">TeamSpeak</option>
            <option value="discord">Discord</option>
          </select>
        </label>
      </div>
      <textarea v-model="ignoreRole.reason" class="admin-textarea" placeholder="Grund fuer die Ignore-Rolle"></textarea>
      <BaseButton variant="secondary" @click="assignIgnoreRole">Ignore-Rolle zuweisen</BaseButton>
    </section>

    <section class="settings-section-container">
      <div class="section-header">
        <h3>TTT Server</h3>
        <p>Status: {{ serverStatusText }}</p>
      </div>
      <div class="button-row">
        <BaseButton variant="secondary" @click="loadTttStatus">Status</BaseButton>
        <BaseButton variant="primary" @click="confirmTttCommand('start')">Start</BaseButton>
        <BaseButton variant="secondary" @click="confirmTttCommand('restart')">Restart</BaseButton>
        <BaseButton variant="secondary" @click="confirmTttCommand('stop')">Stop</BaseButton>
      </div>
      <pre v-if="tttStatus" class="json-output">{{ JSON.stringify(tttStatus, null, 2) }}</pre>
    </section>

    <section class="settings-section-container">
      <div class="section-header">
        <h3>Season Skin vergeben</h3>
      </div>
      <div class="admin-grid">
        <label class="field">
          SteamID64
          <input v-model="skinGrant.steam_id64" class="admin-input" inputmode="numeric" />
        </label>
        <label class="field">
          Tier
          <select v-model.number="skinGrant.tier" class="admin-input">
            <option v-for="tier in [2, 3, 4, 5, 6]" :key="tier" :value="tier">Tier {{ tier }}</option>
          </select>
        </label>
      </div>
      <textarea v-model="skinGrant.reason" class="admin-textarea" placeholder="Grund fuer den Grant"></textarea>
      <BaseButton variant="primary" @click="grantSeasonSkin">Skin vergeben</BaseButton>
    </section>

    <section class="settings-section-container">
      <div class="section-header">
        <h3>Audit Log</h3>
        <BaseButton variant="secondary" @click="loadAuditLog">Aktualisieren</BaseButton>
      </div>
      <div class="settings-list">
        <div v-for="entry in auditLog" :key="entry.id" class="settings-item audit-entry">
          <span>
            <strong>{{ entry.action }}</strong>
            <small>{{ entry.created_at }} - {{ entry.admin_steam_id }}</small>
          </span>
          <span :class="['status-pill', entry.result_status === 'success' ? 'success' : 'danger']">
            {{ entry.result_status }}
          </span>
        </div>
      </div>
    </section>

    <p v-if="message" :class="['admin-message', messageType]">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import BaseButton from '../base/BaseButton.vue';
import { useAuthStore } from '../../services/auth';

interface PlayerSummary {
  id: number;
  steam_id: string | null;
  discord_id: string | null;
  teamspeak_id: string | null;
  name: string;
  level: number;
  division: number;
  ranking_disabled: boolean;
}

interface AuditEntry {
  id: number;
  admin_steam_id: string;
  action: string;
  result_status: string;
  created_at: string;
}

const authStore = useAuthStore();
const searchQuery = ref('');
const players = ref<PlayerSummary[]>([]);
const selectedPlayer = ref<any>(null);
const hasSearched = ref(false);
const tttStatus = ref<any>(null);
const auditLog = ref<AuditEntry[]>([]);
const message = ref('');
const messageType = ref<'success' | 'danger'>('success');

const transfer = reactive({
  source_user_id: null as number | null,
  target_user_id: null as number | null,
  platforms: ['teamspeak'] as string[],
  reason: '',
});

const unlink = reactive({
  user_id: null as number | null,
  platform: 'teamspeak',
  reason: '',
});

const ignoreRole = reactive({
  user_id: null as number | null,
  platform: 'teamspeak',
  reason: '',
});

const skinGrant = reactive({
  steam_id64: '',
  tier: 2,
  reason: '',
});

const serverStatusText = computed(() => {
  if (!tttStatus.value) return 'unbekannt';
  return tttStatus.value.status || tttStatus.value.state || (tttStatus.value.ok ? 'online' : 'Fehler');
});

const tttCommandEndpoints = {
  start: '/api/gameservers/ttt/start',
  stop: '/api/gameservers/ttt/stop',
  restart: '/api/gameservers/ttt/restart',
};

const showMessage = (text: string, type: 'success' | 'danger' = 'success') => {
  message.value = text;
  messageType.value = type;
};

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.method && options.method !== 'GET' ? authStore.csrfHeaders() : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Admin-Aktion fehlgeschlagen');
  }
  return data;
};

const searchPlayers = async () => {
  hasSearched.value = true;
  const data = await adminFetch(`/api/admin/players/search?q=${encodeURIComponent(searchQuery.value)}`);
  players.value = data.players;
};

const selectPlayer = async (id: number) => {
  selectedPlayer.value = await adminFetch(`/api/admin/players/${id}`);
  transfer.source_user_id = id;
  unlink.user_id = id;
  ignoreRole.user_id = id;
};

const submitTransfer = async () => {
  try {
    await adminFetch('/api/admin/ranking/transfer', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
    showMessage('Ranking-Transfer abgeschlossen.');
    await loadAuditLog();
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  }
};

const submitUnlink = async () => {
  try {
    await adminFetch('/api/admin/steam/unlink', {
      method: 'POST',
      body: JSON.stringify(unlink),
    });
    showMessage('Steam-Verlinkung geloest.');
    await loadAuditLog();
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  }
};

const assignIgnoreRole = async () => {
  try {
    await adminFetch('/api/admin/ranking/ignore-role', {
      method: 'POST',
      body: JSON.stringify(ignoreRole),
    });
    showMessage('Ignore-Rolle zugewiesen.');
    await loadAuditLog();
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  }
};

const loadTttStatus = async () => {
  tttStatus.value = await adminFetch('/api/gameservers/ttt/status');
};

const confirmTttCommand = async (command: 'start' | 'stop' | 'restart') => {
  if (!window.confirm(`TTT Server wirklich ${command}?`)) return;
  try {
    tttStatus.value = await adminFetch(tttCommandEndpoints[command], { method: 'POST' });
    showMessage(`TTT ${command} gesendet.`);
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  }
};

const grantSeasonSkin = async () => {
  try {
    await adminFetch('/api/admin/ttt/season-skin', {
      method: 'POST',
      body: JSON.stringify(skinGrant),
    });
    showMessage('Season Skin vergeben.');
    await loadAuditLog();
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  }
};

const loadAuditLog = async () => {
  const data = await adminFetch('/api/admin/audit-log');
  auditLog.value = data.entries;
};

onMounted(() => {
  loadAuditLog().catch(() => {});
  loadTttStatus().catch(() => {});
});
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section-container {
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-header h3 {
  color: var(--clr-text-primary);
  margin: 0;
}

.section-header p,
.empty-state,
.settings-item small {
  color: var(--clr-text-secondary);
}

.search-row,
.button-row,
.admin-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin-grid {
  align-items: end;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex: 1 1 220px;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--clr-text-secondary);
  text-align: left;
}

.checkbox-field {
  align-items: center;
  color: var(--clr-text-primary);
  display: flex;
  gap: 0.5rem;
  min-height: 42px;
}

.admin-input,
.admin-textarea {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  min-height: 42px;
  padding: 0.75rem;
  width: 100%;
}

.admin-textarea {
  min-height: 86px;
  resize: vertical;
  margin-bottom: 1rem;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-item {
  align-items: center;
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  text-align: left;
}

.player-result {
  cursor: pointer;
}

.status-pill {
  border-radius: 999px;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
}

.status-pill.success {
  background: var(--clr-success-transparent, rgba(46, 204, 113, 0.16));
  color: var(--clr-success, #2ecc71);
}

.status-pill.danger {
  background: var(--clr-error-transparent, rgba(231, 76, 60, 0.16));
  color: var(--clr-error);
}

.divider {
  border-top: 1px solid var(--clr-border);
  margin: 1.5rem 0;
}

.json-output {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-secondary);
  margin-top: 1rem;
  max-height: 220px;
  overflow: auto;
  padding: 1rem;
  text-align: left;
}

.admin-message {
  border-radius: 8px;
  padding: 1rem;
}

.admin-message.success {
  background: var(--clr-success-transparent, rgba(46, 204, 113, 0.16));
  color: var(--clr-success, #2ecc71);
}

.admin-message.danger {
  background: var(--clr-error-transparent, rgba(231, 76, 60, 0.16));
  color: var(--clr-error);
}

@media (max-width: 768px) {
  .search-row,
  .button-row {
    flex-direction: column;
  }

  .settings-item {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
