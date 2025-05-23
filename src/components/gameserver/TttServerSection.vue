<template>
  <BaseSection class="ttt-server-section">
    <p class="section-description">Der Klassiker. Revitalisiert. Spiele TTT wie in alten Zeiten und genieße eine Mischung aus neusten TTT Standarts und purer Nostalgie!</p>
    
    <div class="accent-path-container">
      <svg class="accent-path" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path 
          d="M50,0 C70,200 30,400 50,600 C70,800 30,1000 50,1000" 
          stroke="var(--clr-primary)" 
          stroke-width="4" 
          fill="none" 
          stroke-dasharray="1000"
          stroke-dashoffset="1000"
          class="path-animation">
        </path>
      </svg>
      
      <div class="feature-sections">
        <div class="feature-section left" v-for="(feature, index) in features" :key="index" :class="{ 'active': activeFeatures[index] }">
          <div class="feature-content" :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }">
            <div class="feature-image-container">
              <img :src="feature.image" :alt="feature.title" class="feature-image" />
              <div class="feature-image-overlay"></div>
            </div>
            <div class="feature-text">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="cta-container">
      <a href="steam://connect/gaming.firephenix.de:27015" class="join-server-link">
        <BaseButton class="join-server-btn">Spiele Jetzt</BaseButton>
        <p class="server-stats">gaming.firephenix.de</p>
      </a>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseSection from '../base/BaseSection.vue';
import BaseButton from '../base/BaseButton.vue';


const features = [
  {
    title: "Handverlesene Karten",
    description: "Erlebe unsere handselektierte Auswahl an TTT-Karten, die Spielspaß, Nostalgie und bestmögliche Grafik kombinieren.",
    image: new URL('../../assets/images/games/ttt_tokyo.jpeg', import.meta.url).href,
    position: 5 
  },
  {
    title: "Angepasste Addons",
    description: "Genieße Addons, die das Gameplay verbessern und die Spielerfahrung auf ein neues Level heben, ohne den Charm des Klassikers zu verlieren.",
    image: new URL('../../assets/images/games/detective.png', import.meta.url).href,
    position: 25
  },
  {
    title: "Skin Shop",
    description: "Erhalte Punkte für das Spielen und Gewinnen von Runden. Löse sie ein für Skins deiner Wahl.",
    image: new URL('../../assets/images/games/ttt_rewards.png', import.meta.url).href,
    position: 50
  },
  {
    title: "Waffen Balancing",
    description: "Von permanenten Waffen bis hin zu Balancing Änderungen über bessere Hitboxen, wir haben alles im Griff. Genieße ein faires und spannendes Spielerlebnis.",
    image: new URL('../../assets/images/games/phoenix-agent.png', import.meta.url).href,
    position: 85
  }
];

const activeFeatures = ref(features.map(() => false));
let observers: IntersectionObserver[] = [];

onMounted(() => {
  document.querySelector('.path-animation')?.classList.add('animate-path');
  const featureSections = document.querySelectorAll('.feature-section');
  
  featureSections.forEach((section, index) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeFeatures.value[index] = true;
          }
        });
      },
      { 
        threshold: 0.75
      }
    );
    
    observer.observe(section);
    observers.push(observer);
  });
});

onUnmounted(() => {
  observers.forEach(observer => observer.disconnect());
});
</script>

<style scoped>
.ttt-server-section {
  position: relative;
  overflow: hidden;
  padding-bottom: 6rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 1.2rem;
  color: var(--clr-text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
}

.accent-path-container {
  position: relative;
  width: 100%;
  height: 2800px;
  margin: 2rem 0;
}

.accent-path {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 100px;
  z-index: 1;
}

.path-animation {
  animation: drawPath 5s ease-in-out forwards;
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}

.feature-sections {
  position: relative;
  height: 100%;
}

.feature-section {
  position: sticky;
  transform: translateY(-50%);
  margin: 30vh 0;
  opacity: 0;
  transition: opacity 0.6s ease-in-out, transform 0.8s ease-in-out;
  z-index: 2;
}

.feature-section.active {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.feature-content {
  display: flex;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  background: var(--clr-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px var(--clr-box-shadow);
  border: 1px solid var(--clr-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px var(--clr-box-shadow-orange);
  border-color: var(--clr-border-strong);
}

.feature-content.left {
  flex-direction: row;
}

.feature-content.right {
  flex-direction: row-reverse;
}

.feature-image-container {
  flex: 0 0 50%;
  position: relative;
  overflow: hidden;
  height: 300px;
}

.feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.feature-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(249,133,0,0.2) 100%);
  z-index: 1;
}

.feature-content:hover .feature-image {
  transform: scale(1.05);
}

.feature-text {
  flex: 0 0 50%;
  padding: 2rem;
  z-index: 2;
}

.feature-text h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--clr-primary-light);
  margin-bottom: 1rem;
}

.feature-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--clr-text-primary);
}

.cta-container {
  text-align: center;
  margin-top: 3rem;
}

.join-server-btn {
  font-size: 1.2rem;
  padding: 12px 36px;
  background-color: var(--clr-primary);
  color: var(--clr-text-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px var(--clr-box-shadow-orange);
}

.join-server-btn:hover {
  background-color: var(--clr-primary-light);
  transform: translateY(-2px);
}

.server-stats {
  margin-top: 1rem;
  font-size: 1rem;
  color: var(--clr-text-secondary);
}

.highlight {
  color: var(--clr-primary);
  font-weight: bold;
}

@media (max-width: 992px) {
  .feature-content {
    flex-direction: column !important;
    max-width: 90%;
  }
  
  .feature-image-container,
  .feature-text {
    flex: 0 0 100%;
    width: 80%;
  }

  .feature-image-container {
    margin-top: 2vh;
    border-radius: 15px;
  }
  
  .feature-text {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .section-description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .feature-image-container {
    margin-top: 2vh;
    border-radius: 15px;
  }
  
  .feature-text h3 {
    font-size: 1.5rem;
  }
  
  .feature-text p {
    font-size: 1rem;
  }
}
</style>