// components/HeroSection.vue
<template>
  <base-section class="video-section">
    <BackgroundVideo />
    <div class="gradient-overlay"></div>
    <div class="content-overlay">
      <div class="hero-content" :class="{ visible: heroVisible }">
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
import { ref, onMounted } from 'vue';
import BackgroundVideo from './BackgroundVideo.vue';
import BaseSection from '../base/BaseSection.vue';
import BaseButton from '../base/BaseButton.vue';

const heroVisible = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    heroVisible.value = true;
  });
});

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
  background: linear-gradient(to bottom, transparent, var(--clr-background));
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
  opacity: 0;
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-content.visible {
  opacity: 1;
  transform: translateY(-5vh) translateY(0);
}

.hero-title {
  color: var(--clr-text-primary);
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
  letter-spacing: 1px;
}

.hero-subtitle {
  color: var(--clr-text-primary);
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
  line-height: 1.5;
}

.scroll-button {
  background: var(--clr-white-light) !important;
  color: var(--clr-background) !important;
  padding: 1rem 2rem !important;
  width: auto !important;
  font-size: 1.2rem !important;
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.scroll-button:hover {
  transform: translateY(-4px);
  background: var(--clr-white) !important;
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
    padding: 0 1rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
}
</style>
