<template>
  <div class="season-countdown">
    <h2 class="countdown-title">Season endet in:</h2>
    <div class="countdown-container">
      <div class="countdown-item">
        <div class="countdown-value">{{ days }}</div>
        <div class="countdown-label">Tage</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value">{{ hours }}</div>
        <div class="countdown-label">Stunden</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value">{{ minutes }}</div>
        <div class="countdown-label">Minuten</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value">{{ seconds }}</div>
        <div class="countdown-label">Sekunden</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const getNextSeasonDate = () => {
  const now = new Date();
  const thisYear = now.getFullYear();
  const julyFirst = new Date(thisYear, 5, 1, 23, 59, 59); 
  if (now > julyFirst) {
    return new Date(thisYear + 1, 6, 1, 23, 59, 59);
  }
  return julyFirst;
};

let targetDate = getNextSeasonDate();

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let countdownInterval = null;

const calculateTimeRemaining = () => {
  const now = new Date();
  const difference = targetDate - now;
  
  if (difference <= 0) {
    targetDate = getNextSeasonDate();
    calculateTimeRemaining();
    return;
  }
  
  days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
};

onMounted(() => {
  calculateTimeRemaining();
  countdownInterval = setInterval(calculateTimeRemaining, 1000);
});

onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.season-countdown {
  background: var(--clr-surface);
  border: 2px solid var(--clr-border);
  z-index: 1;
  position: relative;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px var(--clr-box-shado);
}

.countdown-title {
  color: var(--clr-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.countdown-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.countdown-item {
  min-width: 80px;
  padding: 1rem;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--clr-primary);
  margin-bottom: 0.5rem;
}

.countdown-label {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .countdown-container {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .countdown-item {
    min-width: 70px;
    padding: 0.8rem;
  }
  
  .countdown-value {
    font-size: 1.5rem;
  }
  
  .countdown-label {
    font-size: 0.8rem;
  }
}
</style>