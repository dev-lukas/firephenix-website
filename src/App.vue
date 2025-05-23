<!-- App.vue -->
<template>
  <div class="app">
    <canvas id="bg-canvas"></canvas>
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  // Favicon logic
  const link = document.querySelector("link[rel~='icon']");
  const faviconUrl = new URL('./assets/images/phoenix_icon.png', import.meta.url).href;
  if (!link) {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    document.head.appendChild(newLink);
    newLink.href = faviconUrl;
  } else {
    link.href = faviconUrl;
  }

  // Flame sparks background logic
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let animationId;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', resize);

  const SPARKS = 10; 
  function randomSpark() {
    const baseHue = 25 + Math.random() * 15; 
    return {
      x: Math.random() * width,
      y: height + Math.random() * 40,
      vx: (Math.random() - 0.45) * 0.68, 
      vy: -0.7 - Math.random() * 0.5, 
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 1000 + Math.random() * 80,
      color: `hsl(${baseHue}, 98%, ${55 + Math.random() * 10}%)` 
    };
  }
  const sparks = Array.from({ length: SPARKS }, randomSpark);

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < SPARKS; i++) {
      const s = sparks[i];
      ctx.save();
      ctx.globalAlpha = s.alpha * (1 - s.life / s.maxLife);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function update() {
    for (let i = 0; i < SPARKS; i++) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      if (s.y < -10 || s.x < -10 || s.x > width + 10 || s.life > s.maxLife) {
        Object.assign(s, randomSpark());
        s.y = height + Math.random() * 20;
      }
    }
  }

  function animate() {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }
  animate();

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

#bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: transparent;
}

body, #app {
  min-height: 100vh;
  width: 100%;
  background-color: var(--clr-background);
}

#app {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

main {
  flex: 1;
  padding: 1rem;
}

a {
  color: var(--clr-primary); 
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--clr-primary-light);
}

select {
  color-scheme: dark;
  background-color: var(--clr-surface-2);
  color: var(--clr-text-primary);
}

select option {
  background-color: var(--clr-surface-2);
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
