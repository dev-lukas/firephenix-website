<template>
  <base-section class="legal-page">
    <base-box class="legal-container">
      <h1 class="legal-title">{{ title }}</h1>
      <div class="legal-content">
        <slot></slot>
      </div>
      <div v-if="lastUpdated" class="last-updated">
        Zuletzt aktualisiert: {{ lastUpdated }}
      </div>
    </base-box>
  </base-section>
</template>

<script setup lang="ts">
import BaseSection from './BaseSection.vue';
import BaseBox from './BaseBox.vue';

defineProps<{
  title: string;
  lastUpdated?: string;
}>();
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 20px 40px;
}

.legal-container {
  max-width: 800px;
  margin: 0 auto;
}

.legal-title {
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.legal-content {
  color: var(--clr-text-secondary);
  line-height: 1.6;
}

.legal-content :deep(h2) {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
}

.legal-content :deep(h3) {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem;
}

.legal-content :deep(p) {
  margin-bottom: 1rem;
}

.legal-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
}

.legal-content :deep(a) {
  color: var(--clr-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.legal-content :deep(a:hover) {
  color: var(--clr-primary-hover);
}

.last-updated {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--clr-border);
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  text-align: right;
}

@media (max-width: 768px) {
  .legal-page {
    padding: 80px 10px 20px;
  }
  .legal-title {
    font-size: 1.8rem;
  }
}
</style>
