<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>Aktivitäts-Heatmap</h3>
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
  heatmapData: {
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

  const timeSlots = ['morning', 'noon', 'evening', 'night'];
  const days = ['0', '1', '2', '3', '4', '5', '6'];
  const dayLabels = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Calculate total minutes across all slots
  let totalMinutes = 0;
  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      totalMinutes += Number(props.heatmapData.data[day]?.[slot]) || 0;
    });
  });

  const data = timeSlots
    .map((slot, i) =>
      days.map((day, j) => {
        const minutes = Number(props.heatmapData.data[day]?.[slot]) || 0;
        return {
          x: j,
          y: i,
          v: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
          minutes: minutes, // Keep original minutes for tooltip
        };
      })
    )
    .flat();

  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          data: data,
          backgroundColor: (context) => {
            const value = context.raw.v;
            const alpha = Math.max(0.1, value / 100); // Now using percentage directly
            return `rgba(249, 133, 0, ${alpha})`;
          },
          pointRadius: 12,
          pointHoverRadius: 14,
          pointStyle: 'rect',
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
          bottom: 20,
          left: 20,
        },
      },
      scales: {
        y: {
          reverse: true,
          offset: false,
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              const labels = {
                0: 'Morgens',
                1: 'Mittags',
                2: 'Abends',
                3: 'Nachts',
              };
              return labels[value];
            },
            color: '#FFFFFF',
            padding: 10,
          },
          grid: {
            display: false,
          },
        },
        x: {
          offset: false,
          beginAtZero: true,
          ticks: {
            callback: (value) => dayLabels[value],
            color: '#FFFFFF',
            padding: 10,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const percentage = Math.round(context.raw.v * 10) / 10;
              return `${percentage}%`;
            },
          },
          backgroundColor: '#1a1a1a',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: 'rgba(249, 133, 0, 0.1)',
          borderWidth: 1,
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
  padding: 1.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
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
  padding: 1rem;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 250px;
  }
}
</style>
