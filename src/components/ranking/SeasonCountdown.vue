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


const targetDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);


const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);


let countdownInterval = null;


const calculateTimeRemaining = () => {
  const now = new Date();
  const difference = targetDate - now;
  
  if (difference <= 0) {
    targetDate.setFullYear(targetDate.getFullYear() + 1);
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
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(249, 133, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.countdown-title {
  color: #f98500;
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
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-value {
  font-size: 2rem;
  font-weight: 700;
  color: #f98500;
  margin-bottom: 0.5rem;
}

.countdown-label {
  font-size: 0.9rem;
  color: #999;
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