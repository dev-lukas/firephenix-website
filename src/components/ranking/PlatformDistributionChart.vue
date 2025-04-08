<template>
  <div class="charts-container">
    <div class="chart-card">
      <h3 class="chart-title">Nutzerverteilung</h3>
      <div class="chart-wrapper">
        <canvas ref="platformChartRef"></canvas>
      </div>
    </div>
    
    <div class="chart-card">
      <h3 class="chart-title">Ränge</h3>
      <div class="chart-wrapper">
        <canvas ref="rankChartRef"></canvas>
      </div>
    </div>
    
    <div class="chart-card">
      <h3 class="chart-title">Divisionen</h3>
      <div class="chart-wrapper">
        <canvas ref="divisionChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const platformChartRef = ref(null);
const rankChartRef = ref(null);
const divisionChartRef = ref(null);

let platformChart = null;
let rankChart = null;
let divisionChart = null;

const fetchDistributionData = async () => {
  try {
    const response = await fetch('/api/ranking/user');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return { 
      total_discord_users: 0, 
      total_teamspeak_users: 0,
      users_per_rank: {},
      users_per_division: {}
    };
  }
};

const createColorPalette = (count) => {
  // Base colors: Discord blue, Orange, and variations
  const colors = [
    '#5865F2', // Discord blue
    'rgba(249, 133, 0, 0.9)', // Orange to match site theme
    'rgba(249, 133, 0, 0.7)',
    'rgba(88, 101, 242, 0.8)',
    'rgba(249, 133, 0, 0.5)',
    'rgba(88, 101, 242, 0.6)',
    '#F98500',
    '#4752C4',
    '#C96A00',
    '#3641A3'
  ];
  
  // If more colors needed, generate them
  while (colors.length < count) {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
  }
  
  return colors.slice(0, count);
};

const getRankColor = (rank) => {
  const rankNum = parseInt(rank);
  
  if (rankNum >= 1 && rankNum <= 5) return '#CD7F32'; // Bronze/Brown
  if (rankNum >= 6 && rankNum <= 10) return '#C0C0C0'; // Silver
  if (rankNum >= 11 && rankNum <= 15) return '#FFD700'; // Gold/Yellow
  if (rankNum >= 16 && rankNum <= 20) return '#9370DB'; // Violet
  if (rankNum >= 21 && rankNum <= 22) return '#4169E1'; // Blue
  if (rankNum >= 23 && rankNum <= 25) return '#FF4500'; // Red
  
  return 'rgba(249, 133, 0, 0.7)'; // Default orange
};

const getDivisionColor = (division) => {
  const divNum = parseInt(division);
  
  switch (divNum) {
    case 1: return '#CD7F32'; // Bronze/Brown
    case 2: return '#C0C0C0'; // Silver
    case 3: return '#FFD700'; // Gold/Yellow
    case 4: return '#E5E4E2'; // Platinum silver
    case 5: return '#9370DB'; // Violet
    case 6: return '#FF4500'; // Red
    default: return 'rgba(249, 133, 0, 0.7)'; // Default orange
  }
};

const createPlatformChart = (data) => {
  const ctx = platformChartRef.value.getContext('2d');
  
  if (platformChart) {
    platformChart.destroy();
  }
  
  platformChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Discord', 'TeamSpeak'],
      datasets: [{
        data: [data.total_discord_users, data.total_teamspeak_users],
        backgroundColor: [
          '#5865F2', // Discord blue
          'rgba(249, 133, 0, 0.9)' // Orange to match site theme
        ],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#999',
            font: { size: 14 },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const createRankChart = (data) => {
  const ranks = data.users_per_rank || {};
  const labels = Object.keys(ranks).sort((a, b) => parseInt(a) - parseInt(b));
  const values = labels.map(rank => ranks[rank]);
  
  const ctx = rankChartRef.value.getContext('2d');
  
  if (rankChart) {
    rankChart.destroy();
  }
  
  rankChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map(rank => getRankColor(rank)),
        borderColor: Array(labels.length).fill('#ffffff'),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#999',
            font: { size: 14 },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `Rang ${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const createDivisionChart = (data) => {
  const divisions = data.users_per_division || {};
  const labels = Object.keys(divisions).sort((a, b) => parseInt(a) - parseInt(b));
  const values = labels.map(division => divisions[division]);
  
  const ctx = divisionChartRef.value.getContext('2d');
  
  if (divisionChart) {
    divisionChart.destroy();
  }
  
  divisionChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map(division => getDivisionColor(division)),
        borderColor: Array(labels.length).fill('#ffffff'),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#999',
            font: { size: 14 },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `Division ${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const createAllCharts = async () => {
  const data = await fetchDistributionData();
  createPlatformChart(data);
  createRankChart(data);
  createDivisionChart(data);
};

onMounted(() => {
  createAllCharts();
});
</script>

<style scoped>
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 15px;
  padding: 2rem;
}

.chart-title {
  text-align: center;
  color: white;
  margin-top: 0;
  margin-bottom: 2rem;
}

.chart-wrapper {
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .chart-card {
    padding: 1rem;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>