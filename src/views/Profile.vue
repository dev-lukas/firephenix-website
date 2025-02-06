<!-- views/Ranking.vue -->
<template>
  <div class="ranking-page">
    <div v-if="!isAuthenticated">
      <Login />
    </div>
    <div v-else>
      <div class="profile-container">
        <h1>Mein Profil</h1>
        <PlatformVerification :user-data="userData" />
        <ChannelCreation :user-data="userData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../services/auth';
import Login from '../components/Login.vue';
import PlatformVerification from '../components/profile/PlatformVerification.vue';
import ChannelCreation from '../components/profile/ChannelCreation.vue';

const authStore = useAuthStore();

const userData = ref(null);

onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    try {
      const response = await fetch('/api/user');
      userData.value = await response.json();
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
});

const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
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
