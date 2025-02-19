<template>
  <section class="base-section" :class="{ centered }">
    <div class="section-content">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  centered?: boolean;
}>();
</script>

<style scoped>
.base-section {
  width: 100%;
  padding: 4rem 2rem;
  position: relative;
}

.centered {
  text-align: center;
}

.section-content {
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .base-section {
    padding: 2rem 1rem;
  }
}
</style>
