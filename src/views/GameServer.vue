// views/GameServer.vue
<template>
  <base-section>
    <h1 class="page-title">Unsere Game Server</h1>

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
        @connect="connectToServer(server.connectUrl)"
      >
        {{ server.description }}
      </base-server-card>
    </div>
  </base-section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseSection from '../components/base/BaseSection.vue';
import BaseServerCard from '../components/base/BaseServerCard.vue';

const images = [
  '/src/assets/images/server/ttt1.jpg',
  '/src/assets/images/server/ttt2.jpg',
  '/src/assets/images/server/prophunt1.jpg',
  '/src/assets/images/server/prophunt2.jpg',
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
    name: 'TTT Server #1',
    image: '/src/assets/images/games/phoenix-agent.png',
    description:
      'Der klassische TTT Server mit custom Rollen und Waffen. Perfekt für Einsteiger und erfahrene Spieler.',
    online: true,
    currentPlayers: Math.floor(Math.random() * 20),
    maxPlayers: 24,
    currentMap: 'ttt_minecraft_b5',
    connectUrl: 'steam://connect/ttt.firephenix.de:27015',
  },
  {
    id: 'ttt2',
    name: 'TTT Server #2',
    image: '/src/assets/images/games/phoenix-agent.png',
    description:
      'Für die Profis unter euch. Hier gibt es zusätzliche Rollen und spezielle Events.',
    online: true,
    currentPlayers: Math.floor(Math.random() * 20),
    maxPlayers: 24,
    currentMap: 'ttt_minecraft_haven',
    connectUrl: 'steam://connect/ttt2.firephenix.de:27016',
  },
]);

const connectToServer = (url: string) => {
  window.location.href = url;
};

// Update player counts periodically
const updatePlayerCounts = () => {
  servers.value = servers.value.map((server) => ({
    ...server,
    currentPlayers: Math.floor(Math.random() * server.maxPlayers),
  }));
};

onMounted(() => {
  carouselInterval = setInterval(nextImage, 5000);
  setInterval(updatePlayerCounts, 30000); // Update every 30 seconds
});

onUnmounted(() => {
  clearInterval(carouselInterval);
});
</script>

<style scoped>
.page-title {
  font-size: 2.5rem;
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.server-carousel {
  max-width: 1200px;
  margin: 0 auto 3rem;
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

  .servers-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
}
</style>
