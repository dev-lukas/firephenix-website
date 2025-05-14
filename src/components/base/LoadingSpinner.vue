<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <span v-if="message" class="loading-message">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--clr-surface-2);
  border-top: 3px solid var(--clr-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
