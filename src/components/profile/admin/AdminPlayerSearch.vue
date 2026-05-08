<template>
  <section class="admin-panel">
    <div class="section-header">
      <div>
        <p class="eyebrow">Spieler</p>
        <h3>Spieler suchen</h3>
      </div>
      <div class="search-row">
        <input
          v-model="query"
          class="admin-input"
          type="search"
          placeholder="Name, SteamID, Discord ID oder TeamSpeak ID"
          @keyup.enter="searchPlayers"
        />
        <BaseButton
          variant="primary"
          :disabled="loading || query.trim().length < 2"
          @click="searchPlayers"
        >
          <span v-if="loading" class="inline-spinner"></span>
          Suchen
        </BaseButton>
      </div>
    </div>

    <LoadingSpinner v-if="loading" message="Spielersuche läuft..." />
    <TransitionGroup v-else name="admin-list" tag="div" class="settings-list">
      <button
        v-for="player in players"
        :key="player.id"
        class="settings-item player-result"
        type="button"
        @click="$emit('select-player', player.id)"
      >
        <span>
          <strong>{{ player.name }}</strong>
          <small
            >#{{ player.id }} · Level {{ player.level }} · Division
            {{ player.division }}</small
          >
        </span>
        <span v-if="player.ranking_disabled" class="status-pill danger"
          >Ranking deaktiviert</span
        >
      </button>
    </TransitionGroup>

    <p
      v-if="hasSearched && !loading && players.length === 0"
      class="empty-state"
    >
      Keine Spieler gefunden.
    </p>
    <p v-if="error" class="error-state">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import LoadingSpinner from '../../base/LoadingSpinner.vue';
import type { AdminFetch, PlayerSummary } from './types';

const props = defineProps<{
  adminFetch: AdminFetch;
}>();

defineEmits<{
  (e: 'select-player', id: number): void;
}>();

const query = ref('');
const players = ref<PlayerSummary[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const error = ref('');

const searchPlayers = async () => {
  hasSearched.value = true;
  error.value = '';
  if (query.value.trim().length < 2) {
    players.value = [];
    return;
  }
  loading.value = true;
  try {
    const data = await props.adminFetch<{ players: PlayerSummary[] }>(
      `/api/admin/players/search?q=${encodeURIComponent(query.value.trim())}`
    );
    players.value = data.players;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.admin-panel {
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.section-header {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 0.8fr) minmax(280px, 1.2fr);
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

.search-row {
  align-items: center;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 1fr) auto;
}

.admin-input {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  min-height: 42px;
  padding: 0.75rem;
  width: 100%;
}

.settings-list {
  display: grid;
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

.settings-item small,
.empty-state {
  color: var(--clr-text-secondary);
}

.status-pill {
  border-radius: 999px;
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  white-space: nowrap;
}

.status-pill.danger {
  background: rgba(220, 53, 69, 0.16);
  color: #ff8f9a;
}

.error-state {
  color: #ff8f9a;
  margin: 0;
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

.admin-list-enter-active,
.admin-list-leave-active {
  transition: all 0.18s ease;
}

.admin-list-enter-from,
.admin-list-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .section-header,
  .search-row {
    grid-template-columns: 1fr;
  }

  .settings-item {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-list-enter-active,
  .admin-list-leave-active,
  .inline-spinner {
    animation: none;
    transition: none;
  }
}
</style>
