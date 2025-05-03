<!-- components/UserTable.vue -->
<template>
  <div class="data-table-container">
    <div class="table-header-section">
      <div class="entries-selector">
        <span>Zeige</span>
        <select v-model="itemsPerPage" class="page-size-select">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span>Einträge</span>
      </div>

      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Suche Spieler..."
          class="search-input"
        />
      </div>
    </div>

    <div class="ranking-table">
      <div class="table-header desktop-only">
        <span>Rang</span>
        <span>Level</span>
        <span></span>
        <span>Spieler</span>
        <span>Zeit</span>
        <span>Zuletzt Online</span>
      </div>

      <div class="table-content">
        <div v-if="loading" class="table-loading-overlay">
          <div class="loader"></div>
          <span>Lade Spieler...</span>
        </div>

        <template v-else-if="error">
          <div class="table-error">
            <font-awesome-icon
              :icon="['fas', 'exclamation-circle']"
              class="error-icon"
            />
            <h3 class="error-title">Fehler beim Laden der Spielerdaten</h3>
            <p class="error-message">{{ error }}</p>
            <button @click="fetchData" class="retry-button">
              <font-awesome-icon :icon="['fas', 'sync']" class="retry-icon" />
              Erneut versuchen
            </button>
          </div>
        </template>

        <template v-else>
          <div class="table-body">
            <div v-if="players.length > 0" class="table-content">
              <!-- Desktop Table Rows -->
              <div
                v-for="player in players"
                :key="player.rank"
                class="table-row desktop-only"
                @click="navigateToProfile(player.id)"
              >
                <span class="rank">{{ player.rank }}</span>
                <span class="level">
                  <div class="table-avatar">
                    <img :src="`src/assets/images/level/${player.level}.png`" />
                  </div>
                </span>
                <span v-if="player.level <= 20">Level {{ player.level }}</span>
                <span v-else>Prestige {{ getRomanTimeString(player.level - 20) }}</span>
                <div class="player-cell">
                  <span>{{ player.name }}</span>
                </div>
                <span class="time">{{ formatTime(player.minutes) }}</span>
                <span class="last-online">{{ player.last_online }}</span>
              </div>
              <!-- Mobile Card Rows -->
              <div
                v-for="player in players"
                :key="'m' + player.rank"
                class="table-row mobile-only"
                @click="navigateToProfile(player.id)"
              >
                <div class="mobile-row-header">
                  <div class="table-avatar">
                    <img :src="`src/assets/images/level/${player.level}.png`" />
                  </div>
                  <div class="mobile-row-main">
                    <span class="player-name">{{ player.name }}</span>
                    <span class="player-rank">#{{ player.rank }}</span>
                  </div>
                </div>
                <div class="mobile-row-details">
                  <span v-if="player.level <= 20">Level {{ player.level }}</span>
                  <span v-else>Prestige {{ getRomanTimeString(player.level - 20) }}</span>
                  <span class="time">{{ formatTime(player.minutes) }}</span>
                  <span class="last-online">{{ player.last_online }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-results">
              <font-awesome-icon
                :icon="['fas', 'search']"
                class="search-icon"
              />
              <span class="no-results-text"
                >Keine passenden Spieler gefunden</span
              >
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="table-footer">
      <div class="showing-entries">
        Zeige {{ startEntry }} bis {{ endEntry }} von {{ totalItems }} Einträgen
      </div>

      <div class="pagination">
        <button
          class="page-button"
          :disabled="currentPage === 1 || !players.length"
          @click="currentPage = 1"
        >
          Erste Seite
        </button>
        <button
          class="page-button"
          :disabled="currentPage === 1 || !players.length"
          @click="currentPage--"
        >
          Zuletzt
        </button>

        <div class="page-select-container">
          <select
            v-model="currentPage"
            class="page-select"
            :disabled="!players.length"
          >
            <option v-for="page in totalPages" :key="page" :value="page">
              {{ page }}
            </option>
          </select>
          <span class="page-select-text">von {{ totalPages }}</span>
        </div>

        <button
          class="page-button"
          :disabled="currentPage === totalPages || !players.length"
          @click="currentPage++"
        >
          Nächste
        </button>
        <button
          class="page-button"
          :disabled="currentPage === totalPages || !players.length"
          @click="currentPage = totalPages"
        >
          Letzte Seite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getRomanTimeString } from '../../services/romanTimeString';

const router = useRouter();
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);
const players = ref([]);

const navigateToProfile = (id) => {
  router.push(`/ranking/player-${id}`);
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} Std ${remainingMinutes} Min`;
};

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(
      `/api/ranking?page=${currentPage.value}&limit=${itemsPerPage.value}&search=${searchQuery.value}`
    );
    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    players.value = data.players;
    totalItems.value = data.total;
    totalPages.value = data.pages;
  } catch (err) {
    error.value = 'Fehler beim Laden der Spielerdaten';
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

const startEntry = computed(() =>
  totalItems.value
    ? (currentPage.value - 1) * Number(itemsPerPage.value) + 1
    : 0
);
const endEntry = computed(() =>
  Math.min(currentPage.value * Number(itemsPerPage.value), totalItems.value)
);

watch([currentPage, itemsPerPage, searchQuery], () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>

<style>
select {
  color-scheme: dark;
  background-color: #1a1a1a;
  color: white;
}

select option {
  background-color: #1a1a1a;
  color: white;
}
</style>

<style scoped>
.data-table-container {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
}

.table-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.entries-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
}

.page-select,
.page-size-select,
.search-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: white;
}

.search-input {
  width: 250px;
}

.ranking-table {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.table-header {
  display: grid;
  grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr 1fr;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.table-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table-row {
  display: grid;
  grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr 1fr;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: white;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.player-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-content {
  position: relative;
  min-height: 200px;
}

.table-loading-overlay {
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #999;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(4px);
  padding: 2rem;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(249, 133, 0, 0.1);
  border-radius: 50%;
  border-top-color: rgba(249, 133, 0, 0.9);
  animation: spin 1s linear infinite;
}

.table-error {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
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

.retry-icon {
  font-size: 0.9rem;
}

.no-results {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}

.search-icon {
  font-size: 2rem;
  color: #666;
}

.no-results-text {
  color: #999;
  font-size: 1.1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 0 1rem;
  color: #999;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-button {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 133, 0, 0.1);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-button:hover:not(:disabled) {
  background: rgba(249, 133, 0, 0.1);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-body {
  min-height: 200px;
}

/* Responsive table improvements */
.desktop-only {
  display: block;
}
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: block !important;
  }
  .table-header {
    display: none !important;
  }
  .table-row.desktop-only {
    display: none !important;
  }
  .table-row.mobile-only {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    margin-bottom: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    border: 1px solid rgba(249, 133, 0, 0.08);
    transition: background 0.2s;
  }
  .table-row.mobile-only:hover {
    background: rgba(249, 133, 0, 0.05);
  }
  .mobile-row-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .mobile-row-main {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .player-name {
    font-weight: 600;
    color: #fff;
    font-size: 1.1rem;
  }
  .player-rank {
    color: #f98500;
    font-size: 0.95rem;
  }
  .mobile-row-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem 1.5rem;
    color: #ccc;
    font-size: 0.98rem;
    margin-top: 0.5rem;
  }
  .mobile-row-details .time,
  .mobile-row-details .last-online {
    color: #999;
    font-size: 0.95rem;
  }
}

@media (min-width: 769px) {
  .desktop-only {
    display: block !important;
  }
  .mobile-only {
    display: none !important;
  }
  .table-header {
    display: grid !important;
    grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr 1fr;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    color: #999;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .table-row.desktop-only {
    display: grid !important;
    grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr 1fr;
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: white;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;
  }
}

@media (max-width: 768px) {
  .data-table-container {
    padding: 1rem;
  }

  .table-header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .search-input {
    width: 100%;
  }

  .table-header,
  .table-row {
    padding: 1rem;
    font-size: 0.9rem;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
  }

  .table-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
