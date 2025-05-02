<template>
  <div class="skin-unlocker-container">
    <h2>TTT Skins - Season I</h2>
    <div class="skins-grid">
      <div v-for="(skin, index) in skins" :key="index" class="skin-card">
        <div class="skin-image-container">
          <img :src="skin.image" :alt="skin.name" class="skin-image" />
        </div>
        <BaseButton
          variant="primary"
          @click="unlockSkin(index + 1)"
          :disabled="bestDivision < skin.requiredDivision"
        >
          Freischalten
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue';

// Import images using relative paths
import tttSilver from '../../assets/images/games/ttt_reward_silver.png';
import tttGold from '../../assets/images/games/ttt_reward_gold.png';
import tttPlatinum from '../../assets/images/games/ttt_reward_platinum.png';
import tttDiamond from '../../assets/images/games/ttt_reward_diamond.png';
import tttPhoenix from '../../assets/images/games/ttt_reward_phoenix.png';

defineProps({
  bestDivision: {
    type: Number,
    required: true,
  },
});

const skins = [
  { name: 'Silver Skin', image: tttSilver, requiredDivision: 2 },
  { name: 'Gold Skin', image: tttGold, requiredDivision: 3 },
  { name: 'Platinum Skin', image: tttPlatinum, requiredDivision: 4 },
  { name: 'Diamond Skin', image: tttDiamond, requiredDivision: 5 },
  { name: 'Phoenix Skin', image: tttPhoenix, requiredDivision: 6 },
];

const unlockSkin = (skinId: number) => {
  console.log(`Attempting to unlock skin ${skinId}`);
  // Add unlock logic here
};
</script>

<style scoped>
.skin-unlocker-container {
  padding: 2.5rem; 
  background: linear-gradient(145deg, var(--clr-surface-elevated-1), var(--clr-surface-elevated-2)); 
  border: 1px solid var(--clr-border-subtle); 
  border-radius: 12px; 
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); 
}

.skin-unlocker-container h2 {
  color: var(--clr-text-primary);
  font-size: 1.8rem; 
  margin-bottom: 2.5rem; 
  font-weight: 600; 
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem; 
  justify-items: center;
}

.skin-card {
  background: var(--clr-surface);
  border-radius: 10px; 
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem; 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.skin-card:hover {
  transform: translateY(-8px); 
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); 
}

.skin-image-container {
  width: 100%;
  max-width: 125px;
  max-height: 3250px;
  background-color: var(--clr-surface-elevated-2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  overflow: hidden;
  border: 1px solid var(--clr-border-subtle);
}

.skin-image {
  display: block;
  width: 100%; 
  height: 100%;
  object-fit: fill;
}

.skin-card .base-button {
  width: 100%;
  margin-top: auto;
  padding: 0.8rem 1.5rem; 
  font-size: 0.95rem; 
}

.skin-card .base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5; 
  background-color: var(--clr-button-secondary-bg); 
  color: var(--clr-text-disabled);
}
</style>