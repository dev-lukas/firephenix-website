// views/GameServer.vue
<template>
  <div class="game-servers">
    <!-- Image Showcase Carousel -->
    <div class="showcase-carousel" @click="handleShowcaseClick">
      <div class="showcase-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="showcase-slide" v-for="(slide, index) in showcaseSlides" :key="index">
          <img :src="slide.image" :alt="slide.title">
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <span v-for="(_, index) in showcaseSlides" 
              :key="index" 
              :class="{ active: currentSlide === index }"
              @click.stop="goToSlide(index)">
        </span>
      </div>
    </div>
    
    <div class="server-grid">
      <!-- TTT Server Card -->
      <div class="server-card">
        <div class="server-header">
          <img src="../assets/images/games/phoenix-agent.png" alt="TTT Server" class="server-banner">
          <div class="server-status online">
            <span class="status-dot"></span>
            Online: 12/24
          </div>
        </div>
        
        <div class="server-content">
          <h2>Trouble in Terrorist Town</h2>
          <div class="server-info">
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'map']" />
              Current Map: ttt_minecraft_b5
            </div>
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'clock']" />
              Round Time: 2:30
            </div>
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'server']" />
              IP: ttt.yourserver.com
            </div>
          </div>
          
          <div class="server-description">
            <p>Classic TTT gameplay with custom roles, maps, and features. Join our active community and experience unique addons and regular events.</p>
          </div>
          
          <div class="server-actions">
            <button class="join-button" @click="joinServer('steam://connect/ttt.yourserver.com:27015')">
              <font-awesome-icon :icon="['fas', 'play']" />
              Join Server
            </button>
            <button class="info-button" @click="showServerInfo('ttt')">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
              More Info
            </button>
          </div>
        </div>
      </div>

      <!-- Minecraft Server Card -->
      <div class="server-card">
        <div class="server-header">
          <img src="../assets/images/games/phoenix-minecraft.png" alt="Minecraft Server" class="server-banner">
          <div class="server-status online">
            <span class="status-dot"></span>
            Online: 45/100
          </div>
        </div>
        
        <div class="server-content">
          <h2>Minecraft Survival</h2>
          <div class="server-info">
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'code-branch']" />
              Version: 1.20.1
            </div>
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'globe']" />
              World Size: 50000x50000
            </div>
            <div class="info-item">
              <font-awesome-icon :icon="['fas', 'server']" />
              IP: mc.yourserver.com
            </div>
          </div>
          
          <div class="server-description">
            <p>Survival multiplayer with economy, land claiming, and custom plugins. Regular events and active staff team ensure a great gaming experience.</p>
          </div>
          
          <div class="server-actions">
            <button class="join-button" @click="copyIP('mc.yourserver.com')">
              <font-awesome-icon :icon="['fas', 'copy']" />
              Copy IP
            </button>
            <button class="info-button" @click="showServerInfo('minecraft')">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const handleShowcaseClick = (event) => {
  const clickX = event.clientX
  const containerWidth = event.currentTarget.offsetWidth
  
  if (clickX < containerWidth / 2) {
    prevSlide()
  } else {
    nextSlide()
  }
}

const showcaseSlides = [
  {
    image: '../assets/showcase1.jpg',
    title: 'TTT Custom Maps',
    description: 'Experience unique and exciting custom maps'
  },
  {
    image: '../assets/showcase2.jpg',
    title: 'Minecraft World',
    description: 'Explore vast landscapes and build your empire'
  },
  {
    image: '../assets/showcase3.jpg',
    title: 'Community Events',
    description: 'Join our regular community events and competitions'
  }
]

const currentSlide = ref(0)
let slideInterval

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % showcaseSlides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? showcaseSlides.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(slideInterval)
})

const joinServer = (connectUrl) => {
  window.location.href = connectUrl
}

const copyIP = (ip) => {
  navigator.clipboard.writeText(ip)
}

const showServerInfo = (server) => {
  // Implement modal or navigation to detailed server info
}
</script>

<style scoped>
.game-servers {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 20px 40px;
}

.page-title {
  color: var(--clr-text-primary);
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

/* Showcase Carousel Styles */
.showcase-carousel {
  position: relative;
  width: 100vw;
  height: 600px;
  margin: -80px -20px 4rem -20px;
  overflow: hidden;
  cursor: pointer;
}

.showcase-container {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.showcase-slide {
  min-width: 100%;
  position: relative;
}

.showcase-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4rem;
  background: linear-gradient(transparent, var(--clr-gradient-dark));
  color: var(--clr-text-primary);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.showcase-slide:hover .slide-content {
  opacity: 1;
  transform: translateY(0);
}

.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.8rem;
  z-index: 2;
}

.carousel-dots span {
  width: 40px;
  height: 4px;
  background: var(--clr-dot-inactive);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dots span.active {
  background: var(--clr-primary);
  width: 60px;
}

/* Server Grid Styles */
.server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 3rem;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
}

.server-card {
  background: var(--clr-surface);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--clr-border);
}

.server-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px var(--clr-primary-shadow);
}

.server-header {
  position: relative;
}

.server-banner {
  width: 100%;
  height: 300px;
  object-fit: contain;
}

.server-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--clr-overlay-dark);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: var(--clr-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #4CAF50;
  border-radius: 50%;
  display: inline-block;
}

.server-content {
  padding: 2rem;
}

.server-content h2 {
  color: var(--clr-text-primary);
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.server-info {
  display: grid;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.info-item {
  color: var(--clr-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
}

.server-description {
  color: var(--clr-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.8;
  font-size: 1.1rem;
}

.server-actions {
  display: flex;
  gap: 1.5rem;
}

.join-button, .info-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.join-button {
  background: var(--clr-primary);
  color: var(--clr-text-primary);
  flex: 2;
}

.info-button {
  background: var(--clr-surface-hover);
  color: var(--clr-text-primary);
  flex: 1;
}

.join-button:hover {
  background: var(--clr-primary);
  transform: translateY(-2px);
}

.info-button:hover {
  background: var(--clr-surface-hover-strong);
  transform: translateY(-2px);
}

@media (max-width: 968px) {
  .server-grid {
    grid-template-columns: 1fr;
  }

  .showcase-carousel {
    height: 400px;
    margin: -60px -20px 2rem -20px;
  }
  
  .slide-content {
    padding: 2rem;
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .server-actions {
    flex-direction: column;
  }

  .join-button, .info-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
