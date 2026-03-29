<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo" @click="closeMenu">
        <img :src="logoSrc" alt="FirePhenix" class="logo-img" />
        <span class="logo-text">FirePhenix</span>
      </router-link>

      <nav class="nav-links">
        <base-nav-item to="/">Home</base-nav-item>
        <base-nav-item to="/ranking">Rangliste</base-nav-item>
        <base-nav-item to="/profile">Mein Profil</base-nav-item>
        <base-nav-item to="/gameserver">Game-Server</base-nav-item>
        <base-nav-item to="/wiki">Wissenswert</base-nav-item>
        <span class="nav-sep"></span>
        <base-nav-item to="/dataprivacy" class="nav-legal">Datenschutz</base-nav-item>
        <base-nav-item to="/impressum" class="nav-legal">Impressum</base-nav-item>
      </nav>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Menu">
        <div class="hamburger" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>

    <Transition name="overlay">
      <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>
    </Transition>

    <div class="mobile-menu" :class="{ open: isMenuOpen }">
      <nav>
        <ul>
          <li><base-nav-item to="/" @click="closeMenu">Home</base-nav-item></li>
          <li><base-nav-item to="/ranking" @click="closeMenu">Rangliste</base-nav-item></li>
          <li><base-nav-item to="/profile" @click="closeMenu">Mein Profil</base-nav-item></li>
          <li><base-nav-item to="/gameserver" @click="closeMenu">Game-Server</base-nav-item></li>
          <li class="mobile-divider">
            <base-nav-item to="/wiki" @click="closeMenu">Wissenswert</base-nav-item>
          </li>
          <li><base-nav-item to="/dataprivacy" @click="closeMenu">Datenschutz</base-nav-item></li>
          <li><base-nav-item to="/impressum" @click="closeMenu">Impressum</base-nav-item></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import BaseNavItem from './base/BaseNavItem.vue';

const logoSrc = computed(() => new URL('../assets/images/phoenix_icon.png', import.meta.url).href);

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  border-bottom-color: var(--clr-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--clr-text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.nav-logo:hover .logo-img {
  transform: scale(1.1);
}

.logo-text {
  background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.nav-sep {
  width: 1px;
  height: 14px;
  background: var(--clr-transparent-middle);
  margin: 0 0.35rem;
}

.nav-legal :deep(.nav-item) {
  font-size: 0.78rem;
  opacity: 0.45;
  transition: opacity 0.25s ease, color 0.25s ease, background 0.25s ease;
}

.nav-legal :deep(.nav-item:hover),
.nav-legal :deep(.nav-item.active) {
  opacity: 1;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1002;
}

.hamburger {
  width: 26px;
  height: 20px;
  position: relative;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: var(--clr-text-primary);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 9px; }
.hamburger span:nth-child(3) { top: 18px; }

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 9px;
}
.hamburger.active span:nth-child(2) {
  opacity: 0;
}
.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 9px;
}

/* Mobile */
.mobile-overlay {
  display: none;
}

.mobile-menu {
  display: none;
}

@media (max-width: 860px) {
  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: block;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100vh;
    background-color: var(--clr-background);
    transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1001;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  }

  .mobile-menu.open {
    right: 0;
  }

  .mobile-menu ul {
    list-style: none;
    padding: 5rem 0 0;
  }

  .mobile-menu li {
    padding: 0.9rem 2rem;
  }

  .mobile-menu :deep(.nav-item) {
    font-size: 1.1rem;
  }

  .mobile-divider {
    border-bottom: 1px solid var(--clr-primary-transparent);
    margin-bottom: 0.75rem;
    padding-bottom: 1.65rem !important;
  }
}

@media (max-width: 480px) {
  .mobile-menu {
    width: 100vw;
    right: -100vw;
    box-shadow: none;
  }

  .mobile-menu ul {
    text-align: center;
  }
}

/* Overlay transition */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
