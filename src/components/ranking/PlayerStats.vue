<template>
  <div class="stats-grid">
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'fire']" />
      <div class="stat-info">
        <span class="stat-value">{{ bestStreak }}</span>
        <span class="stat-label">Beste Streak</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'clock']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(totalTime) }}</span>
        <span class="stat-label">Gesamtzeit</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'calendar-alt']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(monthlyTime) }}</span>
        <span class="stat-label">Diesen Monat</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'calendar-week']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(weeklyTime) }}</span>
        <span class="stat-label">Diese Woche</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'trophy']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(seasonTime) }}</span>
        <span class="stat-label">Saison Zeit</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  totalTime: {
    type: Number,
    required: true,
  },
  monthlyTime: {
    type: Number,
    required: true,
  },
  weeklyTime: {
    type: Number,
    required: true,
  },
  seasonTime: {
    type: Number,
    required: true,
  },
  streak: {
    type: Object,
    required: true,
    default: () => ({
      discord: {
        current: 0,
        longest: 0,
      },
      teamspeak: {
        current: 0,
        longest: 0,
      },
    }),
  },
});

const bestStreak = computed(() => Math.max(
  props.streak.discord.longest,
  props.streak.teamspeak.longest
));

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes} Minuten`;
  if (hours === 1) return '1 Stunde';
  return `${hours} Stunden`;
};
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.5rem;
  color: var(--clr-primary);
  background: var(--clr-surface-elevated-1);
  padding: 1rem;
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    padding: 0.8rem;
    font-size: 1.2rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}

.stat-card svg {
  font-size: 2.5rem;
  color: var(--clr-primary);
}
</style>
