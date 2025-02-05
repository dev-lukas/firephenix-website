<!-- views/Ranking.vue -->
<template>
  <div class="ranking-page">
    <div v-if="!isAuthenticated">
      <Login />
    </div>
    <div v-else>
      <PlatformVerification />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../services/auth';
import Login from '../components/Login.vue';
import PlatformVerification from '../components/profile/PlatformVerification.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});

const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
.ranking-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 20px 40px;
}
</style>
