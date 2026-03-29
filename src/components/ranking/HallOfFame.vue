<template>
  <div class="hall-of-fame">
    <div v-if="loading" class="hof-loading">
      <div class="loader"></div>
      <span>Lade Hall of Fame...</span>
    </div>

    <div v-else class="hof-grid">
      <div
        v-for="(cat, index) in categories"
        :key="cat.key"
        class="hof-card"
        :style="{
          '--accent': cat.accent,
          '--delay': (index * 80) + 'ms'
        }"
      >
        <div class="card-accent"></div>

        <div class="card-header">
          <font-awesome-icon :icon="['fas', cat.icon]" class="cat-icon" />
          <span class="cat-label">{{ cat.label }}</span>
        </div>

        <template v-if="data[cat.key]?.length">
          <!-- #1 Spotlight -->
          <div class="spotlight" @click="goToProfile(data[cat.key][0].id)">
            <div class="spotlight-avatar">
              <img :src="getLevelImg(data[cat.key][0].level)" :alt="data[cat.key][0].name" />
            </div>
            <div class="spotlight-name">{{ data[cat.key][0].name }}</div>
            <div class="spotlight-value">{{ cat.format(data[cat.key][0].value) }}</div>
          </div>

          <!-- #2 & #3 Runners-up -->
          <div class="runners">
            <div
              v-for="(player, i) in data[cat.key].slice(1)"
              :key="player.id"
              class="runner"
              @click="goToProfile(player.id)"
            >
              <span class="runner-rank">#{{ i + 2 }}</span>
              <span class="runner-name">{{ player.name }}</span>
              <span class="runner-value">{{ cat.format(player.value) }}</span>
            </div>
          </div>
        </template>

        <div v-else class="no-data">Keine Daten</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const data = ref({});

const categories = [
  {
    key: 'longest_streak',
    label: 'Beharrlichster Spieler',
    icon: 'fire',
    accent: '#ff4500',
    format: (v) => `${v} Tage`
  },
  {
    key: 'current_streak',
    label: 'Heißeste Streak',
    icon: 'fire',
    accent: '#ff6b35',
    format: (v) => `${v} Tage aktiv`
  },
  {
    key: 'most_logins',
    label: 'Treuester Spieler',
    icon: 'sign-in-alt',
    accent: 'rgba(249, 133, 0, 0.9)',
    format: (v) => `${v} Logins`
  },
  {
    key: 'most_achievements',
    label: 'Sammler',
    icon: 'trophy',
    accent: '#ffd700',
    format: (v) => `${v} Achievements`
  },
  {
    key: 'most_active_times',
    label: 'Flexibelster Spieler',
    icon: 'calendar-week',
    accent: '#8E24AA',
    format: (v) => `${v}/28 Zeitslots`
  },
  {
    key: 'oldest_member',
    label: 'Urgestein',
    icon: 'clock',
    accent: '#c0c0c0',
    format: (v) => `${v} Tage dabei`
  }
];

const getLevelImg = (level) => {
  return new URL(`../../assets/images/level/${level}.png`, import.meta.url).href;
};

const goToProfile = (id) => {
  router.push(`/ranking/player-${id}`);
};

onMounted(async () => {
  try {
    const res = await fetch('/api/ranking/hall-of-fame');
    if (res.ok) {
      data.value = await res.json();
    }
  } catch (e) {
    console.error('Hall of Fame fetch failed:', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hall-of-fame {
  padding: 1rem 0;
}

.hof-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  color: var(--clr-text-secondary);
  gap: 1rem;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--clr-surface-3);
  border-radius: 50%;
  border-top-color: var(--clr-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Grid ── */
.hof-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ── Card ── */
.hof-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 14px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(16px);
  animation: card-up 0.5s var(--transition-smooth) var(--delay) forwards;
  transition: transform 0.3s var(--transition-bounce),
              box-shadow 0.3s var(--transition-smooth);
}

.hof-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3),
              0 0 20px -8px var(--accent);
}

@keyframes card-up {
  to { opacity: 1; transform: translateY(0); }
}

/* Accent top border */
.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  opacity: 0.8;
}

/* ── Header ── */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.cat-icon {
  color: var(--accent);
  font-size: 1.1rem;
}

.cat-label {
  color: var(--clr-text-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

/* ── #1 Spotlight ── */
.spotlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.spotlight:hover {
  transform: scale(1.03);
}

.spotlight-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--clr-surface-2);
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 20px -5px var(--accent);
}

.spotlight-avatar img {
  width: 75%;
  height: 75%;
  object-fit: contain;
}

.spotlight-name {
  color: var(--clr-text-primary);
  font-weight: 600;
  font-size: 1.05rem;
}

.spotlight-value {
  color: var(--accent);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

/* ── Runners-up ── */
.runners {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-top: 1px solid var(--clr-border);
  padding-top: 0.75rem;
}

.runner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.runner:hover {
  background: var(--clr-transparent-light);
}

.runner-rank {
  color: var(--clr-text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 22px;
}

.runner-name {
  color: var(--clr-text-primary);
  font-size: 0.85rem;
  flex: 1;
}

.runner-value {
  color: var(--clr-text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
}

.no-data {
  text-align: center;
  color: var(--clr-text-secondary);
  padding: 2rem 0;
  font-size: 0.9rem;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hof-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hof-grid {
    grid-template-columns: 1fr;
  }

  .spotlight-avatar {
    width: 64px;
    height: 64px;
  }
}
</style>
