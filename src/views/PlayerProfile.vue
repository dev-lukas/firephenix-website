<!-- components/profile/UserProfile.vue -->
<template>
  <div class="profile-container">
    <div v-if="loading" class="loading-overlay">
      <LoadingSpinner message="Lade Profil..." />
    </div>

    <template v-else-if="error">
      <ErrorDisplay :error="error" @retry="fetchPlayerData" />
    </template>

    <template v-else-if="player">
      <PlayerHeader :name="player.name" :level="player.level" />

      <LevelProgress
        :level="player.level"
        :total-time="player.total_time"
        :time-to-next-level="player.time_to_next_level"
      />

      <PlayerStats
        :total-time="player.total_time"
        :monthly-time="player.monthly_time"
        :weekly-time="player.weekly_time"
      />

      <GameComparison :total-time="player.total_time" />

      <HeatMapChart :heatmap-data="player.activity_heatmap" />

      <PlayerChart :player-data="player" ref="hoursChart" />

      <PlayerPercentile :rank-percentage="player.rank_percentage" />

      <PlayerAchievements />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Chart, registerables, type ChartType } from 'chart.js';
import PlayerAchievements from '../components/ranking/PlayerAchievements.vue';
import { useErrorHandling } from '../composables/useErrorHandling';
import type { Player } from '../types/player';
import PlayerHeader from '../components/ranking/PlayerHeader.vue';
import LevelProgress from '../components/ranking/LevelProgress.vue';
import PlayerStats from '../components/ranking/PlayerStats.vue';
import PlayerPercentile from '../components/ranking/PlayerPercentile.vue';
import GameComparison from '../components/ranking/GameComparison.vue';
import PlayerChart from '../components/ranking/PlayerChart.vue';
import LoadingSpinner from '../components/base/LoadingSpinner.vue';
import ErrorDisplay from '../components/base/ErrorDisplay.vue';
import HeatMapChart from '../components/ranking/HeatMapChart.vue';

Chart.register(...registerables);

const route = useRoute();
const player = ref<Player | null>(null);
const { error, loading, handleError } = useErrorHandling();
const hoursChart = ref<HTMLCanvasElement | null>(null);
let chart: Chart<ChartType> | null = null;

const playerId = route.params.id.toString().replace('player-', '');

const createChart = () => {
  if (!hoursChart.value || !player.value) return;
  const ctx = hoursChart.value.getContext('2d');
  if (!ctx) return;

  if (chart) {
    chart.destroy();
  }

  const { best_player_time, total_time, mean_total_time } = player.value;

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Top Spieler', 'Deine Stunden', 'Durchschnitt'],
      datasets: [
        {
          label: 'Spielzeit',
          data: [
            Math.floor(best_player_time / 60),
            Math.floor(total_time / 60),
            Math.floor(mean_total_time / 60),
          ],
          backgroundColor: [
            'rgba(255, 255, 255, 0.2)',
            'rgba(249, 133, 0, 0.9)',
            'rgba(255, 255, 255, 0.2)',
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Spielzeit im Vergleich',
          color: '#fff',
          font: {
            size: 16,
            weight: 'normal',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            display: false,
          },
          ticks: {
            color: '#999',
            font: { size: 12 },
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: '#999',
            font: { size: 12 },
          },
        },
      },
    },
  });
};

const fetchPlayerData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/ranking/profile?id=${playerId}`);
    if (!response.ok) throw new Error('Failed to fetch player data');
    player.value = await response.json();
    setTimeout(createChart, 0);
  } catch (err) {
    handleError(err instanceof Error ? err : 'An unexpected error occurred');
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.id,
  () => {
    fetchPlayerData();
  }
);

onMounted(() => {
  fetchPlayerData();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 40px 6vh;
  color: var(--clr-text-primary);
  width: 100%;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.player-name {
  font-size: 2.2rem;
  color: var(--clr-text-primary);
  margin-bottom: 1rem;
  font-weight: 600;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--clr-surface);
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  color: var(--clr-primary);
  border: 1px solid var(--clr-border);
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.games-comparison {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
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
.stat-card {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid var(--clr-border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  color: var(--clr-primary);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 133, 0, 0.1);
  padding: 0.8rem;
  border-radius: 10px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-value {
  color: var(--clr-text-primary);
  font-size: 1.4rem;
  font-weight: 600;
}

.stat-label {
  color: var(--clr-text-secondary);
  font-size: 0.85rem;
}

.progress-section {
  margin-bottom: 2rem;
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--clr-primary);
  transition: width 0.3s ease;
}

.percentile-card {
  margin-top: 1.5rem;
  text-align: center;
  background: rgba(249, 133, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.percentile-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-primary);
  margin-bottom: 0.2rem;
}

.percentile-label {
  font-size: 0.85rem;
  color: var(--clr-text-secondary);
}

.chart-container {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  margin-top: 2rem;
  height: 350px;
}

.level-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.level-image-container {
  width: 15vh;
  height: 15vh;
  margin-top: 0.5rem;
  border-radius: 50%;
  border: 2px solid var(--clr-primary);
  padding: 8px;
  background: var(--clr-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--clr-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid var(--clr-border);
  border-bottom-color: var(--clr-primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: rotation 1s linear infinite;
}

.loading-text {
  display: block;
  font-size: 1.2rem;
  color: var(--clr-text-primary);
  margin-bottom: 0.5rem;
}

.loading-subtext {
  display: block;
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
}

.error-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  background: var(--clr-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--clr-border);
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  color: #cc0033;
  margin-bottom: 1rem;
}

.error-title {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--clr-text-secondary);
  margin-bottom: 1.5rem;
}

.retry-button {
  background: var(--clr-primary);
  color: var(--clr-text-primary);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.retry-button:hover {
  opacity: 0.9;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 20px 15px;
  }

  .player-name {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .chart-container {
    height: 250px;
  }

  .level-image-container {
    padding: 6px;
  }
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
