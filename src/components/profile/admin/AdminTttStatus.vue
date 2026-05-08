<template>
  <section class="admin-panel">
    <div class="section-header">
      <div>
        <p class="eyebrow">Gameserver</p>
        <h3>TTT Server</h3>
      </div>
      <BaseButton
        variant="secondary"
        :disabled="loading || refreshing"
        @click="$emit('refresh')"
      >
        <span v-if="refreshing" class="inline-spinner"></span>
        Status aktualisieren
      </BaseButton>
    </div>

    <LoadingSpinner v-if="loading" message="TTT Status wird geladen..." />
    <div v-else class="status-layout">
      <div class="status-card">
        <div class="status-title">
          <span :class="['status-dot', statusTone]"></span>
          <div>
            <strong>{{ statusLabel }}</strong>
            <small>{{ statusMessage }}</small>
          </div>
        </div>
        <div class="metric-grid">
          <div class="metric">
            <span>Spieler</span>
            <strong>{{ playerCount }}</strong>
          </div>
          <div class="metric">
            <span>Map</span>
            <strong>{{ currentMap }}</strong>
          </div>
          <div class="metric">
            <span>Adresse</span>
            <strong>{{ serverAddress }}</strong>
          </div>
          <div class="metric">
            <span>Letzter Refresh</span>
            <strong>{{ refreshedAt || 'Noch nicht' }}</strong>
          </div>
        </div>
      </div>

      <div class="action-card">
        <button
          v-for="command in commands"
          :key="command.id"
          class="server-action"
          :class="command.id"
          type="button"
          :disabled="!!actionLoading"
          @click="$emit('command', command.id)"
        >
          <font-awesome-icon :icon="command.icon" />
          <span>{{ command.label }}</span>
          <span
            v-if="actionLoading === command.id"
            class="inline-spinner"
          ></span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import LoadingSpinner from '../../base/LoadingSpinner.vue';
import type { TttStatus } from './types';

const props = defineProps<{
  status: TttStatus | null;
  loading: boolean;
  refreshing: boolean;
  actionLoading: 'start' | 'stop' | 'restart' | null;
  refreshedAt: string;
}>();

defineEmits<{
  (e: 'refresh'): void;
  (e: 'command', command: 'start' | 'stop' | 'restart'): void;
}>();

const commands = [
  { id: 'start' as const, label: 'Start', icon: ['fas', 'play'] },
  { id: 'restart' as const, label: 'Restart', icon: ['fas', 'sync'] },
  { id: 'stop' as const, label: 'Stop', icon: ['fas', 'times'] },
];

const rawState = computed(() =>
  String(props.status?.status || props.status?.state || '').toLowerCase()
);

const asString = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : null;

const asNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const statusTone = computed(() => {
  if (!props.status) return 'unknown';
  if (rawState.value.includes('online') || props.status.ok === true)
    return 'online';
  if (rawState.value.includes('offline') || props.status.ok === false)
    return 'offline';
  return 'unknown';
});

const statusLabel = computed(() => {
  if (!props.status) return 'Unbekannt';
  if (statusTone.value === 'online') return 'Online';
  if (statusTone.value === 'offline') return 'Offline';
  return props.status.status || props.status.state || 'Unbekannt';
});

const statusMessage = computed(
  () =>
    props.status?.message ||
    props.status?.error ||
    props.status?.name ||
    'Direkte Serverabfrage'
);

const playerCount = computed(() => {
  const players = props.status?.players;
  if (typeof players === 'number') return String(players);
  if (players && typeof players === 'object') {
    const current = players.current ?? props.status?.current_players;
    const max = players.max ?? props.status?.max_players;
    if (current == null) return 'unbekannt';
    return max ? `${current}/${max}` : String(current);
  }

  const current =
    asNumber(props.status?.current_players) ??
    asNumber(props.status?.player_count) ??
    asNumber(props.status?.num_players) ??
    asNumber(props.status?.clients);
  const max =
    asNumber(props.status?.max_players) ??
    asNumber(props.status?.maxplayers) ??
    asNumber(props.status?.max_clients);

  if (current == null) return 'unbekannt';
  return max ? `${current}/${max}` : String(current);
});

const currentMap = computed(
  () =>
    asString(props.status?.current_map) ||
    asString(props.status?.map) ||
    asString(props.status?.map_name) ||
    'unbekannt'
);

const serverAddress = computed(() => {
  const host = asString(props.status?.host);
  const port = asNumber(props.status?.port);
  if (host && port) return `${host}:${port}`;
  if (host) return host;
  return 'firephenix.de:27015';
});
</script>

<style scoped>
.admin-panel {
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.section-header {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header h3,
.eyebrow {
  margin: 0;
}

.section-header h3 {
  color: var(--clr-text-primary);
}

.eyebrow {
  color: var(--clr-primary);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-layout {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.34fr);
}

.status-card,
.action-card {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1rem;
}

.status-title {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.status-title strong,
.metric strong {
  color: var(--clr-text-primary);
}

.status-title small,
.metric span {
  color: var(--clr-text-secondary);
}

.status-dot {
  border-radius: 50%;
  height: 14px;
  width: 14px;
}

.status-dot.online {
  background: #2ecc71;
  box-shadow: 0 0 0 5px rgba(46, 204, 113, 0.13);
}

.status-dot.offline {
  background: var(--clr-error);
  box-shadow: 0 0 0 5px rgba(220, 53, 69, 0.13);
}

.status-dot.unknown {
  background: var(--clr-surface-4);
  box-shadow: 0 0 0 5px rgba(153, 153, 153, 0.12);
}

.metric-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric {
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  display: grid;
  gap: 0.2rem;
  min-width: 0;
  padding: 0.85rem;
}

.metric strong {
  overflow-wrap: anywhere;
}

.action-card {
  display: grid;
  gap: 0.75rem;
}

.server-action {
  align-items: center;
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  cursor: pointer;
  display: flex;
  gap: 0.65rem;
  justify-content: center;
  min-height: 44px;
}

.server-action.start {
  border-color: rgba(46, 204, 113, 0.35);
}

.server-action.stop {
  border-color: rgba(220, 53, 69, 0.35);
}

.server-action:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.inline-spinner {
  animation: admin-spin 0.8s linear infinite;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  border-top-color: var(--clr-primary-light);
  display: inline-block;
  height: 14px;
  margin-right: 0.4rem;
  width: 14px;
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .status-layout,
  .metric-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inline-spinner {
    animation: none;
  }
}
</style>
