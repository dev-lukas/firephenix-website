<template>
  <div class="member-since" v-if="createdAt">
    <font-awesome-icon :icon="['fas', 'calendar-day']" class="member-icon" />
    <span class="member-text">Mitglied seit {{ formattedDate }}</span>
    <span class="member-days">{{ daysSince }} Tage dabei</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  createdAt: { type: String, default: null },
});

const formattedDate = computed(() => {
  if (!props.createdAt) return '';
  const d = new Date(props.createdAt);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
});

const daysSince = computed(() => {
  if (!props.createdAt) return 0;
  return Math.floor((Date.now() - new Date(props.createdAt).getTime()) / 86400000);
});
</script>

<style scoped>
.member-since {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  background: var(--clr-surface-2);
  border-radius: 20px;
  border: 1px solid var(--clr-border);
  width: fit-content;
  margin: 0 auto 1.5rem;
  opacity: 0;
  animation: fade-in 0.6s var(--transition-smooth) 0.3s forwards;
}

@keyframes fade-in {
  to { opacity: 1; }
}

.member-icon {
  color: var(--clr-primary);
  font-size: 0.85rem;
}

.member-text {
  color: var(--clr-text-secondary);
  font-size: 0.85rem;
}

.member-days {
  color: var(--clr-primary);
  font-size: 0.85rem;
  font-weight: 600;
  padding-left: 0.5rem;
  border-left: 1px solid var(--clr-border);
}
</style>
