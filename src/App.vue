<!-- App.vue -->
<template>
  <div class="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

/* Global styles */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1e1e1e; /* Dark background for the entire page */
  color: #e0e0e0; /* Default light text color */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #1e1e1e; /* Ensure app container also has dark background */
}

main {
  flex: 1;
  padding: 1rem;
  /* Add some padding to the main content area */
}

/* Basic link styling */
a {
  color: #FFA500; /* Orange accent for links */
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #ffcc66; /* Lighter orange on hover */
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
