// components/NavBar.vue
<template>
  <div class="navbar">
    <button class="menu-toggle" @click="toggleMenu">
      <div class="hamburger" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
    
    <div class="nav-menu" :class="{ 'open': isMenuOpen }">
      <nav>
        <ul>
          <li><router-link to="/" @click="closeMenu">Home</router-link></li>
          <li><router-link to="/ranking" @click="closeMenu">Rangliste</router-link></li>
          <li><router-link to="/" @click="closeMenu">Mein Profil</router-link></li>
          <li class="profile-divider"><router-link to="/gameserver" @click="closeMenu">Game-Server</router-link></li>
          <li><router-link to="/dataprivacy" @click="closeMenu">Datenschutz</router-link></li>
          <li><router-link to="/impressum" @click="closeMenu">Impressum</router-link></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
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
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 10px; }
.hamburger span:nth-child(3) { top: 20px; }

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
  background-color: #121212;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: -10px 0 20px -10px rgba(249, 133, 0, 0.2);
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
  border-bottom: 1px solid rgba(249, 133, 0, 0.2);
  margin-bottom: 15px;
  padding-bottom: 25px !important;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
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

  .nav-menu a {
    font-size: 1.5rem;
  }
}
</style>
