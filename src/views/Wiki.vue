<template>
  <div class="wiki-page">
    <h1 class="page-title">Wiki</h1>
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
      <RangeSystemWiki v-if="activeTab === 'rangsystem'" />
      <SaisonWiki v-if="activeTab === 'saison'" />
      <GarrysModWiki v-if="activeTab === 'garry'" />
      <SupportWiki v-if="activeTab === 'faq'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RangeSystemWiki from '../components/wiki/RangeSystemWiki.vue';
import SaisonWiki from '../components/wiki/SaisonWiki.vue';
import GarrysModWiki from '../components/wiki/GarrysModWiki.vue';
import SupportWiki from '../components/wiki/SupportWiki.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('rangsystem');

const tabs = [
  { id: 'rangsystem', name: 'Rangsystem', icon: ['fas', 'info-circle'] },
  { id: 'saison', name: 'Saison', icon: ['fas', 'book-open'] },
  { id: 'garry', name: 'Garrys Mod', icon: ['fas', 'gavel'] },
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
  padding: 80px 40px 40px;
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
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.tab-button {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent; 
  border-radius: 6px 6px 0 0;
  padding: 0.8rem 1.5rem;
  color: #999;
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
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.tab-button.active {
  color: #f98500;
  border-bottom-color: #f98500;
}

.button-icon {
  font-size: 1.1rem;
}

.tab-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-content h2 {
  color: var(--clr-text-primary);
  margin-bottom: 1rem;
  font-size: 1.8rem;
  border-bottom: 1px solid rgba(249, 133, 0, 0.2);
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
    flex-wrap: wrap; /* Allow tabs to wrap on smaller screens */
    justify-content: flex-start;
    gap: 0.5rem;
  }
  .tab-button {
    flex-grow: 1; /* Allow buttons to take available space */
    justify-content: center;
    min-width: 120px; /* Minimum width for tabs */
  }
  .tab-content {
    padding: 1.5rem;
  }
  .tab-content h2 {
    font-size: 1.5rem;
  }
}
</style>