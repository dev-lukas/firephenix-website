// components/HeroSection.vue
<template>
  <base-section class="video-section">
    <BackgroundVideo />
    <div class="gradient-overlay"></div>
    <div class="content-overlay">
      <div class="hero-content">
        <h1 class="hero-title">FirePhenix</h1>
        <p class="hero-subtitle">Spiele mit Freunden und lerne neue Leute kennen.<br>Eine Gaming Community seit über 10 Jahren.</p>
        <base-button
          variant="secondary"
          class="scroll-button"
          large
          @click="scrollToContent"
        >
          Beginne dein Abenteuer
        </base-button>
      </div>
    </div>
  </base-section>
</template>

<script setup lang="ts">
import BackgroundVideo from './BackgroundVideo.vue';
import BaseSection from '../base/BaseSection.vue';
import BaseButton from '../base/BaseButton.vue';

const scrollToContent = () => {
  document
    .querySelector('.content-section')
    ?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.video-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 0;
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-content {
  text-align: center;
  transform: translateY(-5vh);
}

.hero-title {
  color: var(--clr-text-primary);
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.7);
}

.scroll-button {
  background: var(--clr-white-light) !important;
  color: var(--clr-background) !important;
  padding: 1rem 2rem !important;
  width: auto !important;
  font-size: 1.2rem !important;
  transform: translateY(0);
  transition: all 0.2s ease !important;
}

.scroll-button:hover {
  transform: translateY(-4px);
  background: var(--clr-white) !important;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
    padding: 0 1rem;
  }
}
</style>
