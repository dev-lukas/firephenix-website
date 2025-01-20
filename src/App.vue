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

#app {
  min-height: 100vh;
  width: 100%;
  background-color: var(--clr-background);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--clr-background);
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
