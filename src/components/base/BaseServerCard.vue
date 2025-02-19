<template>
  <base-box elevated hoverable class="server-card">
    <div class="server-image">
      <div class="image-container">
        <img :src="image" :alt="title" />
      </div>
      <div class="server-status" :class="{ online: isOnline }">
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
    </div>

    <div class="server-content">
      <div class="server-header">
        <h3 class="server-title">{{ title }}</h3>
      </div>

      <div class="server-info">
        <div class="player-count">
          <i class="fas fa-users"></i>
          {{ players }}/{{ maxPlayers }} Spieler
        </div>
        <div class="server-map">
          <i class="fas fa-map"></i>
          {{ map }}
        </div>
      </div>

      <div class="server-description">
        <slot></slot>
      </div>

      <div class="server-actions">
        <base-button
          variant="primary"
          :disabled="!isOnline"
          glow
          @click="$emit('connect')"
        >
          <i class="fas fa-play"></i>
          Verbinden
        </base-button>
      </div>
    </div>
  </base-box>
</template>

<script setup lang="ts">
import BaseBox from './BaseBox.vue';
import BaseButton from './BaseButton.vue';

defineProps<{
  title: string;
  image: string;
  isOnline: boolean;
  players: number;
  maxPlayers: number;
  map: string;
}>();

defineEmits<{
  (e: 'connect'): void;
}>();
</script>

<style scoped>
.server-card {
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.server-image {
  position: relative;
  width: 100%;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  background: var(--clr-surface-elevated-1);
  padding: 2rem;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.server-image img {
  width: auto;
  height: 150px;
  object-fit: contain;
}

.server-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  backdrop-filter: blur(4px);
}

.server-status.online {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.server-content {
  padding: 0 1rem;
}

.server-header {
  margin-bottom: 1rem;
}

.server-title {
  font-size: 1.2rem;
  color: var(--clr-text-primary);
}

.server-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.server-info i {
  margin-right: 0.5rem;
  color: var(--clr-primary);
}

.server-description {
  color: var(--clr-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.server-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
