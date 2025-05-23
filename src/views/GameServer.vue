// views/GameServer.vue
<template>
  <div class="game-server-page">
    <h1 class="page-title">Unsere Game Server</h1>

    <!-- Ranking navigation buttons -->
    <div class="gameserver-toggle">
      <button 
        class="toggle-button" 
        :class="{ active: activeTab === 'ttt' }"
        @click="navigateToTab('ttt')"
      >
        <font-awesome-icon :icon="['fas', 'square-poll-vertical']" class="button-icon" />
        <span>TTT</span>
      </button>
    </div>

    <div v-if="activeTab === 'ttt'">
      <TttServerSection />
    </div>
    <div v-else-if="activeTab === 'minecraft'">
      <MinecraftServerSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TttServerSection from '../components/gameserver/TttServerSection.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const validTabs = ['ttt', 'minecraft'];
const activeTab = ref('ttt');

const navigateToTab = (tab: string) => {
  if (validTabs.includes(tab)) {
    activeTab.value = tab;
    window.location.hash = tab;
  }
};
</script>

<style scoped>
.game-server-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 40px 0 0;
  color: var(--clr-text-secondary);
}

.page-title {
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.gameserver-toggle {
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

.new-tag {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #ff4500, #ffa500);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(255, 69, 0, 0.3);
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

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
