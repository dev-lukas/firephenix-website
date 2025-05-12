<template>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseServerCard from '../base/BaseServerCard.vue';

const images = [
  '/src/assets/images/games/phoenix-minecraft.png',
  '/src/assets/images/games/banner.png',
];

const currentImage = ref(0);
let carouselInterval: number;

const setImage = (index: number) => {
  currentImage.value = index;
};

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.length;
};

const servers = ref([
  {
    id: 'mc1',
    name: 'Minecraft Server',
    image: '/src/assets/images/games/phoenix-minecraft.png',
    description:
      'Unser Minecraft Server bietet ein einzigartiges Survival-Erlebnis mit Community-Events, Custom Features und einer freundlichen Spielerbasis! Jetzt beitreten und gemeinsam bauen!',
    online: false,
    currentPlayers: 0,
    maxPlayers: 0,
    currentMap: 'Lade...',
    connectUrl: 'minecraft://gaming.firephenix.de',
    isLoading: true,
  },
]);

const connectToServer = (url: string) => {
  window.location.href = url;
};

const fetchServerInfo = async () => {
  try {
    const response = await fetch('/api/server/minecraft?address=gaming.firephenix.de');
    const data = await response.json();
    
    servers.value = servers.value.map(server => {
      if (server.id === 'mc1') {
        return {
          ...server,
          online: data.online,
          currentPlayers: data.players,
          maxPlayers: data.max_players,
          currentMap: data.current_map || 'Unbekannt',
          isLoading: false
        };
      }
      return server;
    });
  } catch (error) {
    console.error('Failed to fetch server information:', error);
    servers.value = servers.value.map(server => {
      if (server.id === 'mc1') {
        return {
          ...server,
          online: false,
          isLoading: false
        };
      }
      return server;
    });
  }
};

onMounted(() => {
  carouselInterval = setInterval(nextImage, 5000);
  fetchServerInfo();
  setInterval(fetchServerInfo, 60000);
});

onUnmounted(() => {
  clearInterval(carouselInterval);
});
</script>

<style scoped>

.server-carousel {
  width: 100%;
  height: 50vh;
  margin-bottom: 3rem;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.carousel-images {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-images img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-images img.active {
  opacity: 1;
}

.carousel-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--clr-primary);
  transform: scale(1.2);
}

.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .ranking-toggle {
    flex-direction: column;
    align-items: center;
  }

  .toggle-button {
    width: 100%;
    max-width: 300px;
  }

  .servers-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
}
</style>
