// components/NavBar.vue
<template>
  <div class="navbar">
    <button class="menu-toggle" @click="toggleMenu">
      <div class="hamburger" :class="{ active: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <div class="nav-menu" :class="{ open: isMenuOpen }">
      <nav>
        <ul>
          <li>
            <base-nav-item to="/" @click="closeMenu">Home</base-nav-item>
          </li>
          <li>
            <base-nav-item to="/ranking" @click="closeMenu">
              Rangliste
            </base-nav-item>
          </li>
          <li>
            <base-nav-item to="/profile" @click="closeMenu">
              Mein Profil
            </base-nav-item>
          </li>
          <li>
            <base-nav-item to="/gameserver" @click="closeMenu">
              Game-Server
            </base-nav-item>
          </li>
          <li class="profile-divider">
            <base-nav-item to="/wiki" @click="closeMenu">
              Wissenswert
            </base-nav-item>
          </li>
          <li>
            <base-nav-item to="/dataprivacy" @click="closeMenu">
              Datenschutz
            </base-nav-item>
          </li>
          <li>
            <base-nav-item to="/impressum" @click="closeMenu">
              Impressum
            </base-nav-item>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseNavItem from './base/BaseNavItem.vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
}

.menu-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.hamburger {
  width: 30px;
  height: 25px;
  position: relative;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: var(--clr-text-primary);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) {
  top: 0;
}
.hamburger span:nth-child(2) {
  top: 10px;
}
.hamburger span:nth-child(3) {
  top: 20px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 10px;
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 10px;
}

.nav-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: var(--clr-background);
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: -10px 0 20px -10px var(--clr-primary-transparent);
}

.nav-menu.open {
  right: 0;
}

.nav-menu ul {
  list-style: none;
  padding: 60px 0 0 0;
}

.nav-menu li {
  padding: 15px 30px;
}

.profile-divider {
  border-bottom: 1px solid var(--clr-primary-transparent);
  margin-bottom: 15px;
  padding-bottom: 25px !important;
}

@media (max-width: 768px) {
  .nav-menu {
    width: 100vw;
    right: -100vw;
    box-shadow: none;
  }

  .nav-menu ul {
    padding: 80px 0 0 0;
    text-align: center;
  }

  .nav-menu li {
    padding: 20px 30px;
  }
}
</style>
