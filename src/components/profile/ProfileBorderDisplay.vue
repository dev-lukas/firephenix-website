<template>
  <div class="emblem-showcase">
    <h2 class="section-title">
      Rang-Embleme
      <span class="section-subtitle">Dein Fortschritt durch die Ränge</span>
    </h2>

    <div class="progression-track">
      <div class="progression-line">
        <div class="progression-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="emblems-row">
        <div
          v-for="(border, index) in borders"
          :key="border.name"
          class="emblem-card"
          :class="{
            unlocked: index + 1 <= bestDivision,
            current: index + 1 === bestDivision,
            locked: index + 1 > bestDivision
          }"
          :style="{
            '--glow-color': border.color,
            '--delay': (index * 100) + 'ms'
          }"
        >
          <div class="emblem-frame">
            <img :src="getBorderImage(index + 1)" :alt="border.name" class="emblem-img" />
            <div v-if="index + 1 > bestDivision" class="lock-overlay">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </div>
          </div>
          <span class="emblem-name">{{ border.name }}</span>
          <span v-if="index + 1 === bestDivision" class="active-badge">Aktiv</span>
        </div>
      </div>
    </div>

    <p v-if="bestDivision === 0" class="empty-state">
      Spiele auf unseren Servern um deinen ersten Rang zu erreichen.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  bestDivision: {
    type: Number,
    required: true,
  },
});

const borders = [
  { name: 'Bronze', image: 'bronze', color: 'rgba(205, 127, 50, 0.6)' },
  { name: 'Silber', image: 'silver', color: 'rgba(192, 192, 192, 0.5)' },
  { name: 'Gold', image: 'gold', color: 'rgba(255, 215, 0, 0.5)' },
  { name: 'Platin', image: 'platinum', color: 'rgba(180, 210, 220, 0.5)' },
  { name: 'Diamant', image: 'diamond', color: 'rgba(126, 12, 255, 0.5)' },
  { name: 'Phönix', image: 'phoenix', color: 'rgba(255, 69, 0, 0.6)' }
];

const progressPercent = computed(() => {
  if (props.bestDivision <= 0) return 0;
  // Each emblem center is at (index + 0.5) / 6 of the row width
  // bestDivision is 1-indexed, so index = bestDivision - 1
  return ((props.bestDivision - 1 + 0.5) / borders.length) * 100;
});

const getBorderImage = (division: number) => {
  const border = borders[division - 1];
  if (border) {
    return new URL(`../../assets/images/ranks/${border.image}.png`, import.meta.url).href;
  }
};
</script>

<style scoped>
.emblem-showcase {
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.section-subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--clr-text-secondary);
}

.progression-track {
  position: relative;
  padding-top: 1.5rem;
}

.progression-line {
  position: absolute;
  top: calc(1.5rem + 55px);
  left: 0;
  right: 0;
  height: 3px;
  background: var(--clr-surface-3);
  border-radius: 2px;
  z-index: 0;
}

.progression-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--clr-primary), var(--clr-primary-light));
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 8px var(--clr-primary-transparent);
}

.emblems-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.emblem-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  opacity: 0;
  transform: translateY(16px);
  animation: emblem-enter 0.5s var(--transition-smooth) var(--delay) forwards;
}

@keyframes emblem-enter {
  to { opacity: 1; transform: translateY(0); }
}

.emblem-frame {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-surface);
  border: 2px solid var(--clr-surface-3);
  position: relative;
  transition: transform 0.4s var(--transition-bounce),
              box-shadow 0.4s var(--transition-smooth),
              border-color 0.4s ease;
  overflow: hidden;
}

.emblem-img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.35;
  transition: filter 0.5s ease, opacity 0.5s ease, transform 0.4s ease;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  color: var(--clr-text-secondary);
  font-size: 1.2rem;
  opacity: 0.7;
}

.emblem-name {
  font-size: 0.85rem;
  color: var(--clr-text-secondary);
  margin-top: 0.75rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.active-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--clr-background);
  background: var(--clr-primary);
  padding: 0.15rem 0.6rem;
  border-radius: 10px;
  margin-top: 0.4rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Unlocked state */
.emblem-card.unlocked .emblem-img {
  filter: grayscale(0%);
  opacity: 1;
}

.emblem-card.unlocked .emblem-frame {
  border-color: var(--glow-color);
  box-shadow: 0 0 20px -5px var(--glow-color);
}

.emblem-card.unlocked .emblem-name {
  color: var(--clr-text-primary);
}

.emblem-card.unlocked .emblem-frame:hover {
  transform: scale(1.08);
  box-shadow: 0 0 30px -2px var(--glow-color);
}

.emblem-card.unlocked .emblem-frame:hover .emblem-img {
  transform: scale(1.05);
}

/* Current rank — extra prominence */
.emblem-card.current .emblem-frame {
  border-width: 3px;
  box-shadow: 0 0 25px -3px var(--glow-color),
              0 0 60px -10px var(--glow-color);
}

/* Locked hover */
.emblem-card.locked .emblem-frame:hover {
  transform: scale(1.03);
  border-color: var(--clr-surface-4);
}

.empty-state {
  text-align: center;
  color: var(--clr-text-secondary);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .emblems-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .emblem-card {
    flex: 0 0 30%;
    min-width: 100px;
  }

  .emblem-frame {
    width: 90px;
    height: 90px;
  }

  .progression-line {
    display: none;
  }
}

@media (max-width: 480px) {
  .emblem-card {
    flex: 0 0 45%;
  }

  .emblem-frame {
    width: 80px;
    height: 80px;
  }
}
</style>
