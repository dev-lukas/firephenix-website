<template>
  <div class="border-display-container">
    <h2>Profilrahmen</h2>
    <div class="borders-grid">
      <div 
        v-for="(border, index) in borders" 
        :key="border.name"
        :class="['border-item', { 'unlocked': index + 1 === bestDivision, 'locked': index + 1 > bestDivision }]"
        :style="{ '--glow-color': border.color }"
      >
        <img :src="getBorderImage(index + 1)" :alt="`${border.name} Rahmen`" class="border-image" />
        <span class="border-name">{{ border.name }}</span>
        <span v-if="index + 1 === bestDivision" class="current-border-label">Dein momentaner Rahmen</span>
      </div>
    </div>
    <p v-if="bestDivision === 0" class="no-border-message">Du hast noch keinen Rahmen freigeschaltet.</p>
  </div>
</template>

<script setup lang="ts">

defineProps({
  bestDivision: {
    type: Number,
    required: true,
  },
});

const borders = [
  { name: 'Bronze', image: 'bronze', color: 'rgba(138, 73, 3, 0.872)' },
  { name: 'Silber', image: 'silver', color: 'rgba(192, 192, 192, 0.872)' },
  { name: 'Gold', image: 'gold', color: 'rgba(255, 215, 0, 0.872)' },
  { name: 'Platin', image: 'platinum', color: 'rgba(1, 108, 133, 0.872)' }, 
  { name: 'Diamant', image: 'diamond', color: 'rgba(126, 12, 255, 0.872)' }, 
  { name: 'Phönix', image: 'phoenix', color: 'rgba(255, 89, 0, 0.872)' } 
];

const getBorderImage = (division: number) => {
  const border = borders[division - 1];
  if (border) {
    return new URL(`../../assets/images/ranks/${border.image}.png`, import.meta.url).href;
  }
};

</script>

<style scoped>
.border-display-container {
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem; 
  text-align: center;
  z-index: 1;
  position: relative;
}

.border-display-container h3 {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.no-border-message {
  padding-top: 2rem;
  color: var(--clr-text-secondary);
}

.borders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.border-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  border: 2px solid var(--clr-border);
  background-color: var(--clr-surface-variant, var(--clr-surface));
}

.border-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
  margin-bottom: 0.5rem;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.border-name {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
  margin-bottom: 0.25rem;
}

.current-border-label {
  font-size: 0.8rem;
  color: var(--clr-primary);
  font-weight: bold;
}

.border-item.unlocked .border-image {
  filter: grayscale(0%);
  opacity: 1;
  box-shadow: 0 0 15px 5px var(--glow-color);
}

.border-item.unlocked .border-name {
  color: var(--clr-text-primary);
  font-weight: bold;
}


.border-item:not(.unlocked):not(.locked) .border-image {
   filter: grayscale(50%); 
   opacity: 0.8;
}

</style>
