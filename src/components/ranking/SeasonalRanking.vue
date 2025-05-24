<template>
  <div class="seasonal-ranking-container">
    <div class="search-section">
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Spieler suchen..."
          class="search-input"
          @input="resetAndSearch"
        />
      </div>
    </div>

    <div class="ranking-content" ref="rankingContainer" @scroll="handleScroll">
      <div v-if="loading && !hasMore" class="initial-loading">
        <div class="loader"></div>
        <span>Lade Seasonranking...</span>
      </div>

      <div v-else-if="error && players.length === 0" class="ranking-error">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="error-icon" />
        <h3 class="error-title">Fehler beim Laden der Daten</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="resetAndFetch" class="retry-button">
          <font-awesome-icon :icon="['fas', 'sync']" class="retry-icon" />
          Erneut versuchen
        </button>
      </div>

      <div v-else-if="players.length === 0 && !loading" class="no-results">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <span class="no-results-text">Keine passenden Spieler gefunden</span>
      </div>

      <div v-else class="player-list">
        <div 
          v-for="player in players" 
          :key="player.id" 
          class="player-card"
          :class="`division-${player.division}`"
          @click="navigateToProfile(player.id)"
        >
          <div class="rank-indicator" :class="`rank-${getRankClass(player.rank)}`">
            <span class="rank-number">{{ player.rank }}</span>
          </div>
          
          <div class="player-info">
            <div class="player-avatar">
              <img 
                :src="getDivisionImg(player.division)" 
                class="division-icon" 
                :title="getDivisionName(player.division)"
              />
            </div>
            
            <div class="player-details">
              <h3 class="player-name">{{ player.name }}</h3>
              <div class="player-stats">
                <span class="stat">
                  <font-awesome-icon :icon="['fas', 'clock']" />
                  {{ formatTime(player.minutes) }}
                </span>
                <span class="stat">
                  <font-awesome-icon :icon="['fas', 'calendar']" />
                  {{ player.last_online }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="player-actions">
            <button class="view-profile">
              <font-awesome-icon :icon="['fas', 'user']" />
              Profil
            </button>
          </div>
        </div>
        
        <div v-if="loading && hasMore" class="loading-more">
          <div class="loader"></div>
          <span>Lade weitere Spieler...</span>
        </div>
        
        <div v-if="!hasMore && players.length > 0 && !loading" class="end-of-list">
          <span>Ende der Rangliste erreicht</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentPage = ref(1);
const itemsPerPage = ref(20);
const players = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const error = ref(null);
const hasMore = ref(true);
const totalItems = ref(0);
const rankingContainer = ref(null);
const loadingTimeout = ref(null);
const divisionColors = {
  1: { name: 'Bronze', color: '#cd7f32', icon: 'bronze.png' },
  2: { name: 'Silber', color: '#c0c0c0', icon: 'silver.png' },
  3: { name: 'Gold', color: '#ffd700', icon: 'gold.png' },
  4: { name: 'Platinum', color: '#e5e4e2', icon: 'platinum.png' },
  5: { name: 'Diamant', color: '#b9f2ff', icon: 'diamond.png' },
  6: { name: 'Phönix', color: '#ff4500', icon: 'phoenix.png' }
};

const navigateToProfile = (id) => {
  router.push(`/ranking/player-${id}`);
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} Std ${remainingMinutes} Min`;
};

const getDivisionName = (division) => {
  return divisionColors[division]?.name || 'Unbekannt';
};

const getDivisionIconName = (division) => {
  return divisionColors[division]?.icon || 'bronze';
};

const getDivisionImg = (division) => {
  return new URL(`../../assets/images/ranks/${divisionColors[division]?.icon || 'bronze.png'}`, import.meta.url).href;
};

const getRankClass = (rank) => {
  if (rank <= 3) return 'top';
  if (rank <= 10) return 'high';
  if (rank <= 50) return 'medium';
  return 'normal';
};

const fetchData = async (page = 1, append = false) => {
  if (loading.value) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    // Add artificial delay for smoother loading animation
    if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
    loadingTimeout.value = setTimeout(async () => {
      const response = await fetch(
        `/api/ranking/season?page=${page}&limit=${itemsPerPage.value}&search=${searchQuery.value}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch seasonal data');
      
      const data = await response.json();
      
      if (append) {
        players.value = [...players.value, ...data.players];
      } else {
        players.value = data.players;
      }
      
      totalItems.value = data.total;
      
      hasMore.value = players.value.length < totalItems.value;
      
      loading.value = false;
    }, 600);
    
  } catch (err) {
    error.value = 'Fehler beim Laden der Seasondaten';
    console.error('Error fetching seasonal data:', err);
    loading.value = false;
  }
};

const handleScroll = () => {
  if (!rankingContainer.value || loading.value || !hasMore.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = rankingContainer.value;
  
  if (scrollTop + clientHeight >= scrollHeight * 0.8) {
    currentPage.value++;
    fetchData(currentPage.value, true);
  }
};

const resetAndFetch = () => {
  currentPage.value = 1;
  hasMore.value = true;
  fetchData(1, false);
};

const resetAndSearch = () => {
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
  loadingTimeout.value = setTimeout(() => {
    resetAndFetch();
  }, 400);
};

watch(searchQuery, () => {
  resetAndSearch();
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.seasonal-ranking-container {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  height: 80vh;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  color: var(--clr-text-secondary);
  margin-right: 0.8rem;
}

.search-input {
  background: transparent;
  border: none;
  color: var(--clr-text-primary);
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.ranking-content {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--clr-border-strong) var(--clr-transparent);
}

.ranking-content::-webkit-scrollbar {
  width: 8px;
}

.ranking-content::-webkit-scrollbar-track {
  background: var(--clr-transparent-light);
  border-radius: 4px;
}

.ranking-content::-webkit-scrollbar-thumb {
  background: var(--clr-primary-transparent-strong);
  border-radius: 4px;
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-card {
  display: flex;
  align-items: center;
  background: var(--clr-surface-2);
  border-radius: 12px;
  padding: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.player-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 4px 0 0 4px;
  transform: scaleY(0.6);
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.player-card:hover {
  background: var(--clr-surface-3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px var(--clr-box-shadow);
}

.player-card:hover::before {
  transform: scaleY(1);
}

.player-card.division-1::before { background: linear-gradient(to bottom, #cd7f32, #a36829); }
.player-card.division-2::before { background: linear-gradient(to bottom, #c0c0c0, #a2a2a2); }
.player-card.division-3::before { background: linear-gradient(to bottom, #ffd700, #ccac00); }
.player-card.division-4::before { background: linear-gradient(to bottom, #e5e4e2, #b3b3b3); }
.player-card.division-5::before { background: linear-gradient(to bottom, #b9f2ff, #76d7eb); }
.player-card.division-6::before { 
  background: linear-gradient(to bottom, #ff4500, #cc3700);
  box-shadow: 0 0 10px var(--clr-box-shadow-orange);
}

.division-6 {
  animation: glow 2s infinite alternate;
}

.rank-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1.5rem;
  font-weight: bold;
  background: var(--clr-transparent);
  transition: all 0.3s ease;
}

.rank-top {
  background: linear-gradient(135deg, #ff4500, #ffa500);
  color: var(--clr-text-primary);
  box-shadow: 0 0 10px var(--clr-box-shadow-orange);
  transform: scale(1.2);
}

.rank-high {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #333;
}

.rank-medium {
  background: linear-gradient(135deg, #c0c0c0, #a2a2a2);
  color: #333;
}

.rank-normal {
  background: rgba(255, 255, 255, 0.1);
  color: var(--clr-text-primary);
}

.player-info {
  display: flex;
  flex-grow: 1;
  align-items: center;
}

.player-avatar {
  position: relative;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.level-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
}

.division-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px var(--clr-box-shadow));
  transition: transform 0.3s ease;
}

.division-6 .division-icon {
  animation: pulse 1.5s infinite alternate;
  filter: drop-shadow(0 0 5px rgba(255, 69, 0, 0.5));
}

.division-5 .division-icon {
  filter: drop-shadow(0 0 3px rgba(185, 242, 255, 0.7));
}

.player-card:hover .division-icon {
  transform: scale(1.15);
}

.division-badge {
  display: none;
}

.player-details {
  flex-grow: 1;
}

.player-name {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: var(--clr-text-primary);
}

.player-stats {
  display: flex;
  gap: 1.5rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.player-actions {
  margin-left: auto;
}

.view-profile {
  background: var(--clr-surface-3);
  color: var(--clr-text-primary);
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-profile:hover {
  background: var(--clr-primary-transparent);
}

.initial-loading,
.loading-more,
.ranking-error,
.no-results,
.end-of-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--clr-text-secondary);
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--clr-border);
  border-radius: 50%;
  border-top-color: var(--clr-primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2rem;
  color: var(--clr-error);
  margin-bottom: 1rem;
}

.error-title {
  color: var(--clr-text-primary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.error-message {
  color: var(--clr-text-secondary);
  margin-bottom: 1.5rem;
}

.retry-button {
  background: var(--clr-primary-transparen);
  border: 1px solid var(--clr-border-strong);
  color: var(--clr-primary);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--clr-primary-transparent-strong);
}

.end-of-list {
  padding: 2rem;
  opacity: 0.6;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(255, 69, 0, 0.5); }
  to { box-shadow: 0 0 15px rgba(255, 69, 0, 0.8); }
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .seasonal-ranking-container {
    padding: 1rem;
  }
  
  .player-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .rank-indicator {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .player-info {
    width: 100%;
  }
  
  .player-actions {
    width: 100%;
    margin-left: 0;
  }
  
  .view-profile {
    width: 100%;
    justify-content: center;
  }
}
</style>
