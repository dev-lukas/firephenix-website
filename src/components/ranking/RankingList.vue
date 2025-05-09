// components/RankingList.vue
<template>
  <div class="ranking-container">
    <div class="ranking-controls">
      <BaseButton
        v-for="period in timePeriods"
        :key="period.value"
        :variant="selectedPeriod === period.value ? 'primary' : 'secondary'"
        @click="updatePeriod(period.value)"
      >
        {{ period.label }}
      </BaseButton>
    </div>

    <div class="ranking-list">
      <!-- Podium Section -->
      <div class="podium-section">
        <div class="podium">
          <div
            class="podium-spot second"
            @click="navigateToProfile(topPlayers[1]?.id)"
            v-if="topPlayers[1]"
          >
            <div class="player-avatar">
              <div class="avatar-wrapper">
                <img
                  :src="`src/assets/images/level/${topPlayers[1].level}.png`"
                  alt="Second Place"
                />
                <div class="rank-indicator silver">#2</div>
              </div>
            </div>
            <div class="player-info">
              <span class="player-name">{{ topPlayers[1].name }}</span>
              <span class="player-time">{{
                formatTime(topPlayers[1].minutes)
              }}</span>
            </div>
            <div class="podium-block"></div>
          </div>
          <div
            class="podium-spot first"
            @click="navigateToProfile(topPlayers[0]?.id)"
            v-if="topPlayers[0]"
          >
            <div class="crown">👑</div>
            <div class="player-avatar">
              <div class="avatar-wrapper">
                <img
                  :src="`src/assets/images/level/${topPlayers[0].level}.png`"
                  alt="First Place"
                />
                <div class="rank-indicator gold">#1</div>
              </div>
            </div>
            <div class="player-info">
              <span class="player-name">{{ topPlayers[0].name }}</span>
              <span class="player-time">{{
                formatTime(topPlayers[0].minutes)
              }}</span>
            </div>
            <div class="podium-block"></div>
          </div>
          <div
            class="podium-spot third"
            @click="navigateToProfile(topPlayers[2]?.id)"
            v-if="topPlayers[2]"
          >
            <div class="player-avatar">
              <div class="avatar-wrapper">
                <img
                  :src="`src/assets/images/level/${topPlayers[2].level}.png`"
                  alt="Third Place"
                />
                <div class="rank-indicator bronze">#3</div>
              </div>
            </div>
            <div class="player-info">
              <span class="player-name">{{ topPlayers[2].name }}</span>
              <span class="player-time">{{
                formatTime(topPlayers[2].minutes)
              }}</span>
            </div>
            <div class="podium-block"></div>
          </div>
        </div>
      </div>

      <!-- Rankings Table -->
      <div class="ranking-section">
        <div class="ranking-table">
          <div class="table-header desktop-only">
            <span>Rang</span>
            <span>Level</span>
            <span></span>
            <span>Spieler</span>
            <span>Zeit</span>
          </div>
          <!-- Desktop Table Rows -->
          <div
            class="table-row desktop-only"
            v-for="(player, index) in remainingPlayers"
            :key="player.id"
            @click="navigateToProfile(player.id)"
          >
            <span class="rank">{{ index + 4 }}</span>
            <span class="level">
              <div class="table-avatar">
                <img
                  :src="`src/assets/images/level/${player.level}.png`"
                  :alt="player.name"
                />
              </div>
            </span>
            <span v-if="player.level <= 20">Level {{ player.level }}</span>
            <span v-else>Prestige {{ getRomanTimeString(player.level - 20) }}</span>
            <div class="player-cell">
              <span>{{ player.name }}</span>
            </div>
            <span class="time">{{ formatTime(player.minutes) }}</span>
          </div>
          <!-- Mobile Card Rows -->
          <div
            class="table-row mobile-only"
            v-for="(player, index) in remainingPlayers"
            :key="'m' + player.id"
            @click="navigateToProfile(player.id)"
          >
            <div class="mobile-row-header">
              <div class="table-avatar">
                <img :src="`src/assets/images/level/${player.level}.png`" :alt="player.name" />
              </div>
              <div class="mobile-row-main">
                <span class="player-name">{{ player.name }}</span>
                <span class="player-rank">#{{ index + 4 }}</span>
              </div>
            </div>
            <div class="mobile-row-details">
              <span v-if="player.level <= 20">Level {{ player.level }}</span>
              <span v-else>Prestige {{ getRomanTimeString(player.level - 20) }}</span>
              <span class="time">{{ formatTime(player.minutes) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../base/BaseButton.vue';
import { getRomanTimeString } from '../../services/romanTimeString';

const router = useRouter();
const selectedPeriod = ref('total');
const topPlayers = ref([]);

const timePeriods = [
  { label: 'Aller Zeiten', value: 'total' },
  { label: 'Monatlich', value: 'monthly' },
  { label: 'Wöchentlich', value: 'weekly' },
];

const remainingPlayers = computed(() => {
  return topPlayers.value.slice(3);
});

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} Std ${remainingMinutes} Min`;
};

const navigateToProfile = (id) => {
  router.push(`/ranking/player-${id}`);
};

const updatePeriod = (period) => {
  selectedPeriod.value = period;
};

const fetchRankingData = async (period) => {
  try {
    const response = await fetch(`/api/ranking/top?period=${period}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    topPlayers.value = data;
  } catch (error) {
    console.error('Error fetching ranking data:', error);
    topPlayers.value = [];
  }
};

watch(
  selectedPeriod,
  (newPeriod) => {
    fetchRankingData(newPeriod);
  },
  { immediate: true }
);
</script>

<style scoped>
.ranking-container {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 133, 0, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
}

.ranking-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.podium-section {
  margin-top: 0;
  margin-bottom: 1rem;
  border-radius: 24px;
}

.ranking-list {
  margin-top: 3rem;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  height: 400px;
}

.crown {
  position: absolute;
  top: -40px;
  font-size: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.podium-spot {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  padding: 4px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: 50%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.player-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.rank-indicator {
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.podium-block {
  width: 160px;
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  backdrop-filter: blur(10px);
}

.first .podium-block {
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #ff4500);
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.2);
}

.second .podium-block {
  height: 150px;
  background: linear-gradient(45deg, #ff8c42, #ff6b6b);
  box-shadow: 0 0 25px rgba(255, 140, 66, 0.2);
}

.third .podium-block {
  height: 100px;
  background: linear-gradient(45deg, #ffa07a, #ff8c42);
  box-shadow: 0 0 20px rgba(255, 160, 122, 0.2);
}

/* Update rank indicators to match new color scheme */
.gold {
  background: linear-gradient(45deg, #ff6b6b, #ff4500);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.silver {
  background: linear-gradient(45deg, #ff8c42, #ff6b6b);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
}

.bronze {
  background: linear-gradient(45deg, #ffa07a, #ff8c42);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 160, 122, 0.3);
}

/* Add shine effect to podium blocks */
.podium-block::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Update crown color to match new scheme */
.crown {
  position: absolute;
  top: -40px;
  font-size: 40px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
}

/* Add glow effect to player avatars in top 3 */
.podium-spot .avatar-wrapper {
  position: relative;
  padding: 4px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.first .avatar-wrapper {
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.2);
}

.second .avatar-wrapper {
  box-shadow: 0 0 25px rgba(255, 140, 66, 0.2);
}

.third .avatar-wrapper {
  box-shadow: 0 0 20px rgba(255, 160, 122, 0.2);
}

/* Add hover effect to podium spots */
.podium-spot {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.podium-spot:hover {
  transform: translateY(-10px);
}

.first .player-name {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
}

.second .player-name {
  color: #ff8c42;
  text-shadow: 0 0 10px rgba(255, 140, 66, 0.3);
}

.third .player-name {
  color: #ffa07a;
  text-shadow: 0 0 10px rgba(255, 160, 122, 0.3);
}

.player-info {
  text-align: center;
  margin: 1rem 0;
}

.player-name {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.3rem;
}

.player-time {
  color: #999;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 12px;
  border-radius: 12px;
}

.podium-block {
  width: 160px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: 16px 16px 0 0;
  backdrop-filter: blur(10px);
}

.first .podium-block {
  height: 200px;
}
.second .podium-block {
  height: 150px;
}
.third .podium-block {
  height: 100px;
}

.ranking-section {
  max-width: 1000px;
  margin: 0 auto;
}

.ranking-section h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
}

.ranking-table {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.table-header {
  display: grid;
  grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr;
  padding: 1.2rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  color: #999;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.table-row {
  display: grid;
  grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr;
  padding: 1rem 2rem;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: #fff;
  transition: transform 0.2s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(10px);
}

.table-avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 12px;
}

.table-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rank {
  font-weight: 600;
  color: #999;
}

.time,
.last-online {
  color: #999;
  font-size: 0.9rem;
}

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
  .mobile-row-details .time {
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
    grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr;
    padding: 1.2rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    color: #999;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .table-row.desktop-only {
    display: grid !important;
    grid-template-columns: 0.25fr 0.25fr 0.5fr 1fr 1fr;
    padding: 1rem 2rem;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #fff;
    transition: transform 0.2s ease;
  }
}

@media (max-width: 768px) {
  .ranking-container {
    padding: 1rem;
    margin: 1rem 0;
  }

  .ranking-controls {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .ranking-controls .base-button {
    width: 200px;
  }

  .podium {
    height: auto;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .podium-spot {
    transform: scale(0.8);
    margin: 0 -10px; /* Reduce gaps between podium spots */
  }

  .player-avatar img {
    width: 60px;
    height: 60px;
  }

  .podium-block {
    width: 100px;
  }

  .first .podium-block {
    height: 120px;
  }

  .second .podium-block {
    height: 90px;
  }

  .third .podium-block {
    height: 60px;
  }

  .player-name {
    font-size: 0.9rem;
  }

  .player-time {
    font-size: 0.8rem;
  }

  .crown {
    top: -30px;
    font-size: 30px;
  }

  .rank-indicator {
    padding: 3px 8px;
    font-size: 0.8rem;
  }

  .podium-spot:hover {
    transform: none;
  }

  .table-header,
  .table-row {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
    padding: 1rem;
    font-size: 0.8rem;
  }

  .table-avatar {
    width: 30px;
    height: 30px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>
