<template>
  <div class="skin-unlocker-container">
    <h2>TTT Skins</h2>
    <div class="skins-grid">
      <div v-for="n in 5" :key="n" class="skin-card">
        <div class="skin-image-placeholder">
          <!-- Placeholder for skin image -->
          <font-awesome-icon :icon="['fas', 'image']" class="placeholder-icon" />
        </div>
        <BaseButton variant="primary" @click="unlockSkin(n)">
          Freischalten
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue';

const unlockSkin = (skinId: number) => {
  console.log(`Attempting to unlock skin ${skinId}`);
  // Add unlock logic here
};
</script>

<style scoped>
.skin-unlocker-container {
  padding: 2rem;
  background-color: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  text-align: center;
}

.skin-unlocker-container h2 {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.skin-card {
  background: var(--clr-surface);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.skin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.skin-image-placeholder {
  width: 150px;
  height: 150px;
  background-color: var(--clr-surface-elevated-2);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.placeholder-icon {
  font-size: 3rem;
  color: var(--clr-text-secondary);
}

.skin-card .base-button {
  width: 100%;
}
</style>