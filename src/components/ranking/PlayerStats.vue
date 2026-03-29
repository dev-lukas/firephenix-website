<template>
  <div class="stats-grid">
    <div class="stat-card streak-card" :class="{ 'hot-streak': currentStreak >= 7 }">
      <font-awesome-icon :icon="['fas', 'fire']" class="streak-icon" />
      <div class="stat-info">
        <span class="stat-value">{{ displayCurrentStreak }} Tage</span>
        <span class="stat-label">Aktuelle Streak</span>
        <span class="streak-best">Rekord: {{ bestStreak }} Tage</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'clock']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(displayDailyTime) }}</span>
        <span class="stat-label">Heute</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'clock']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(displayTotalTime) }}</span>
        <span class="stat-label">Gesamtzeit</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'calendar-alt']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(displayMonthlyTime) }}</span>
        <span class="stat-label">Diesen Monat</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'calendar-week']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(displayWeeklyTime) }}</span>
        <span class="stat-label">Diese Woche</span>
      </div>
    </div>

    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'trophy']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatTime(displaySeasonTime) }}</span>
        <span class="stat-label">Season Zeit</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps({
  totalTime: { type: Number, required: true },
  monthlyTime: { type: Number, required: true },
  weeklyTime: { type: Number, required: true },
  seasonTime: { type: Number, required: true },
  dailyTime: { type: Number, default: 0 },
  streak: {
    type: Object,
    required: true,
    default: () => ({
      discord: { current: 0, longest: 0 },
      teamspeak: { current: 0, longest: 0 },
    }),
  },
});

const currentStreak = computed(() => Math.max(
  props.streak?.discord?.current || 0,
  props.streak?.teamspeak?.current || 0
));

const bestStreak = computed(() => Math.max(
  props.streak?.discord?.longest || 0,
  props.streak?.teamspeak?.longest || 0
));

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes} Minuten`;
  if (hours === 1) return '1 Stunde';
  return `${hours} Stunden`;
};

const displayTotalTime = ref(0);
const displayMonthlyTime = ref(0);
const displayWeeklyTime = ref(0);
const displaySeasonTime = ref(0);
const displayDailyTime = ref(0);
const displayCurrentStreak = ref(0);

function animateValue(refValue, targetProp, duration = 1200) {
  const numericTarget = Number(targetProp) || 0;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    refValue.value = Math.round(numericTarget * eased);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      refValue.value = numericTarget;
    }
  }
  requestAnimationFrame(animate);
}

onMounted(() => {
  animateValue(displayTotalTime, props.totalTime);
  animateValue(displayMonthlyTime, props.monthlyTime);
  animateValue(displayWeeklyTime, props.weeklyTime);
  animateValue(displaySeasonTime, props.seasonTime);
  animateValue(displayDailyTime, props.dailyTime);
  animateValue(displayCurrentStreak, currentStreak.value, 800);
});

watch(() => props.totalTime, (v) => animateValue(displayTotalTime, v));
watch(() => props.monthlyTime, (v) => animateValue(displayMonthlyTime, v));
watch(() => props.weeklyTime, (v) => animateValue(displayWeeklyTime, v));
watch(() => props.seasonTime, (v) => animateValue(displaySeasonTime, v));
watch(() => props.dailyTime, (v) => animateValue(displayDailyTime, v));
watch(currentStreak, (v) => animateValue(displayCurrentStreak, v, 800));
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  z-index: 1;
  position: relative;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transform: translateY(16px);
  animation: card-enter 0.5s var(--transition-smooth) forwards;
}

.stat-card:nth-child(1) { animation-delay: 0ms; }
.stat-card:nth-child(2) { animation-delay: 60ms; }
.stat-card:nth-child(3) { animation-delay: 120ms; }
.stat-card:nth-child(4) { animation-delay: 180ms; }
.stat-card:nth-child(5) { animation-delay: 240ms; }
.stat-card:nth-child(6) { animation-delay: 300ms; }
.stat-card:nth-child(7) { animation-delay: 360ms; }

@keyframes card-enter {
  to { opacity: 1; transform: translateY(0); }
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--clr-border-strong);
  transition: transform 0.3s var(--transition-bounce),
              box-shadow 0.3s var(--transition-smooth),
              border-color 0.3s ease;
}

.stat-card svg {
  font-size: 2.5rem;
  color: var(--clr-primary);
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

/* Streak card */
.streak-icon {
  font-size: 2.5rem;
  color: var(--clr-primary);
}

.streak-best {
  font-size: 0.78rem;
  color: var(--clr-text-secondary);
  opacity: 0.7;
}

.hot-streak {
  border-color: var(--clr-primary-transparent-strong);
  box-shadow: 0 0 20px rgba(249, 133, 0, 0.08);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
