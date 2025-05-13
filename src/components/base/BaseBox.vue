<template>
  <div class="base-box" :class="{ elevated: elevated, hoverable: hoverable }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  elevated?: boolean;
  hoverable?: boolean;
}>();
</script>

<style scoped>
.base-box {
  background: var(--clr-surface);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  backdrop-filter: blur(12px);
  z-index: 1;
  position: relative;
  overflow: hidden;
}

.elevated {
  background: var(--clr-surface);
  box-shadow: 0 2px 2px var(--clr-border);
}

.hoverable {
  transition: all 0.3s ease;
}

.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px var(--clr-border);
}
</style>
