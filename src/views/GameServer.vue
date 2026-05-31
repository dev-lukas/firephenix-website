// views/GameServer.vue
<template>
  <div class="game-server-page">
    <h1 class="page-title">Games</h1>

    <div class="gameserver-toggle">
      <button 
        class="toggle-button" 
        :class="{ active: activeTab === 'ttt' }"
        @click="navigateToTab('ttt')"
      >
        <font-awesome-icon :icon="['fas', 'server']" class="button-icon" />
        <span>TTT Server</span>
      </button>
      <button
        class="toggle-button"
        :class="{ active: activeTab === 'groups' }"
        @click="navigateToTab('groups')"
      >
        <font-awesome-icon :icon="['fas', 'users']" class="button-icon" />
        <span>Community</span>
      </button>
    </div>

    <div v-if="activeTab === 'ttt'">
      <TttServerSection />
    </div>
    <div v-else-if="activeTab === 'groups'">
      <CommunityGroupsSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import TttServerSection from '../components/gameserver/TttServerSection.vue';
import CommunityGroupsSection from '../components/gameserver/CommunityGroupsSection.vue';

const validTabs = ['ttt', 'groups'] as const;
type GameServerTab = typeof validTabs[number];

const activeTab = ref<GameServerTab>('ttt');

const getHashTab = (): GameServerTab => {
  const hash = window.location.hash.replace('#', '');
  return validTabs.includes(hash as GameServerTab) ? hash as GameServerTab : 'ttt';
};

const navigateToTab = (tab: GameServerTab) => {
  if (validTabs.includes(tab)) {
    activeTab.value = tab;
    window.location.hash = tab;
  }
};

const syncTabFromHash = () => {
  activeTab.value = getHashTab();
};

onMounted(() => {
  syncTabFromHash();
  window.addEventListener('hashchange', syncTabFromHash);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', syncTabFromHash);
});
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
  border-radius: 8px;
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

@media (max-width: 768px) {
  .game-server-page {
    padding-top: 56px;
  }

  .page-title {
    font-size: 2rem;
  }

  .gameserver-toggle {
    flex-direction: column;
    align-items: center;
  }

  .toggle-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
