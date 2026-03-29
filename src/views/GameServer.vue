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
  background: var(--clr-transparent-light);
  border: 2px solid var(--clr-border);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  color: var(--clr-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 180px;
  justify-content: center;
}

.toggle-button:hover {
  background: var(--clr-transparent-middle);
  transform: translateY(-2px);
  color: var(--clr-text-primary);
}

.toggle-button.active {
  background: var(--clr-primary-transparent);
  border-color: var(--clr-border-strong);
  color: var(--clr-primary);
  box-shadow: 0 4px 12px var(--clr-primary-transparent-strong);
}

.button-icon {
  font-size: 1.1rem;
}

.new-tag {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, var(--clr-red), var(--clr-primary));
  color: var(--clr-white);
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px var(--clr-box-shadow-orange);
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
