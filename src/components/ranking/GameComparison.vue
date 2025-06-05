<template>
  <div class="games-comparison">
    <h3>In dieser Zeit konnte man:</h3>
    <div class="games-list">
      <div class="games-column">
        <div v-for="(game, index) in leftGames" :key="index" class="game-entry">
          <span class="count">{{ leftGameCounts[index].value }}</span>
          <span>{{ game.label }}</span>
        </div>
      </div>
      <div class="games-column">
        <div v-for="(game, index) in rightGames" :key="index" class="game-entry">
          <span class="count">{{ rightGameCounts[index].value }}</span>
          <span>{{ game.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue';

const props = defineProps({
  totalTime: {
    type: Number,
    required: true,
  },
});

const leftGames = [
  { divisor: 8, label: 'TTT Runden spielen' },
  { divisor: 35, label: 'League of Legends Runden spielen' },
  { divisor: 40, label: 'Counter-Strike 2 Runden spielen' },
  { divisor: 3600, label: 'mal Elden Ring durchspielen' },
];

const rightGames = [
  { divisor: 60, label: 'Podcasts hören' },
  { divisor: 132, label: 'Filme schauen' },
  { divisor: 360, label: 'km laufen' },
  { divisor: 440, label: 'Bücher lesen' },
];

const calculateCount = (time, divisor) => Math.floor(time / divisor);

const leftGameCounts = leftGames.map(() => ref(0));
const rightGameCounts = rightGames.map(() => ref(0));

function animateValue(refValue, target, duration = 1200) {
  const start = 0;
  const startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    refValue.value = Math.round(start + (target - start) * eased);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      refValue.value = target;
    }
  }
  requestAnimationFrame(animate);
}

function updateAndAnimateCounts() {
  leftGames.forEach((game, i) => {
    const count = calculateCount(props.totalTime, game.divisor);
    animateValue(leftGameCounts[i], count);
  });
  rightGames.forEach((game, i) => {
    const count = calculateCount(props.totalTime, game.divisor);
    animateValue(rightGameCounts[i], count);
  });
}

onMounted(() => {
  updateAndAnimateCounts();
});

watch(() => props.totalTime, (newValue) => {
  if (newValue !== undefined) {
    updateAndAnimateCounts();
  }
});
</script>

<style scoped>
.games-comparison {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  z-index: 1;
  position: relative;
  margin-bottom: 2rem;
}

.games-comparison h3 {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--clr-border);
}

.games-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}

.games-column {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.game-entry {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.game-entry .count {
  color: var(--clr-primary);
  font-weight: 600;
}

@media (min-width: 768px) {
  .games-list {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    position: relative;
  }

  .games-list::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.1) 80%,
      transparent
    );
  }
}
</style>
