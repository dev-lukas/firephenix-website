<template>
  <div class="wiki-page">
    <h1 class="page-title">Wissenswert</h1>
    <div class="wiki-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="navigateToTab(tab.id)"
      >
        <font-awesome-icon :icon="tab.icon" class="button-icon" />
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <div class="tab-content">
      <RulesWiki v-if="activeTab === 'rules'" />
      <RangSystemWiki v-if="activeTab === 'rangsystem'" />
      <SaisonWiki v-if="activeTab === 'saison'" />
      <GarrysModWiki v-if="activeTab === 'garry'" />
      <TeamWiki v-if="activeTab === 'team'" />
      <PatchnotesWiki v-if="activeTab === 'patchnotes'" />
      <SupportWiki v-if="activeTab === 'faq'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RulesWiki from '../components/wiki/RulesWiki.vue';
import RangSystemWiki from '../components/wiki/RangSystemWiki.vue';
import SaisonWiki from '../components/wiki/SeasonWiki.vue';
import GarrysModWiki from '../components/wiki/GarrysModWiki.vue';
import SupportWiki from '../components/wiki/SupportWiki.vue';
import TeamWiki from '../components/wiki/TeamWiki.vue';
import PatchnotesWiki from '../components/wiki/PatchnotesWiki.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('rangsystem');

const tabs = [
  { id: 'rules', name: 'Server Regeln', icon: ['fas', 'fa-gavel'] },
  { id: 'rangsystem', name: 'Rangsystem', icon: ['fas', 'fa-ranking-star'] },
  { id: 'saison', name: 'Season', icon: ['fas', 'fa-chart-simple'] },
  { id: 'garry', name: 'Garrys Mod', icon: ['fas', 'fa-person-rifle'] },
  { id: 'patchnotes', name: 'Patchnotes', icon: ['fas', 'fa-file-alt'] },
  { id: 'team', name: 'Team', icon: ['fas', 'fa-users'] },
  { id: 'faq', name: 'Support & FAQ', icon: ['fas', 'question-circle'] },
];

const navigateToTab = (tabId) => {
  router.push({ path: '/wiki', query: { tab: tabId } });
};

watch(() => route.query.tab, (newTab) => {
  if (newTab && tabs.some(tab => tab.id === newTab)) {
    activeTab.value = newTab;
  }
}, { immediate: true });

onMounted(() => {
  const tabFromUrl = route.query.tab;
  if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
    activeTab.value = tabFromUrl;
  } else {
    navigateToTab(activeTab.value);
  }
});
</script>

<style scoped>
.wiki-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 40px 40px 40px;
  color: var(--clr-text-secondary);
}

.page-title {
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.wiki-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem; 
  margin-bottom: 2.5rem;
  border-bottom: 2px solid var(--clr-border);
  padding-bottom: 1rem;
}

.tab-button {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent; 
  border-radius: 6px 6px 0 0;
  padding: 0.8rem 1.5rem;
  color: var(--clr-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  background: var(--clr-transparent-light);
  color: var(--clr-text-primary);
}

.tab-button.active {
  color: var(--clr-primary);
  border-bottom-color: var(--clr-primary);
}

.button-icon {
  font-size: 1.1rem;
}

.tab-content {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--clr-border);
  z-index: 1;
  position: relative;
}

.tab-content h2 {
  color: var(--clr-text-primary);
  margin-bottom: 1rem;
  font-size: 1.8rem;
  border-bottom: 1px solid var(--clr-primary-transparent);
  padding-bottom: 0.5rem;
}

.tab-content h3 {
  color: var(--clr-text-primary);
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

.tab-content p {
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .wiki-page {
    padding: 80px 20px 40px;
  }
  .wiki-tabs {
    flex-wrap: wrap; 
    justify-content: flex-start;
    gap: 0.5rem;
  }
  .tab-button {
    flex-grow: 1; 
    justify-content: center;
    min-width: 120px; 
  }
  .tab-content {
    padding: 1.5rem;
  }
  .tab-content h2 {
    font-size: 1.5rem;
  }
}
</style>