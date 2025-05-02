<template>
  <div class="ranking-page">
    <div v-if="!isAuthenticated">
      <Login />
    </div>
    <div v-else>
      <div class="profile-container">
        <div class="profile-header">
          <h1>Profil</h1>
        </div>

        <div class="ranking-toggle">
          <button 
            v-for="tab in tabs"
            :key="tab.id"
            @click="navigateToTab(tab.id)"
            :class="{ 'active': activeTab === tab.id }"
            class="toggle-button"
          >
            <font-awesome-icon :icon="tabIcons[tab.id]" class="button-icon" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <div class="stats-container" v-if="activeTab === 'stats' && !loading">
          <div v-if="userData?.level == 0" class="info-message">
            <div class="info-icon">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
            </div>
            <div class="info-content">
              <h4>Account verlinken</h4>
              <p>Du musst mindestens einen Account mit deinem Steam-Konto verlinken um deine
                Statistiken zu sehen. Klicke auf "Einstellungen" um dies zu tun.
              </p>
              <BaseButton @click="activeTab = 'settings'" variant="primary">
                Zu den Einstellungen
              </BaseButton>
            </div>
          </div>
          <div v-else>
            <PlayerHeader
            :name="userData?.name || 'Unbekannt'"
            :level="userData?.level || 0"
            :division="userData?.division || 0"
            :bestDivision="userData?.best_division_achieved || 0"
            />

            <LevelProgress
              :level="userData?.level || 0"
              :division="userData?.division || 0"
              :total-time="userData?.total_time || 0"
              :time-to-next-level="userData?.time_to_next_level || 0"
              :season-time="userData?.season_time || 0"
              :time-to-next-division="userData?.time_to_next_division || 0"
            />

            <PlayerStats
              :total-time="userData?.total_time || 0"
              :monthly-time="userData?.monthly_time || 0"
              :weekly-time="userData?.weekly_time || 0"
              :season-time="userData?.season_time || 0"
              :streak="userData?.login_streaks"	
            />

            <GameComparison :total-time="userData?.total_time || 0" />

            <HeatMapChart
              :heatmap-data="userData?.activity_heatmap || { data: {} }"
            />

            <PlayerAchievements v-if="userData" :player-id="String(userData.id)"/>
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <p>Lade Daten...</p>
        </div>

        <div class="settings-container" v-if="activeTab === 'cosmetics'">
          <ProfileBorderDisplay 
            :bestDivision="userData?.best_division_achieved || 0"
          />
          <SkinUnlocker 
            :bestDivision="userData?.best_division_achieved || 0"
          />
        </div>

        <div class="settings-container" v-if="activeTab === 'settings'">
          <PlatformVerification
            :user-data="userData"
            @verification-success="refreshUserData"
          />
          <MoveShield
            :user-data="userData"
            @reload-data="refreshUserData"
            @channel-created="refreshUserData"
          />
          <ChannelCreation
            :user-data="userData"
            @channel-created="refreshUserData"
          />

          <div class="settings-section logout-section">
            <h3>Abmelden</h3>
            <p>Klicke hier um dich von deinem Account abzumelden.</p>
            <BaseButton
              variant="secondary"
              class="logout-button"
              @click="handleLogout"
            >
              Abmelden
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '../services/auth';
import Login from '../components/profile/Login.vue';
import PlatformVerification from '../components/profile/PlatformVerification.vue';
import ChannelCreation from '../components/profile/ChannelCreation.vue';
import type { UserProfile } from '../types/user';
import BaseButton from '../components/base/BaseButton.vue';
import PlayerHeader from '../components/ranking/PlayerHeader.vue';
import LevelProgress from '../components/ranking/LevelProgress.vue';
import PlayerStats from '../components/ranking/PlayerStats.vue';
import GameComparison from '../components/ranking/GameComparison.vue';
import HeatMapChart from '../components/ranking/HeatMapChart.vue';
import MoveShield from '../components/profile/MoveShield.vue';
import PlayerAchievements from '../components/ranking/PlayerAchievements.vue';
import SkinUnlocker from '../components/profile/SkinUnlocker.vue'; // Import the new component
import ProfileBorderDisplay from '../components/profile/ProfileBorderDisplay.vue'; // Import the border display component

const authStore = useAuthStore();
const userData: Ref<UserProfile | null> = ref(null);
const activeTab = ref('stats');
const loading = ref(true);

const tabs = [
  { id: 'stats', label: 'Statistiken' },
  { id: 'cosmetics', label: 'Kosmetik' },
  { id: 'settings', label: 'Einstellungen' },
];

// Define proper type for tabIcons with index signature
const tabIcons: { [key: string]: [string, string] } = {
  stats: ['fas', 'chart-simple'],
  cosmetics: ['fas', 'palette'],
  settings: ['fas', 'cog'],
};

const validTabs = tabs.map(tab => tab.id);

const navigateToTab = (tab: string) => {
  if (validTabs.includes(tab)) {
    activeTab.value = tab;
    window.location.hash = tab;
  }
};

const handleHashChange = () => {
  const hash = window.location.hash.substring(1); 
  if (validTabs.includes(hash)) {
    activeTab.value = hash;
  }
};

onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    try {
      const response = await fetch('/api/user');
      userData.value = await response.json();

      const initialHash = window.location.hash.substring(1);
      if (validTabs.includes(initialHash)) {
        activeTab.value = initialHash;
      } else if (
        userData.value?.discord_id == null &&
        userData.value?.teamspeak_id == null
      ) {
        activeTab.value = 'settings';
        window.location.hash = 'settings';
      } else {
        window.location.hash = activeTab.value;
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      loading.value = false;
    }
  }
  
  window.addEventListener('hashchange', handleHashChange);
});

watch(activeTab, (newTab) => {
  if (window.location.hash.substring(1) !== newTab) {
    window.location.hash = newTab;
  }
});

const isAuthenticated = computed(() => authStore.isAuthenticated);

const refreshUserData = async () => {
  try {
    const response = await fetch('/api/user');
    userData.value = await response.json();
  } catch (error) {
    console.error('Failed to refresh user data:', error);
  }
};

const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      await authStore.checkAuth();
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>
.profile-nav {
  display: none;
}

.ranking-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.toggle-button {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(249, 133, 0, 0.1);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  color: #999;
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
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  color: #fff;
}

.toggle-button.active {
  background: rgba(249, 133, 0, 0.1);
  border-color: rgba(249, 133, 0, 0.3);
  color: #f98500;
  box-shadow: 0 4px 12px rgba(249, 133, 0, 0.15);
}

.button-icon {
  font-size: 1.1rem;
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

.stats-container,
.achievements-container,
.settings-container {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--clr-surface);
  border-radius: 12px;
  border: 1px solid var(--clr-border);
}

.ranking-page {
  min-height: 100vh;
  background-color: var(--clr-background);
}

.profile-container {
  width: 100%;
  margin: 0 auto;
  background-color: var(--clr-card-background);
}

.profile-container h1 {
  color: var(--clr-text-primary);
  font-size: 3.5rem;
  padding-bottom: 2rem;
  text-align: center;
}

.settings-section {
  padding: 2rem;
  background-color: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.settings-section h3 {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.settings-section p {
  color: var(--clr-text-secondary);
  margin-bottom: 1rem;
  max-width: 400px;
}

.logout-button {
  background-color: var(--clr-error) !important;
  color: white !important;
  width: auto !important;
  min-width: 200px !important;
}

.logout-button:hover {
  background-color: var(--clr-error-hover) !important;
}

.loading-container {
  text-align: center;
  margin-top: 2rem;
  color: var(--clr-text-secondary);
}

.info-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  background: var(--clr-surface-elevated-1);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--clr-border);
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 2.5rem;
  color: var(--clr-primary);
}

.info-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-content h4 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--clr-text-primary);
}

.info-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: var(--clr-text-secondary);
  line-height: 1.5;
}

.logout-section {
  padding: 2rem;
  background-color: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
