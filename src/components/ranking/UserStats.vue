<!-- components/stats/UserStats.vue -->
<template>
  <div class="user-stats">
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'users']" />
      <div class="stat-info">
        <span class="stat-value">{{ stats.total_users || 0 }}</span>
        <span class="stat-label">Nutzer</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'signal']" />
      <div class="stat-info">
        <span class="stat-value">{{ stats.online_users || 0 }}</span>
        <span class="stat-label">Online</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'clock']" />
      <div class="stat-info">
        <span class="stat-value">{{
          formatMinutes(stats.total_time || 0)
        }}</span>
        <span class="stat-label">Spielstunden</span>
      </div>
    </div>
    <div class="stat-card">
      <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
      <div class="stat-info">
        <span class="stat-value">{{ stats.total_logins || 0 }}</span>
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
import { ref, onMounted } from 'vue';

const stats = ref({
  total_users: 0,
  total_time: 0,
  online_users: 0,
  favorite_day: 0,
  total_logins: 0,
});

const fetchStats = async () => {
  try {
    const response = await fetch('/api/ranking/stats');
    if (!response.ok) throw new Error('Network response was not ok');
    stats.value = await response.json();
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
