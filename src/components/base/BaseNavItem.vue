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
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  transition: color 0.25s ease, background 0.25s ease;
  font-weight: 500;
  font-size: 0.9rem;
  position: relative;
}

.nav-item:hover {
  color: var(--clr-text-primary);
  background: var(--clr-transparent-light);
}

.nav-item.active {
  color: var(--clr-primary);
}
</style>
