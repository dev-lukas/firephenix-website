<!-- App.vue -->
<template>
  <div class="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';

onMounted(() => {
  const link = document.querySelector("link[rel~='icon']");
  if (!link) {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    document.head.appendChild(newLink);
    newLink.href = '/src/assets/images/phoenix_icon.png';
  } else {
    link.href = '/src/assets/images/phoenix_icon.png';
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}


body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1e1e1e; 
  color: #e0e0e0; 
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #1e1e1e; 
}

main {
  flex: 1;
  padding: 1rem;
}


a {
  color: #FFA500; 
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #ffcc66;
}

select {
  color-scheme: dark;
  background-color: var(--clr-surface-elevated-1);
  color: var(--clr-text-primary);
}

select option {
  background-color: var(--clr-surface-elevated-1);
  color: var(--clr-text-primary);
}

select:focus {
  outline: none;
  border-color: var(--clr-border);
}

select option:hover,
select option:focus,
select option:active,
select option:checked {
  background-color: var(--clr-primary);
}
</style>
