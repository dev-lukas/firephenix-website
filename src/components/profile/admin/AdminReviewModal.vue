<template>
  <Teleport to="body">
    <Transition name="admin-modal">
      <div v-if="open" class="admin-modal-backdrop" @click.self="requestClose">
        <section
          class="admin-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Aktion prüfen</p>
              <h3 :id="titleId">{{ title }}</h3>
            </div>
            <button
              class="icon-button"
              type="button"
              aria-label="Dialog schließen"
              :disabled="submitting"
              @click="requestClose"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </header>

          <div class="modal-body">
            <slot></slot>
            <p v-if="notice" class="modal-notice">{{ notice }}</p>
            <p v-if="error" class="modal-error">{{ error }}</p>
            <div v-if="submitting" class="modal-submitting" role="status">
              <span class="inline-spinner"></span>
              <span>Bitte nicht neu laden</span>
            </div>
          </div>

          <footer class="modal-actions">
            <BaseButton
              variant="secondary"
              :disabled="submitting"
              @click="requestClose"
            >
              Abbrechen
            </BaseButton>
            <BaseButton
              variant="primary"
              :disabled="submitting"
              @click="$emit('confirm')"
            >
              <span v-if="submitting" class="inline-spinner small"></span>
              {{ confirmLabel }}
            </BaseButton>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '../../base/BaseButton.vue';

const props = defineProps<{
  open: boolean;
  title: string;
  confirmLabel: string;
  submitting: boolean;
  notice?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const titleId = computed(
  () => `admin-modal-${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
);

const requestClose = () => {
  if (!props.submitting) {
    emit('close');
  }
};
</script>

<style scoped>
.admin-modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 1000;
}

.admin-modal {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-strong);
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  color: var(--clr-text-primary);
  max-width: 520px;
  width: min(100%, 520px);
}

.modal-header,
.modal-actions {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.modal-header {
  border-bottom: 1px solid var(--clr-border);
}

.modal-header h3,
.modal-kicker {
  margin: 0;
}

.modal-kicker {
  color: var(--clr-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.modal-body {
  color: var(--clr-text-secondary);
  display: grid;
  gap: 0.85rem;
  line-height: 1.5;
  padding: 1rem;
  text-align: left;
}

.modal-notice {
  background: var(--clr-primary-transparent);
  border: 1px solid var(--clr-border-strong);
  border-radius: 8px;
  color: var(--clr-text-primary);
  margin: 0;
  padding: 0.85rem;
}

.modal-error {
  background: rgba(220, 53, 69, 0.16);
  border: 1px solid rgba(220, 53, 69, 0.35);
  border-radius: 8px;
  color: #ff8f9a;
  margin: 0;
  padding: 0.85rem;
}

.modal-submitting {
  align-items: center;
  color: var(--clr-primary-light);
  display: flex;
  gap: 0.6rem;
}

.modal-actions {
  border-top: 1px solid var(--clr-border);
  justify-content: flex-end;
}

.icon-button {
  align-items: center;
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.inline-spinner {
  animation: admin-spin 0.8s linear infinite;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  border-top-color: var(--clr-primary-light);
  display: inline-block;
  height: 18px;
  width: 18px;
}

.inline-spinner.small {
  height: 14px;
  margin-right: 0.4rem;
  width: 14px;
}

.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.2s ease;
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-modal-enter-active,
  .admin-modal-leave-active,
  .inline-spinner {
    animation: none;
    transition: none;
  }
}
</style>
