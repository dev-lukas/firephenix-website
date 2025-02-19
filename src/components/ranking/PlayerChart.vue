<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>Vergleich mit anderen Spielern</h3>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  playerData: {
    type: Object,
    required: true,
  },
});

const chartRef = ref(null);
let chart = null;

const createChart = () => {
  if (!chartRef.value) return;
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Deine Zeit', 'Beste Zeit', 'Durchschnitt'],
      datasets: [
        {
          data: [
            props.playerData.total_time,
            props.playerData.best_player_time,
            props.playerData.mean_total_time,
          ],
          backgroundColor: [
            'rgba(249, 133, 0, 0.9)', // Your time
            'rgb(255, 170, 75)', // Best time
            'rgba(255, 255, 255, 0.1)', // Average
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 0,
          left: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
          position: 'top',
          align: 'start',
          labels: {
            color: '#FFFFFF',
            usePointStyle: true,
            pointStyle: 'rect',
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: 'rgba(249, 133, 0, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const hours = Math.floor(context.raw / 60);
              const minutes = context.raw % 60;
              return `${hours} Std ${minutes} Min`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(249, 133, 0, 0.1)',
          },
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#FFFFFF',
            padding: 10,
          },
        },
      },
    },
  });
};

onMounted(() => {
  createChart();
});
</script>

<style scoped>
.chart-container {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  width: 100%;
  position: relative;
  background: transparent;
  padding-bottom: 1.5rem;
}

canvas {
  background: transparent;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 200px;
  }

  :deep(.chartjs-size-monitor) {
    font-size: 12px;
  }
}
</style>
