<template>
  <div class="ranking-page">
    <div v-if="!isAuthenticated">
      <Login />
    </div>
    <div v-else>
      <div class="profile-container">
        <h1>Mein Profil</h1>

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

        <div class="stats-container" v-if="activeTab === 'stats'">
          <h2>Test 1</h2>
        </div>

        <div class="achievements-container" v-if="activeTab === 'achievements'">
          <h2>Test 2</h2>
        </div>

        <div class="settings-container" v-if="activeTab === 'settings'">
          <PlatformVerification
            :user-data="userData"
            @verification-success="refreshUserData"
          />
          <ChannelCreation
            :user-data="userData"
            @channel-created="refreshUserData"
          />
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

const authStore = useAuthStore();
const userData: Ref<UserProfile | null> = ref(null);
const activeTab = ref('stats');

const tabs = [
  { id: 'stats', label: 'Statistiken' },
  { id: 'achievements', label: 'Errungenschaften' },
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
  padding: 80px 20px 40px;
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
</style>
