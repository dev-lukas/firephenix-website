<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="modal-backdrop"
      @click="$emit('update:modelValue', false)"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <slot name="title"></slot>
          </h3>
          <button
            class="close-button"
            @click="$emit('update:modelValue', false)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-content">
          <slot></slot>
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--clr-surface-elevated-1);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--clr-border);
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--clr-border);
}

.modal-title {
  font-size: 1.2rem;
  color: var(--clr-text-primary);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--clr-text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: var(--clr-text-primary);
}

.modal-content {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--clr-border);
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(20px);
}
</style>
