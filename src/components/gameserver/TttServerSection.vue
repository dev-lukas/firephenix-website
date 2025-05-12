<template>
  <div>
    <div class="server-carousel">
      <div class="carousel-images" ref="carousel">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image"
          :alt="`Server Screenshot ${index + 1}`"
          :class="{ active: currentImage === index }"
        />
      </div>
      <div class="carousel-dots">
        <button
          v-for="(_, index) in images"
          :key="index"
          class="dot"
          :class="{ active: currentImage === index }"
          @click="setImage(index)"
        ></button>
      </div>
    </div>

    <div class="servers-grid">
      <base-server-card
        v-for="server in servers"
        :key="server.id"
        :title="server.name"
        :image="server.image"
        :is-online="server.online"
        :players="server.currentPlayers"
        :max-players="server.maxPlayers"
        :map="server.currentMap"
        :is-loading="server.isLoading"
        @connect="connectToServer(server.connectUrl)"
      >
        {{ server.description }}
      </base-server-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseServerCard from '../base/BaseServerCard.vue';

const images = [
  '/src/assets/images/games/ttt_play.jpg',
  '/src/assets/images/games/ttt_tokyo.jpeg',
  '/src/assets/images/games/ttt_rooftop.jpeg',
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
    id: 'ttt1',
    name: 'TTT Server',
    image: '/src/assets/images/games/ttt.png',
    description:
      'Der klassische TTT Server ist zurück! Mit Custom Waffen, Balancing, Skins, Gambling für Tote, einer handverlesenen Map Auswahl und vielem mehr! Perfekt für Einsteiger und erfahrene Spieler.',
    online: false,
    currentPlayers: 0,
    maxPlayers: 0,
    currentMap: 'Lade...',
    connectUrl: 'steam://connect/gaming.firephenix.de:27015',
    isLoading: true,
  },
]);

const connectToServer = (url: string) => {
  window.location.href = url;
};

const fetchServerInfo = async () => {
  try {
    const response = await fetch('/api/server/ttt?address=gaming.firephenix.de&port=27015');
    const data = await response.json();
    
    servers.value = servers.value.map(server => {
      if (server.id === 'ttt1') {
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
      if (server.id === 'ttt1') {
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
  padding: 0 1rem;
  height: 50vh;
  margin-bottom: 3rem;
  position: relative;
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
  border-radius: 12px;
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
