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
        <span>Lade Saisonranking...</span>
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
                :src="`src/assets/images/ranks/${getDivisionIconName(player.division)}`" 
                class="division-icon" 
                :title="getDivisionName(player.division)"
              />
              <img :src="`src/assets/images/level/${player.level}.png`" class="level-icon" />
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
  return divisionColors[division]?.icon || 'bronze.png';
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
      
      // Update hasMore flag based on whether we've loaded all items
      hasMore.value = players.value.length < totalItems.value;
      
      loading.value = false;
    }, 600);
    
  } catch (err) {
    error.value = 'Fehler beim Laden der Saisondaten';
    console.error('Error fetching seasonal data:', err);
    loading.value = false;
  }
};

const handleScroll = () => {
  if (!rankingContainer.value || loading.value || !hasMore.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = rankingContainer.value;
  
  // Load more when user scrolls to 80% of the container
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
  // Use debounce for search
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
  loadingTimeout.value = setTimeout(() => {
    resetAndFetch();
  }, 400);
};

// Watch for search query changes
watch(searchQuery, () => {
  resetAndSearch();
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.seasonal-ranking-container {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  color: #999;
  margin-right: 0.8rem;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.ranking-content {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(249, 133, 0, 0.5) rgba(255, 255, 255, 0.05);
}

.ranking-content::-webkit-scrollbar {
  width: 8px;
}

.ranking-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.ranking-content::-webkit-scrollbar-thumb {
  background: rgba(249, 133, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.05);
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
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.player-card:hover::before {
  transform: scaleY(1);
}

/* Division styles */
.player-card.division-1::before { background: linear-gradient(to bottom, #cd7f32, #a36829); }
.player-card.division-2::before { background: linear-gradient(to bottom, #c0c0c0, #a2a2a2); }
.player-card.division-3::before { background: linear-gradient(to bottom, #ffd700, #ccac00); }
.player-card.division-4::before { background: linear-gradient(to bottom, #e5e4e2, #b3b3b3); }
.player-card.division-5::before { background: linear-gradient(to bottom, #b9f2ff, #76d7eb); }
.player-card.division-6::before { 
  background: linear-gradient(to bottom, #ff4500, #cc3700);
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.rank-top {
  background: linear-gradient(135deg, #ff4500, #ffa500);
  color: white;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.5);
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
  color: #fff;
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
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

/* Apply special effects to highest division icons */
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

/* Remove the division badge styling as we're replacing it with an icon */
.division-badge {
  display: none;
}

.player-details {
  flex-grow: 1;
}

.player-name {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: white;
}

.player-stats {
  display: flex;
  gap: 1.5rem;
  color: #999;
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
  background: rgba(249, 133, 0, 0.1);
  color: #f98500;
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
  background: rgba(249, 133, 0, 0.2);
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
  color: #999;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(249, 133, 0, 0.1);
  border-radius: 50%;
  border-top-color: rgba(249, 133, 0, 0.9);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2rem;
  color: #cc0033;
  margin-bottom: 1rem;
}

.error-title {
  color: #fff;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.error-message {
  color: #999;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: rgba(249, 133, 0, 0.1);
  border: 1px solid rgba(249, 133, 0, 0.2);
  color: #f98500;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(249, 133, 0, 0.2);
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
