<template>
  <div class="usage-chart-container">
    <div class="chart-controls">
      <base-button
        v-for="period in periods"
        :key="period.value"
        :variant="selectedPeriod === period.value ? 'primary' : 'secondary'"
        @click="changePeriod(period.value)"
      >
        {{ period.label }}
      </base-button>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import BaseButton from '../base/BaseButton.vue';

const chartRef = ref(null);
let chart = null;

const periods = [
  { label: '24 Stunden', value: 'daily' },
  { label: 'Letzte Woche', value: 'weekly' },
];

const selectedPeriod = ref('daily');

const fetchUsageData = async (period) => {
  try {
    const response = await fetch(`/api/ranking/usage?period=${period}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return { labels: [], data: [] };
  }
};

const createChart = async (period) => {
  const { labels, data } = await fetchUsageData(period);

  const ctx = chartRef.value.getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Nutzer online',
          data: data,
          borderColor: 'rgba(249, 133, 0, 0.9)',
          backgroundColor: 'rgba(249, 133, 0, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(249, 133, 0, 0.9)',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#999',
          },
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#999',
          },
        },
      },
    },
  });
};

const changePeriod = (period) => {
  selectedPeriod.value = period;
};

watch(selectedPeriod, (newPeriod) => {
  createChart(newPeriod);
});

onMounted(() => {
  createChart(selectedPeriod.value);
});
</script>

<style scoped>
.usage-chart-container {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 15px;
  padding: 2rem;
  z-index: 1;
  position: relative;
  margin: 2rem 0;
}

.chart-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart-wrapper {
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .usage-chart-container {
    padding: 1rem;
  }

  .chart-controls {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>
