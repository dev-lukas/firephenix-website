<template>
  <div class="player-header">
    <div class="player-info">
      <h1 class="player-name">{{ name }}</h1>
    </div>
    <div class="player-avatars">
      <div class="player-avatar">
        <base-box elevated>
          <img :src="`/src/assets/images/level/${level}.png`" :alt="name" />
        </base-box>
        <div class="level-badge">
          <span class="level-text">Level {{ level }}</span>
        </div>
      </div>
      <div class="player-rank">
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
  isStaff: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const getRankImage = (division) => {
  const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'phoenix'];
  const index = Math.min(Math.max(0, division - 1), 5); // Ensure index is between 0 and 5
  return `/src/assets/images/ranks/${ranks[index]}.png`;
};

const getRankName = (division) => {
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Phoenix'];
  const index = Math.min(Math.max(0, division - 1), 5); // Ensure index is between 0 and 5
  return ranks[index];
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
