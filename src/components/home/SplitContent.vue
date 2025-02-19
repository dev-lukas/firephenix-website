// components/SplitContent.vue
<template>
  <section class="content-section">
    <div class="headline-container" ref="headlineRef">
      <h2 class="main-headline" :class="{ 'fade-in': isVisible }">
        Wähle und<br />beginne deine Reise
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

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '-10% 0px',
    }
  );

  if (headlineRef.value) {
    observer.observe(headlineRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<style scoped>
.headline-container {
  position: absolute;
  width: 100%;
  top: 15%;
  transform: translateY(-200%);
  text-align: center;
  z-index: 10;
}

.main-headline {
  color: white;
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
  background-color: #121212;
}

.left-half {
  background-color: #121212;
}

.right-half {
  background-color: #121212;
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
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3vh;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 0.25vh solid rgba(255, 255, 255, 0.1);
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
    rgba(249, 133, 0, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(249, 133, 0, 0.2);
  border-color: rgba(249, 133, 0, 0.3);
}

.info-card:hover::before {
  transform: translateX(100%);
}

.app-button {
  width: 25vh;
  height: 25vh;
  padding: 10px;
  border: 0.25vh solid rgba(0, 0, 0, 0.2);
  border-radius: 3vh;
  background-color: rgb(18, 18, 18);
  background-color: rgba(255, 255, 255, 0.06);
  background-blend-mode: overlay;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.app-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(249, 133, 0, 0.943);
  border-color: rgba(249, 133, 0, 0.943);
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
  color: white;
}

.app-description {
  color: #999;
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
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.divider-or {
  color: rgba(255, 255, 255, 0.3);
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
