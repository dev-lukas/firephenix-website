<template>
  <div class="player-picker">
    <label class="field">
      {{ label }}
      <div class="picker-search">
        <input
          v-model="query"
          class="admin-input"
          type="search"
          :placeholder="placeholder"
          @keyup.enter="runSearch"
        />
        <BaseButton
          size="small"
          variant="secondary"
          :disabled="loading || query.trim().length < 2"
          @click="runSearch"
        >
          <span v-if="loading" class="inline-spinner"></span>
          Suchen
        </BaseButton>
      </div>
    </label>

    <Transition name="admin-fade">
      <div v-if="selected" class="selected-player">
        <span>
          <strong>{{ selected.name }}</strong>
          <small
            >#{{ selected.id }} · Level {{ selected.level }} · Division
            {{ selected.division }}</small
          >
        </span>
        <button type="button" @click="$emit('update:selected', null)">
          Ändern
        </button>
      </div>
    </Transition>

    <LoadingSpinner v-if="loading" message="Spieler werden gesucht..." />
    <TransitionGroup
      v-else-if="results.length"
      name="admin-list"
      tag="div"
      class="picker-results"
    >
      <button
        v-for="player in results"
        :key="player.id"
        class="picker-result"
        type="button"
        @click="choose(player)"
      >
        <span>
          <strong>{{ player.name }}</strong>
          <small
            >#{{ player.id }} · Steam
            {{ player.steam_id || 'nicht verlinkt' }}</small
          >
        </span>
        <span v-if="player.ranking_disabled" class="status-pill danger"
          >Ranking deaktiviert</span
        >
      </button>
    </TransitionGroup>

    <p
      v-if="hasSearched && !loading && results.length === 0"
      class="empty-state"
    >
      Keine Spieler gefunden.
    </p>
    <p v-if="error" class="error-state">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import LoadingSpinner from '../../base/LoadingSpinner.vue';
import type { AdminFetch, PlayerSummary } from './types';

const props = withDefaults(
  defineProps<{
    adminFetch: AdminFetch;
    selected: PlayerSummary | null;
    label: string;
    placeholder?: string;
  }>(),
  {
    placeholder: 'Name, SteamID, Discord ID oder TeamSpeak ID',
  }
);

const emit = defineEmits<{
  (e: 'update:selected', player: PlayerSummary | null): void;
}>();

const query = ref('');
const results = ref<PlayerSummary[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const error = ref('');

const runSearch = async () => {
  hasSearched.value = true;
  error.value = '';
  if (query.value.trim().length < 2) {
    results.value = [];
    return;
  }
  loading.value = true;
  try {
    const data = await props.adminFetch<{ players: PlayerSummary[] }>(
      `/api/admin/players/search?q=${encodeURIComponent(query.value.trim())}`
    );
    results.value = data.players;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const choose = (player: PlayerSummary) => {
  emit('update:selected', player);
  results.value = [];
};
</script>

<style scoped>
.player-picker {
  display: grid;
  gap: 0.75rem;
}

.field {
  color: var(--clr-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-align: left;
}

.picker-search {
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

.selected-player,
.picker-result {
  align-items: center;
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0.85rem;
  text-align: left;
}

.selected-player small,
.picker-result small,
.empty-state {
  color: var(--clr-text-secondary);
}

.selected-player button {
  background: transparent;
  border: 0;
  color: var(--clr-primary-light);
  cursor: pointer;
}

.picker-results {
  display: grid;
  gap: 0.6rem;
}

.picker-result {
  cursor: pointer;
  width: 100%;
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

.admin-fade-enter-active,
.admin-fade-leave-active,
.admin-list-enter-active,
.admin-list-leave-active {
  transition: all 0.18s ease;
}

.admin-fade-enter-from,
.admin-fade-leave-to,
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

@media (max-width: 640px) {
  .picker-search,
  .selected-player,
  .picker-result {
    grid-template-columns: 1fr;
  }

  .selected-player,
  .picker-result {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-fade-enter-active,
  .admin-fade-leave-active,
  .admin-list-enter-active,
  .admin-list-leave-active,
  .inline-spinner {
    animation: none;
    transition: none;
  }
}
</style>
