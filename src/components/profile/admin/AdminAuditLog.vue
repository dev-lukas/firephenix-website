<template>
  <section class="admin-panel">
    <div class="section-header">
      <div>
        <p class="eyebrow">Historie</p>
        <h3>Audit Log</h3>
      </div>
      <BaseButton
        variant="secondary"
        :disabled="loading || refreshing"
        @click="$emit('refresh')"
      >
        <span v-if="refreshing" class="inline-spinner"></span>
        Aktualisieren
      </BaseButton>
    </div>

    <LoadingSpinner v-if="loading" message="Audit Log wird geladen..." />
    <TransitionGroup
      v-else-if="entries.length"
      name="admin-list"
      tag="div"
      class="audit-list"
    >
      <article v-for="entry in entries" :key="entry.id" class="audit-entry">
        <button class="audit-summary" type="button" @click="toggle(entry.id)">
          <span class="audit-primary">
            <strong>{{ actionLabel(entry.action) }}</strong>
            <small>Akteur: {{ entry.admin_steam_id }}</small>
            <small>{{ targetSummary(entry) }}</small>
          </span>
          <span class="audit-meta">
            <span
              :class="[
                'status-pill',
                entry.result_status === 'success' ? 'success' : 'danger',
              ]"
            >
              {{
                entry.result_status === 'success'
                  ? 'erfolgreich'
                  : 'fehlgeschlagen'
              }}
            </span>
            <time>{{ formatDate(entry.created_at) }}</time>
          </span>
        </button>
        <Transition name="admin-fade">
          <div v-if="expandedIds.has(entry.id)" class="audit-details">
            <dl>
              <div>
                <dt>Akteur</dt>
                <dd>{{ entry.admin_steam_id }}</dd>
              </div>
              <div>
                <dt>Ziel</dt>
                <dd>
                  <pre>{{ stringify(entry.target_identifiers) }}</pre>
                </dd>
              </div>
              <div>
                <dt>Details</dt>
                <dd>
                  <pre>{{ stringify(entry.summary) }}</pre>
                </dd>
              </div>
            </dl>
          </div>
        </Transition>
      </article>
    </TransitionGroup>
    <p v-else class="empty-state">Noch keine Audit-Einträge vorhanden.</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import LoadingSpinner from '../../base/LoadingSpinner.vue';
import type { AuditEntry } from './types';

defineProps<{
  entries: AuditEntry[];
  loading: boolean;
  refreshing: boolean;
}>();

defineEmits<{
  (e: 'refresh'): void;
}>();

const expandedIds = ref(new Set<number>());

const toggle = (id: number) => {
  const next = new Set(expandedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedIds.value = next;
};

const actionLabel = (action: string) => {
  const labels: Record<string, string> = {
    ranking_transfer: 'Ranking übertragen',
    steam_unlink: 'Steam-Verknüpfung lösen',
    ranking_ignore_role: 'Ignore-Rolle zuweisen',
    ttt_season_skin_grant: 'Season Skin vergeben',
  };
  return labels[action] || action;
};

const targetSummary = (entry: AuditEntry) => {
  const target = entry.target_identifiers;
  if (target.source_user_id && target.target_user_id) {
    return `Quelle #${target.source_user_id} → Ziel #${target.target_user_id}`;
  }
  if (target.user_id && target.platform) {
    return `User #${target.user_id} · ${target.platform}`;
  }
  if (target.steam_id64) {
    return `SteamID64 ${target.steam_id64}`;
  }
  return 'Kein Ziel erfasst';
};

const formatDate = (date: string | null) => {
  if (!date) return 'unbekannt';
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
};

const stringify = (value: Record<string, unknown>) =>
  JSON.stringify(value, null, 2);
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

.audit-list {
  display: grid;
  gap: 0.75rem;
}

.audit-entry {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  overflow: hidden;
}

.audit-summary {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--clr-text-primary);
  cursor: pointer;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
  text-align: left;
  width: 100%;
}

.audit-summary small,
.audit-meta time,
.empty-state,
dt {
  color: var(--clr-text-secondary);
}

.audit-primary {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}

.audit-meta {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  white-space: nowrap;
}

.status-pill {
  border-radius: 999px;
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
}

.status-pill.success {
  background: rgba(46, 204, 113, 0.16);
  color: #69e698;
}

.status-pill.danger {
  background: rgba(220, 53, 69, 0.16);
  color: #ff8f9a;
}

.audit-details {
  border-top: 1px solid var(--clr-border);
  padding: 1rem;
}

dl {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

dl div {
  display: grid;
  gap: 0.35rem;
}

dd {
  margin: 0;
}

pre {
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  margin: 0;
  max-height: 220px;
  overflow: auto;
  padding: 0.75rem;
  white-space: pre-wrap;
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
.admin-list-leave-active,
.admin-fade-enter-active,
.admin-fade-leave-active {
  transition: all 0.18s ease;
}

.admin-list-enter-from,
.admin-list-leave-to,
.admin-fade-enter-from,
.admin-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .section-header,
  .audit-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .audit-meta {
    align-items: flex-start;
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-list-enter-active,
  .admin-list-leave-active,
  .admin-fade-enter-active,
  .admin-fade-leave-active,
  .inline-spinner {
    animation: none;
    transition: none;
  }
}
</style>
