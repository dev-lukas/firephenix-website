<template>
  <router-link
    :to="to"
    class="nav-item"
    :class="{ active: isActive }"
    v-if="to"
  >
    <slot></slot>
  </router-link>
  <a v-else class="nav-item" :href="href" :target="target">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  to?: string;
  href?: string;
  target?: '_blank' | '_self';
}>();

const route = useRoute();
const isActive = computed(() => props.to === route.path);
</script>

<style scoped>
.nav-item {
  color: var(--clr-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  font-weight: 500;
}

.nav-item:hover,
.nav-item.active {
  color: var(--clr-text-primary);
}
</style>
