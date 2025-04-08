<template>
  <div class="wiki-page">
    <h1 class="page-title">Wiki</h1>

    <!-- Tab Navigation -->
    <div class="wiki-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <font-awesome-icon :icon="tab.icon" class="button-icon" />
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'general'">
        <h2>Allgemeine Informationen</h2>
        <p>Hier finden Sie allgemeine Informationen...</p>
        <!-- Add more content or components here -->
      </div>
      <div v-if="activeTab === 'guides'">
        <h2>Anleitungen</h2>
        <p>Hier finden Sie Anleitungen und Tutorials...</p>
        <!-- Add more content or components here -->
      </div>
      <div v-if="activeTab === 'rules'">
        <h2>Regeln</h2>
        <p>Hier finden Sie die Serverregeln...</p>
        <!-- Add more content or components here -->
      </div>
      <div v-if="activeTab === 'faq'">
        <h2>FAQ</h2>
        <p>Hier finden Sie häufig gestellte Fragen...</p>
        <!-- Add more content or components here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('general'); // Default active tab

const tabs = [
  { id: 'general', name: 'Allgemein', icon: ['fas', 'info-circle'] },
  { id: 'guides', name: 'Anleitungen', icon: ['fas', 'book-open'] },
  { id: 'rules', name: 'Regeln', icon: ['fas', 'gavel'] },
  { id: 'faq', name: 'FAQ', icon: ['fas', 'question-circle'] },
];
</script>

<style scoped>
.wiki-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 40px 40px; /* Increased horizontal padding */
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
  gap: 0.5rem; /* Reduced gap for tabs */
  margin-bottom: 2.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.tab-button {
  background: transparent; /* Cleaner look for tabs */
  border: none;
  border-bottom: 3px solid transparent; /* Indicator for active tab */
  border-radius: 6px 6px 0 0; /* Slight rounding at the top */
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