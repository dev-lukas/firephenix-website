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

        <div class="profile-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="{ 'active-tab': activeTab === tab.id }"
          >
            {{ tab.label }}
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

            <PlayerAchievements v-if="userData" :player-id="userData.id"/>
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <p>Lade Daten...</p>
        </div>

        <div class="achievements-container" v-if="activeTab === 'cosmetics'">
          <h2>Test 4</h2>
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

          <div class="settings-section">
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
import { ref, onMounted, computed } from 'vue';
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

const authStore = useAuthStore();
const userData: Ref<UserProfile | null> = ref(null);
const activeTab = ref('stats');
const loading = ref(true);

const tabs = [
  { id: 'stats', label: 'Statistiken' },
  { id: 'cosmetics', label: 'Kosmetik' },
  { id: 'settings', label: 'Einstellungen' },
];

onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    try {
      const response = await fetch('/api/user');
      userData.value = await response.json();

      if (
        userData.value?.discord_id == null &&
        userData.value?.teamspeak_id == null
      ) {
        activeTab.value = 'settings';
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      loading.value = false;
    }
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
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.profile-nav button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--clr-surface-elevated-1);
  color: var(--clr-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-nav button:hover {
  background: var(--clr-primary);
  color: white;
}

.profile-nav button.active-tab {
  background: var(--clr-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(249, 133, 0, 0.3);
}

.stats-container,
.settings-container,
.achievements-container {
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
  border-top: 1px solid var(--clr-border);
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
</style>
