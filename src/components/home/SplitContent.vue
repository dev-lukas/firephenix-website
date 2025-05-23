// components/SplitContent.vue
<template>
  <section class="content-section">
    <p class="explore-text explore-topright" :class="{ 'fade-in': showExplore }">Oder erkunde unsere Website →</p>
    <div class="headline-container" ref="headlineRef">
      <h2 class="main-headline" :class="{ 'fade-in': isVisible }">
        Wähle dein Weg und<br />beginne deine Reise
      </h2>
    </div>
    <div class="left-half">
      <div class="content-wrapper">
        <div class="info-card">
          <button
            class="app-button"
            @click="openLink('ts3server://firephenix.de?port=9987')"
          >
            <div class="app-icon left-logo"></div>
          </button>
          <div class="card-content">
            <h4 class="app-title">TeamSpeak 3</h4>
            <p class="app-description">
              Höchste Klangqualität, Resourcenschonend mit niedriger Latenz,
              Privat. Deine Daten gehören dir.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="fancy-divider">
      <div class="divider-line"></div>
      <div class="divider-or">ODER</div>
      <div class="divider-line"></div>
    </div>

    <div class="right-half">
      <div class="content-wrapper">
        <div class="info-card">
          <button
            class="app-button"
            @click="openLink('https://discord.gg/sT4NPRQSAT')"
          >
            <div class="app-icon right-logo"></div>
          </button>
          <div class="card-content">
            <h4 class="app-title">Discord</h4>
            <p class="app-description">
              Chatten und Streamen, Spieleintegrationen, Intuitiv, permanenter
              Chat. Grenzenlose Möglichkeiten.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const openLink = (url) => {
  window.open(url, '_blank');
};

const headlineRef = ref(null);
const isVisible = ref(false);
const showExplore = ref(false);
let exploreTimeout = null;

function checkScroll() {
  const scrollPosition = window.scrollY + window.innerHeight;
  const threshold = document.body.scrollHeight - window.innerHeight * 0.2; 
  isVisible.value = scrollPosition >= threshold;
  if (exploreTimeout) {
    clearTimeout(exploreTimeout);
    exploreTimeout = null;
  }
  if (isVisible.value && window.innerWidth > 1024) {
    exploreTimeout = setTimeout(() => { showExplore.value = true; }, 400);
  } else {
    showExplore.value = false;
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  checkScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.headline-container {
  position: absolute;
  width: 100%;
  top: 35%; /* Lowered for desktop */
  transform: translateY(-200%);
  text-align: center;
  z-index: 10;
}

.main-headline {
  color: var(--clr-text-primary);
  font-size: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 2s ease,
    transform 1.4s ease;
  visibility: visible;
}

.main-headline.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.explore-text {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin-top: 1rem;
  display: block;
  opacity: 0;
  transition: opacity 0.3s;
}

.explore-text.fade-in {
  opacity: 1;
  transition: opacity 1s;
}

.explore-topright {
  position: fixed;
  top: 0.5vh;
  right: 4vw;
  z-index: 900;
  display: none;
}

@media (min-width: 1025px) {
  .explore-topright {
    display: block;
  }
}

.content-section {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.left-half,
.right-half {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  position: relative;
  text-align: center;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.left-logo {
  background-image: url('../../assets/images/other/teamspeak.png');
}

.right-logo {
  background-image: url('../../assets/images/other/discord.png');
}

.info-card {
  background: var(--clr-surface);
  border-radius: 3vh;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 0.25vh solid var(--clr-border);
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    var(--clr-primary-transparent),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px var(--clr-primary-transparent);
  border-color: var(--clr-primary-transparent-strong);
}

.info-card:hover::before {
  transform: translateX(100%);
}

.app-button {
  width: 25vh;
  height: 25vh;
  padding: 10px;
  border: 0.25vh solid var(--clr-border);
  border-radius: 3vh;
  background-color: var(--clr-surface-2);
  background-blend-mode: overlay;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 8px var(--clr-box-shadow);
  margin-bottom: 1.5rem;
}

.app-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--clr-primary);
  border-color: var(--clr-primary);
}

.app-icon {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.card-content {
  text-align: center;
}

.app-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--clr-text-primary);
}

.app-description {
  color: var(--clr-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.fancy-divider {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}

.divider-line {
  width: 2px;
  height: 15vh;
  background: linear-gradient(
    180deg,
    transparent,
    var(--clr-transparent),
    transparent
  );
}

.divider-or {
  color: var(--clr-transparent);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .left-half,
  .right-half {
    flex: 100%;
    min-height: 50vh;
  }

  .fancy-divider {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .headline-container {
    top: 15%; 
  }

  .main-headline {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .app-button {
    width: 100px;
    height: 100px;
  }

  .info-card {
    padding: 1.5rem;
  }

  .app-title {
    font-size: 1.2rem;
  }
}
</style>
