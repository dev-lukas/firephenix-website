// components/HeroSection.vue
<template>
  <section class="video-section">
    <BackgroundVideo />
    <div class="gradient-overlay"></div>
    <div class="content-overlay">
      <div class="hero-content">
        <h1 class="hero-title">FirePhenix</h1>
        <button @click="scrollToContent" class="scroll-button">
          Beginne dein Abenteuer
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import BackgroundVideo from './BackgroundVideo.vue'

const scrollToContent = () => {
  document.querySelector('.content-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.video-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  background: linear-gradient(to bottom, transparent, #121212);
  z-index: 2;
  pointer-events: none;
}

.content-overlay {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-10vh);
}

.hero-content {
  text-align: center;
}

.hero-title {
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.scroll-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: translateY(4vh);
}

.scroll-button:hover {
  transform: translateY(3vh);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
    padding: 0 1rem;
  }
}
</style>
