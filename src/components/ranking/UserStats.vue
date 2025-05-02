<!-- components/stats/UserStats.vue -->
<template>
  <div class="user-stats">
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'users']" />
      <div class="stat-info">
        <span class="stat-value">{{ animatedStats.total_users }}</span>
        <span class="stat-label">Nutzer</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'signal']" />
      <div class="stat-info">
        <span class="stat-value">{{ animatedStats.online_users }}</span>
        <span class="stat-label">Online</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'clock']" />
      <div class="stat-info">
        <span class="stat-value">{{ animatedStats.total_time }}</span>
        <span class="stat-label">Spielstunden</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
      <div class="stat-info">
        <span class="stat-value">{{ animatedStats.total_logins }}</span>
        <span class="stat-label">Logins</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'calendar-day']" />
      <div class="stat-info">
        <span class="stat-value">{{ formatDay(stats.favorite_day) }}</span>
        <span class="stat-label">Beliebtester Tag</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const stats = ref({
  total_users: 0,
  total_time: 0,
  online_users: 0,
  favorite_day: 0,
  total_logins: 0,
});

const animatedStats = ref({
  total_users: 0,
  total_time: 0,
  online_users: 0,
  total_logins: 0,
});

const animateValue = (key, to, duration = 1000) => {
  const start = animatedStats.value[key];
  const change = to - start;
  const startTime = performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    if (elapsed < duration) {
      animatedStats.value[key] = Math.round(start + change * (elapsed / duration));
      requestAnimationFrame(step);
    } else {
      animatedStats.value[key] = to;
    }
  };
  requestAnimationFrame(step);
};

const fetchStats = async () => {
  try {
    const response = await fetch('/api/ranking/stats');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Animate each stat
    animateValue('total_users', data.total_users || 0);
    animateValue('online_users', data.online_users || 0);
    animateValue('total_logins', data.total_logins || 0);
    // For total_time, animate Spielstunden (minutes to hours)
    animateValue('total_time', Math.round((data.total_time || 0) / 60));
    stats.value = data;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const formatMinutes = (minutes) => {
  return Math.round(minutes / 60);
};

const formatDay = (dayIndex) => {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
    'Donnerstag', 'Freitag', 'Samstag'];
  return days[dayIndex] || '-';
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}

@media (max-width: 1024px) {
  .user-stats {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .user-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .user-stats {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(249, 133, 0, 0.1);
}

.stat-card svg {
  font-size: 2.5rem;
  color: rgba(249, 133, 0, 0.9);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-label {
  color: #999;
  font-size: 1rem;
}
</style>
