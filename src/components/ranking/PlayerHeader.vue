<template>
  <div class="player-header">
    <div class="player-info">
      <h1 class="player-name">{{ name }}</h1>
    </div>
    <div class="player-avatars">
      <div class="player-avatar" :class="getRankGlowClass(bestDivision)">
        <base-box elevated>
          <img :src="`/src/assets/images/level/${level}.png`" :alt="name" />
        </base-box>
        <div class="level-badge">
          <span v-if="level <= 20" class="level-text">Level {{ level }}</span>
          <span v-if="level > 20" class="level-text">Prestige {{ level - 20 }}</span>
        </div>
      </div>
      <div class="player-rank" :class="getRankGlowClass(bestDivision)">
        <base-box elevated>
          <img :src="getRankImage(division)" :alt="`Division ${division}`" />
        </base-box>
        <div class="rank-badge">
          <span class="rank-text">{{ getRankName(division) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseBox from '../base/BaseBox.vue';

defineProps({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  division: {
    type: Number,
    required: true,
  },
  bestDivision: {
    type: Number,
    required: true,
  },
});

const getRankImage = (division) => {
  const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'phoenix'];
  const index = Math.min(Math.max(0, division - 1), 5);
  return `/src/assets/images/ranks/${ranks[index]}.png`;
};

const getRankName = (division) => {
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Phoenix'];
  const index = Math.min(Math.max(0, division - 1), 5);
  return ranks[index];
};

const getRankGlowClass = (division) => {
  if (division <= 0) return '';
  return `rank-glow division-${division}`;
};
</script>

<style scoped>
.player-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.player-avatars {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.rank-glow {
  position: relative;
  border-radius: 20px;
  transition: box-shadow 0.3s ease;
}


.division-1 {
  box-shadow: 0 0 20px rgba(138, 73, 3, 0.872);
}

.division-2 {
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.872); 
}

.division-3 {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.872); 
}

.division-4 {
  box-shadow: 0 0 20px rgba(185, 242, 255, 0.872);
}

.division-5 {
  box-shadow: 0 0 20px rgba(1, 108, 133, 0.872);
}

.division-6 {
  box-shadow: 0 0 20px rgba(255, 89, 0, 0.872);
}

.player-avatar, .player-rank {
  position: relative;
}

.player-avatar img, .player-rank img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
}

.level-badge, .rank-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--clr-primary);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  text-align: center;
  min-width: 100px;
}

.level-text, .rank-text {
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
  text-align: center;
}

.player-info {
  text-align: center;
}

.player-name {
  font-size: 2rem;
  font-weight: 600;
  color: var(--clr-text-primary);
  margin: 0;
}

@media (max-width: 768px) {
  .player-header {
    padding: 1.5rem;
    gap: 1rem;
  }

  .player-avatars {
    flex-direction: column;
    gap: 1.5rem;
  }

  .player-avatar img, .player-rank img {
    width: 100px;
    height: 100px;
  }

  .player-name {
    font-size: 1.5rem;
  }
}
</style>
