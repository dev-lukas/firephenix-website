<template>
  <div class="error-container">
    <div class="error-icon">
      <i class="fas fa-exclamation-circle"></i>
    </div>
    <h3 class="error-title">Ein Fehler ist aufgetreten</h3>
    <p class="error-message">{{ error }}</p>
    <BaseButton variant="primary" @click="$emit('retry')">
      <i class="fas fa-sync"></i>
      Erneut versuchen
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  error: {
    type: String,
    required: true,
  },
});

defineEmits(['retry']);
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
}

.error-icon {
  font-size: 3rem;
  color: #dc3545;
}

.error-title {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  font-weight: 600;
}

.error-message {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}
</style>
