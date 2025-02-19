<template>
  <div class="player-header">
    <div class="player-avatar">
      <base-box elevated>
        <img :src="`/src/assets/images/level/${level}.png`" :alt="name" />
      </base-box>
      <div class="level-badge">
        <span class="level-text">Level {{ level }}</span>
      </div>
    </div>
    <div class="player-info">
      <h1 class="player-name">{{ name }}</h1>
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
  isStaff: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});
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

.player-avatar {
  position: relative;
}

.player-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
}

.level-badge {
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

.level-text {
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

  .player-avatar img {
    width: 100px;
    height: 100px;
  }

  .player-name {
    font-size: 1.5rem;
  }
}
</style>
