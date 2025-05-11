// views/Login.vue
<template>
  <div class="login-page">
    <h1 class="page-title">Manage deinen Account</h1>
    <div class="login-section">
      <div class="steam-login-box glow-effect">
        <div class="glow-container">
          <div class="glow"></div>
        </div>
        <div class="steam-logo">
          <img
            src="../../assets/images/other/steam.png"
            alt="Steam Logo"
            class="steam-logo-img"
          />
        </div>
        <button class="steam-login-button" @click="handleSteamLogin">
          <span class="button-content">
            <i class="fab fa-steam"></i>
            Mit Steam einloggen
          </span>
        </button>
        <p class="login-disclaimer">
          Dies wird dich zu Steams Login-Seite weiterleiten.
        </p>
      </div>
    </div>
    <div class="login-container">
      <div class="benefits-section">
        <div class="benefits-grid">
          <div
            class="benefit-card"
            v-for="(benefit, index) in benefits"
            :key="index"
          >
            <div class="benefit-icon">
              <i :class="benefit.icon"></i>
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <footer class="steam-footer">
      <div class="footer-content">
        © 2025 Valve Corporation. Steam und das Steam-Logo sind Marken und/oder
        eingetragene Marken von Valve Corporation in den USA und/oder anderen
        Ländern.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: 'fas fa-trophy',
    title: 'Zeit Sync',
    description:
      'Synchronisiere deine Onlinezeit und Level zwischen Discord und TeamSpeak',
  },
  {
    icon: 'fas fa-users',
    title: 'Permanente Channel',
    description:
      'Erstelle deinen eigenen permanenten Channel auf den Voice-Servern',
  },
  {
    icon: 'fas fa-trophy',
    title: 'Cosmetics',
    description:
      'Erhalte exklusive Kosmetik in TTT und auf anderen FirePhenix Game-Servern',
  },
];

const handleSteamLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth';
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--clr-background) 0%,
    var(--clr-background-dark) 100%
  );
  padding: 80px 0 0;
  color: var(--clr-text-primary);
  display: flex;
  flex-direction: column;
}

.page-title {
  text-align: center;
  font-size: min(2.8rem, 8vw);
  margin-bottom: 3rem;
  color: var(--clr-text-primary);
  background: linear-gradient(45deg, var(--clr-primary), var(--clr-accent));
  animation: titleFadeIn 0.8s ease-out;
}

.login-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
  animation: containerSlideUp 0.6s ease-out;
}

.benefits-section {
  margin-top: 4rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.benefit-card {
  background: var(--clr-surface);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid var(--clr-border);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  animation: cardFadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.benefit-card h3 {
  color: var(--clr-primary);
  margin-bottom: 1rem;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.benefit-icon {
  font-size: 2rem;
  color: var(--clr-primary);
  margin-bottom: 1rem;
}

.steam-login-box {
  background: var(--clr-surface);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid var(--clr-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: loginBoxSlideIn 0.8s ease-out;
  width: min(90%, 400px);
  margin: 0 auto;
}

.steam-logo-img {
  max-width: min(200px, 50vw);
  height: auto;
  margin-bottom: 2rem;
}

.steam-login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.login-disclaimer {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  margin-top: 1rem;
}

.steam-login-box {
  position: relative;
  background: var(--clr-surface);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: loginBoxSlideIn 0.8s ease-out;
  width: min(90%, 400px);
  margin: 0 auto;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(28, 28, 28, 0.8);
}

.glow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at center,
    rgba(255, 140, 0, 0.15) 0%,
    rgba(255, 69, 0, 0.1) 25%,
    rgba(255, 69, 0, 0.05) 50%,
    transparent 70%
  );
  animation: glowPulse 3s ease-in-out infinite;
  z-index: 1;
}

.steam-logo,
.steam-login-button,
.login-disclaimer {
  position: relative;
  z-index: 2;
}

.steam-login-button {
  background: var(--clr-primary);
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem 0;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.steam-login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.steam-login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 69, 0, 0.4);
}

.steam-login-button:hover::before {
  left: 100%;
}

@keyframes glowPulse {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
}

.steam-login-box:hover .glow {
  animation: glowPulse 2s ease-in-out infinite;
}

/* Enhance the steam logo with a subtle glow */
.steam-logo-img {
  filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.2));
}

.login-disclaimer {
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
}

.steam-footer {
  width: 100%;
  padding: 2rem 1rem;
  margin-top: auto;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: var(--clr-text-secondary);
  font-size: 0.8rem;
  line-height: 1.5;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.footer-content:hover {
  opacity: 1;
}

@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes containerSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
  }
}

@keyframes loginBoxSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 60px 16px 32px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .steam-login-box {
    padding: 2rem 1.5rem;
  }

  .glow {
    width: 140%;
    height: 140%;
  }

  .footer-content {
    font-size: 0.7rem;
  }

  .steam-footer {
    padding: 1.5rem 1rem;
  }
}
</style>
