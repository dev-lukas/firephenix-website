<!-- views/Ranking.vue -->
<template>
  <div class="ranking-page">
    <h1 class="page-title">Rangliste</h1>
    
    
    <!-- Ranking toggle buttons -->
    <div class="ranking-toggle">
      <button 
        class="toggle-button" 
        :class="{ active: activeRanking === 'server-stats' }"
        @click="navigateToTab('server-stats')"
      >
        <font-awesome-icon :icon="['fas', 'square-poll-vertical']" class="button-icon" />
        <span>Server Statistiken</span>
      </button>

      <button 
        class="toggle-button" 
        :class="{ active: activeRanking === 'all-time' }"
        @click="navigateToTab('all-time')"
      >
        <font-awesome-icon :icon="['fas', 'trophy']" class="button-icon" />
        <span>Gesamtranking</span>
      </button>
      
      <button 
        class="toggle-button" 
        :class="{ active: activeRanking === 'seasonal' }"
        @click="navigateToTab('seasonal')"
      >
        <font-awesome-icon :icon="['fas', 'star']" class="button-icon" />
        <span>Seasonranking</span>
        <span class="new-tag">NEU</span>
      </button>
    </div>
    
    <!-- Components rendered based on active tab -->
    <UserStats v-if="activeRanking === 'server-stats'" />
    <UsageChart v-if="activeRanking === 'server-stats'" />
    <PlatformDistributionChart v-if="activeRanking === 'server-stats'" />
    <RankingList v-if="activeRanking === 'all-time'" />
    <UserTable v-if="activeRanking === 'all-time'" />
    <SeasonCountdown v-if="activeRanking === 'seasonal'" />
    <SeasonalRanking v-if="activeRanking === 'seasonal'" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import RankingList from '../components/ranking/RankingList.vue';
import UserStats from '../components/ranking/UserStats.vue';
import UsageChart from '../components/ranking/UsageChart.vue';
import UserTable from '../components/ranking/UserTable.vue';
import SeasonalRanking from '../components/ranking/SeasonalRanking.vue';
import SeasonCountdown from '../components/ranking/SeasonCountdown.vue';
import PlatformDistributionChart from '../components/ranking/PlatformDistributionChart.vue';

const validTabs = ['server-stats', 'all-time', 'seasonal'];
const activeRanking = ref('server-stats');

const navigateToTab = (tab) => {
  if (validTabs.includes(tab)) {
    activeRanking.value = tab;
    window.location.hash = tab;
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.substring(1); 
  if (validTabs.includes(hash)) {
    activeRanking.value = hash;
  }
};

onMounted(() => {
  const initialHash = window.location.hash.substring(1);
  if (validTabs.includes(initialHash)) {
    activeRanking.value = initialHash;
  } else {
    window.location.hash = activeRanking.value;
  }
  
  window.addEventListener('hashchange', handleHashChange);
});

watch(activeRanking, (newTab) => {
  if (window.location.hash.substring(1) !== newTab) {
    window.location.hash = newTab;
  }
});
</script>

<style scoped>
.page-title {
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.ranking-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 40px 20px 40px;
}

.ranking-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.toggle-button {
  background: var(--clr-surface);
  border: 2px solid var(--clr-border);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  color: var(--clr-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 180px;
  justify-content: center;
}

.toggle-button:hover {
  transform: translateY(-2px);
  background: var(--clr-primary-transparent-strong);
  color: var(--clr-text-primary);
}

.toggle-button.active {
  background: var(--clr-surface);
  border-color: var(--clr-border-strong);
  color: var(--clr-primary);
  box-shadow: 0 4px 12px var(--clr-primary-transparent-strong);
}

.button-icon {
  font-size: 1.1rem;
}

.new-tag {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, var(--clr-red), var(--clr-primary));
  color: var(--clr-white);
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px var(--clr-box-shadow-orange);
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .ranking-toggle {
    flex-direction: column;
    align-items: center;
  }
  
  .toggle-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
