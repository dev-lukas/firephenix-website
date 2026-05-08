<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div>
        <p class="eyebrow">Admin</p>
        <h2>Dashboard</h2>
      </div>
      <p class="dashboard-copy">
        Serverstatus, Spieleraktionen und Audit-Historie.
      </p>
    </div>

    <p v-if="message" :class="['admin-message', messageType]">{{ message }}</p>

    <div class="dashboard-grid">
      <AdminTttStatus
        :status="tttStatus"
        :loading="tttInitialLoading"
        :refreshing="tttRefreshLoading"
        :action-loading="tttActionLoading"
        :refreshed-at="tttRefreshedAt"
        @refresh="loadTttStatus(true)"
        @command="openTttModal"
      />

      <AdminPlayerSearch
        :admin-fetch="adminFetch"
        @select-player="selectPlayer"
      />
    </div>

    <LoadingSpinner
      v-if="playerDetailLoading"
      message="Spielerdetails werden geladen..."
    />
    <p v-if="playerDetailError" class="admin-message danger">
      {{ playerDetailError }}
    </p>

    <AdminPlayerDetails
      :player="selectedPlayer"
      :admin-fetch="adminFetch"
      :transfer-target="transferTarget"
      :transfer-platforms="transferPlatforms"
      :transfer-reason="transferReason"
      :unlink-platform="unlinkPlatform"
      :unlink-reason="unlinkReason"
      :ignore-platform="ignorePlatform"
      :ignore-reason="ignoreReason"
      :skin-tier="skinTier"
      :skin-reason="skinReason"
      @update:transfer-target="transferTarget = $event"
      @update:transfer-platforms="transferPlatforms = $event"
      @update:transfer-reason="transferReason = $event"
      @update:unlink-platform="unlinkPlatform = $event"
      @update:unlink-reason="unlinkReason = $event"
      @update:ignore-platform="ignorePlatform = $event"
      @update:ignore-reason="ignoreReason = $event"
      @update:skin-tier="skinTier = $event"
      @update:skin-reason="skinReason = $event"
      @review="openPlayerModal"
    />

    <AdminAuditLog
      :entries="auditLog"
      :loading="auditInitialLoading"
      :refreshing="auditRefreshLoading"
      @refresh="loadAuditLog(true)"
    />

    <AdminReviewModal
      :open="modalOpen"
      :title="modalTitle"
      :confirm-label="modalConfirmLabel"
      :notice="modalNotice"
      :submitting="modalSubmitting"
      :error="modalError"
      @close="closeModal"
      @confirm="submitModal"
    >
      <p>{{ modalBody }}</p>
    </AdminReviewModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LoadingSpinner from '../base/LoadingSpinner.vue';
import { useAuthStore } from '../../services/auth';
import AdminAuditLog from './admin/AdminAuditLog.vue';
import AdminPlayerDetails from './admin/AdminPlayerDetails.vue';
import AdminPlayerSearch from './admin/AdminPlayerSearch.vue';
import AdminReviewModal from './admin/AdminReviewModal.vue';
import AdminTttStatus from './admin/AdminTttStatus.vue';
import type {
  AuditEntry,
  Platform,
  PlayerDetail,
  PlayerSummary,
  TttStatus,
} from './admin/types';

type ModalAction =
  | 'tttStart'
  | 'tttStop'
  | 'tttRestart'
  | 'transfer'
  | 'unlink'
  | 'ignoreRole'
  | 'seasonSkin';

const authStore = useAuthStore();
const selectedPlayer = ref<PlayerDetail | null>(null);
const playerDetailLoading = ref(false);
const playerDetailError = ref('');

const tttStatus = ref<TttStatus | null>(null);
const tttInitialLoading = ref(true);
const tttRefreshLoading = ref(false);
const tttActionLoading = ref<'start' | 'stop' | 'restart' | null>(null);
const tttRefreshedAt = ref('');

const auditLog = ref<AuditEntry[]>([]);
const auditInitialLoading = ref(true);
const auditRefreshLoading = ref(false);
let auditRefreshTimer: ReturnType<typeof setInterval> | null = null;

const transferTarget = ref<PlayerSummary | null>(null);
const transferPlatforms = ref<Platform[]>(['teamspeak']);
const transferReason = ref('');
const unlinkPlatform = ref<Platform>('teamspeak');
const unlinkReason = ref('');
const ignorePlatform = ref<Platform>('teamspeak');
const ignoreReason = ref('');
const skinTier = ref(2);
const skinReason = ref('');

const modalAction = ref<ModalAction | null>(null);
const modalOpen = computed(() => modalAction.value !== null);
const modalSubmitting = ref(false);
const modalError = ref('');

const message = ref('');
const messageType = ref<'success' | 'danger'>('success');

const tttCommandEndpoints = {
  start: '/api/gameservers/ttt/start',
  stop: '/api/gameservers/ttt/stop',
  restart: '/api/gameservers/ttt/restart',
};

const showMessage = (text: string, type: 'success' | 'danger' = 'success') => {
  message.value = text;
  messageType.value = type;
};

const adminFetch = async <T = unknown,>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.method && options.method !== 'GET'
        ? authStore.csrfHeaders()
        : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || data.error || 'Admin-Aktion fehlgeschlagen'
    );
  }
  return data as T;
};

const formatNow = () =>
  new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

const loadTttStatus = async (asRefresh = false) => {
  if (asRefresh) {
    tttRefreshLoading.value = true;
  } else {
    tttInitialLoading.value = true;
  }
  try {
    tttStatus.value = await adminFetch<TttStatus>(
      '/api/gameservers/ttt/status'
    );
    tttRefreshedAt.value = formatNow();
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  } finally {
    tttInitialLoading.value = false;
    tttRefreshLoading.value = false;
  }
};

const loadAuditLog = async (asRefresh = false) => {
  if (asRefresh) {
    auditRefreshLoading.value = true;
  } else {
    auditInitialLoading.value = true;
  }
  try {
    const data = await adminFetch<{ entries: AuditEntry[] }>(
      '/api/admin/audit-log'
    );
    auditLog.value = data.entries;
  } catch (error) {
    showMessage((error as Error).message, 'danger');
  } finally {
    auditInitialLoading.value = false;
    auditRefreshLoading.value = false;
  }
};

const selectPlayer = async (id: number) => {
  playerDetailLoading.value = true;
  playerDetailError.value = '';
  transferTarget.value = null;
  try {
    selectedPlayer.value = await adminFetch<PlayerDetail>(
      `/api/admin/players/${id}`
    );
    transferPlatforms.value = selectedPlayer.value.teamspeak_id
      ? ['teamspeak']
      : selectedPlayer.value.discord_id
        ? ['discord']
        : [];
    unlinkPlatform.value = selectedPlayer.value.teamspeak_id
      ? 'teamspeak'
      : 'discord';
    ignorePlatform.value = unlinkPlatform.value;
  } catch (error) {
    playerDetailError.value = (error as Error).message;
  } finally {
    playerDetailLoading.value = false;
  }
};

const openTttModal = (command: 'start' | 'stop' | 'restart') => {
  modalError.value = '';
  modalAction.value =
    command === 'start'
      ? 'tttStart'
      : command === 'stop'
        ? 'tttStop'
        : 'tttRestart';
};

const openPlayerModal = (
  action: 'transfer' | 'unlink' | 'ignoreRole' | 'seasonSkin'
) => {
  modalError.value = '';
  modalAction.value = action;
};

const closeModal = () => {
  if (!modalSubmitting.value) {
    modalAction.value = null;
    modalError.value = '';
  }
};

const selectedPlatformId = (platform: Platform) => {
  if (!selectedPlayer.value) return '';
  return platform === 'discord'
    ? selectedPlayer.value.discord_id
    : selectedPlayer.value.teamspeak_id;
};

const modalTitle = computed(() => {
  const titles: Record<ModalAction, string> = {
    tttStart: 'TTT Server starten',
    tttStop: 'TTT Server stoppen',
    tttRestart: 'TTT Server neu starten',
    transfer: 'Ranking übertragen',
    unlink: 'Steam-Verknüpfung lösen',
    ignoreRole: 'Ignore-Rolle zuweisen',
    seasonSkin: 'Season Skin vergeben',
  };
  return modalAction.value ? titles[modalAction.value] : '';
});

const modalConfirmLabel = computed(() => {
  if (!modalAction.value) return 'Bestätigen';
  if (modalAction.value === 'transfer') return 'Übertragen';
  if (modalAction.value === 'unlink') return 'Lösen';
  if (modalAction.value === 'seasonSkin') return 'Skin vergeben';
  return 'Bestätigen';
});

const modalBody = computed(() => {
  if (!modalAction.value) return '';
  if (modalAction.value === 'tttStart')
    return 'Der TTT Server wird über den Gameserver-Manager gestartet.';
  if (modalAction.value === 'tttStop')
    return 'Der TTT Server wird über den Gameserver-Manager gestoppt.';
  if (modalAction.value === 'tttRestart')
    return 'Der TTT Server wird über den Gameserver-Manager neu gestartet.';
  if (modalAction.value === 'transfer') {
    return `Rankingzeit von ${selectedPlayer.value?.name || 'Quelle'} wird nach ${transferTarget.value?.name || 'Ziel'} übertragen.`;
  }
  if (modalAction.value === 'unlink') {
    return `${unlinkPlatform.value === 'discord' ? 'Discord' : 'TeamSpeak'} wird vom Steam-Konto getrennt.`;
  }
  if (modalAction.value === 'ignoreRole') {
    return `Die Ignore-Rolle wird für ${ignorePlatform.value === 'discord' ? 'Discord' : 'TeamSpeak'} ${selectedPlatformId(ignorePlatform.value)} gesetzt.`;
  }
  return `Tier ${skinTier.value} wird an SteamID64 ${selectedPlayer.value?.steam_id || 'unbekannt'} vergeben.`;
});

const modalNotice = computed(() => {
  if (!modalAction.value) return '';
  if (modalAction.value === 'transfer') {
    return 'Die ausgewählte Plattformzeit wird auf den Zielspieler verschoben. Nach Erfolg wird das Quellkonto für das öffentliche Ranking deaktiviert.';
  }
  if (modalAction.value === 'unlink') {
    return 'Nur die ausgewählte Plattform wird abgespalten. Die verbleibende verknüpfte Plattform bleibt auf dem ursprünglichen User.';
  }
  if (modalAction.value === 'ignoreRole') {
    return `Die Ignore-Rolle betrifft nur das ausgewählte ${ignorePlatform.value === 'discord' ? 'Discord' : 'TeamSpeak'}-Konto.`;
  }
  if (modalAction.value === 'seasonSkin') {
    return 'Der Spieler muss online auf dem TTT Server sein, damit der Season Skin direkt vergeben werden kann.';
  }
  return 'Während die Aktion läuft, bleibt dieser Dialog geöffnet.';
});

const submitModal = async () => {
  if (
    !modalAction.value ||
    (!selectedPlayer.value && !modalAction.value.startsWith('ttt'))
  )
    return;
  modalSubmitting.value = true;
  modalError.value = '';
  try {
    if (
      modalAction.value === 'tttStart' ||
      modalAction.value === 'tttStop' ||
      modalAction.value === 'tttRestart'
    ) {
      const command =
        modalAction.value === 'tttStart'
          ? 'start'
          : modalAction.value === 'tttStop'
            ? 'stop'
            : 'restart';
      tttActionLoading.value = command;
      tttStatus.value = await adminFetch<TttStatus>(
        tttCommandEndpoints[command],
        { method: 'POST' }
      );
      tttRefreshedAt.value = formatNow();
      showMessage(`TTT ${command} gesendet.`);
    } else {
      const player = selectedPlayer.value;
      if (!player) return;

      if (modalAction.value === 'transfer') {
        await adminFetch('/api/admin/ranking/transfer', {
          method: 'POST',
          body: JSON.stringify({
            source_user_id: player.id,
            target_user_id: transferTarget.value?.id,
            platforms: transferPlatforms.value,
            reason: transferReason.value,
          }),
        });
        showMessage('Ranking-Transfer abgeschlossen.');
      } else if (modalAction.value === 'unlink') {
        await adminFetch('/api/admin/steam/unlink', {
          method: 'POST',
          body: JSON.stringify({
            user_id: player.id,
            platform: unlinkPlatform.value,
            reason: unlinkReason.value,
          }),
        });
        showMessage('Steam-Verknüpfung gelöst.');
      } else if (modalAction.value === 'ignoreRole') {
        await adminFetch('/api/admin/ranking/ignore-role', {
          method: 'POST',
          body: JSON.stringify({
            user_id: player.id,
            platform: ignorePlatform.value,
            reason: ignoreReason.value,
          }),
        });
        showMessage('Ignore-Rolle zugewiesen.');
      } else if (modalAction.value === 'seasonSkin') {
        await adminFetch('/api/admin/ttt/season-skin', {
          method: 'POST',
          body: JSON.stringify({
            steam_id64: player.steam_id,
            tier: skinTier.value,
            reason: skinReason.value,
          }),
        });
        showMessage('Season Skin vergeben.');
      }

      await Promise.all([loadAuditLog(true), selectPlayer(player.id)]);
    }
  } catch (error) {
    modalError.value = (error as Error).message;
    showMessage((error as Error).message, 'danger');
    return;
  } finally {
    modalSubmitting.value = false;
    tttActionLoading.value = null;
  }
  closeModal();
};

onMounted(() => {
  loadTttStatus().catch(() => {});
  loadAuditLog().catch(() => {});
  auditRefreshTimer = setInterval(() => {
    loadAuditLog(true).catch(() => {});
  }, 15000);
});

onUnmounted(() => {
  if (auditRefreshTimer) {
    clearInterval(auditRefreshTimer);
  }
});
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
}

.dashboard-header {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.dashboard-header h2,
.eyebrow,
.dashboard-copy {
  margin: 0;
}

.dashboard-header h2 {
  color: var(--clr-text-primary);
  font-size: 1.6rem;
}

.eyebrow {
  color: var(--clr-primary);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.dashboard-copy {
  color: var(--clr-text-secondary);
}

.dashboard-grid {
  align-items: start;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
}

.admin-message {
  border-radius: 8px;
  margin: 0;
  padding: 1rem;
}

.admin-message.success {
  background: rgba(46, 204, 113, 0.16);
  color: #69e698;
}

.admin-message.danger {
  background: rgba(220, 53, 69, 0.16);
  color: #ff8f9a;
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
