<template>
  <BaseSection class="ttt-server-section">
    <section class="cinematic-hero" aria-label="FirePhenix TTT Server">
      <div class="hero-content">
        <div class="hero-copy">
          <p class="eyebrow">Trouble in Terrorist Town</p>
          <h2>FirePhenix TTT</h2>
          <p class="hero-lead">
            Düstere Karten, scharfe Verdächtigungen und schnelle Runden mit klassischem
            TTT-Gefühl. Rein in den Server, Rolle ziehen, niemandem trauen.
          </p>

          <div class="hero-meta">
            <span>
              <font-awesome-icon :icon="['fas', 'map']" />
              Handverlesene Maps
            </span>
            <span>
              <font-awesome-icon :icon="['fas', 'trophy']" />
              TTT Achievements
            </span>
            <span>
              <font-awesome-icon :icon="['fas', 'shield-alt']" />
              Private Runden
            </span>
          </div>

          <div class="server-actions">
            <a :href="connectUrl" class="join-server-link">
              <BaseButton class="join-server-btn">
                <font-awesome-icon :icon="['fas', 'play']" />
                <span>Spiele Jetzt</span>
              </BaseButton>
            </a>
            <button class="refresh-button" :disabled="loading" @click="fetchStatus">
              <font-awesome-icon :icon="['fas', 'sync']" :class="{ spinning: loading }" />
              <span>Aktualisieren</span>
            </button>
          </div>
        </div>

        <section class="status-panel" aria-label="TTT Server Status">
          <div class="status-header">
            <div>
              <p class="status-label">Live Status</p>
              <h3>{{ statusTitle }}</h3>
            </div>
            <span class="status-pill" :class="statusClass">{{ statusLabel }}</span>
          </div>

          <div v-if="errorMessage" class="status-error">
            {{ errorMessage }}
          </div>

          <div class="status-grid">
            <div class="status-metric highlight-metric">
              <font-awesome-icon :icon="['fas', 'users']" />
              <span>Spieler</span>
              <strong>{{ playerCount }}</strong>
            </div>
            <div class="status-metric">
              <font-awesome-icon :icon="['fas', 'map']" />
              <span>Karte</span>
              <strong>{{ statusData?.current_map || statusData?.map || 'Unbekannt' }}</strong>
            </div>
            <div class="status-metric">
              <font-awesome-icon :icon="['fas', 'signal']" />
              <span>Latenz</span>
              <strong>{{ latencyLabel }}</strong>
            </div>
            <div class="status-metric">
              <font-awesome-icon :icon="['fas', 'lock']" />
              <span>Zugang</span>
              <strong>{{ visibilityLabel }}</strong>
            </div>
          </div>

          <div class="connection-row">
            <div>
              <span>Adresse</span>
              <strong>{{ serverAddress }}</strong>
            </div>
            <div class="password-display" @click="togglePassword">
              <span>Passwort</span>
              <strong class="password-text">{{ passwordDisplay }}</strong>
              <small v-if="passwordCopied">Kopiert</small>
            </div>
          </div>

          <p class="last-updated">{{ lastUpdatedLabel }}</p>
        </section>
      </div>
    </section>

    <div class="feature-grid">
      <article v-for="feature in features" :key="feature.title" class="feature-card">
        <img
          :src="feature.image"
          :alt="feature.title"
          class="feature-image"
          :class="{ 'feature-image-contain': feature.imageFit === 'contain' }"
        />
        <div class="feature-text">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </article>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import BaseSection from '../base/BaseSection.vue';
import BaseButton from '../base/BaseButton.vue';

interface TttStatus {
  ok?: boolean;
  status?: 'online' | 'offline' | 'unknown' | string;
  name?: string;
  map?: string;
  current_map?: string;
  players?: {
    current?: number;
    max?: number;
    bots?: number;
  };
  current_players?: number;
  max_players?: number;
  bots?: number;
  visibility?: string;
  latency_ms?: number;
  error?: string;
}

const STATUS_REFRESH_MS = 30000;
const serverAddress = 'firephenix.de';
const connectUrl = 'steam://connect/firephenix.de:27015/ember';

const features = [
  {
    title: 'Handverlesene Karten',
    description: 'Eine kuratierte Auswahl an TTT-Karten mit Nostalgie, Übersicht und gutem Spielfluss.',
    image: new URL('../../assets/images/games/ttt_tokyo.jpeg', import.meta.url).href,
  },
  {
    title: 'Angepasste Addons',
    description: 'Gameplay-Verbesserungen, die TTT moderner machen, ohne den klassischen Kern zu verlieren.',
    image: new URL('../../assets/images/games/detective.png', import.meta.url).href,
    imageFit: 'contain',
  },
  {
    title: 'Skin Shop',
    description: 'Sammle Punkte durch Spielzeit, Runden und Siege und löse sie für TTT Skins ein.',
    image: new URL('../../assets/images/games/ttt_rewards/season-1/banner.png', import.meta.url).href,
  },
  {
    title: 'Waffen Balancing',
    description: 'Abgestimmte Waffen, bessere Hitboxen und faire Runden für regelmäßige Spieler.',
    image: new URL('../../assets/images/games/phoenix-agent.png', import.meta.url).href,
    imageFit: 'contain',
  },
];

const statusData = ref<TttStatus | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const lastUpdated = ref<Date | null>(null);
const showPassword = ref(false);
const passwordCopied = ref(false);
let refreshTimer: number | undefined;

const statusClass = computed(() => {
  if (loading.value && !statusData.value) return 'loading';
  return statusData.value?.status || 'unknown';
});

const statusLabel = computed(() => {
  if (loading.value && !statusData.value) return 'Lädt';
  if (statusData.value?.status === 'online') return 'Online';
  if (statusData.value?.status === 'offline') return 'Offline';
  return 'Unbekannt';
});

const statusTitle = computed(() => {
  return statusData.value?.name || serverAddress;
});

const playerCount = computed(() => {
  const current = statusData.value?.players?.current ?? statusData.value?.current_players;
  const max = statusData.value?.players?.max ?? statusData.value?.max_players;
  if (current === undefined || max === undefined) return 'Keine Daten';
  return `${current}/${max}`;
});

const latencyLabel = computed(() => {
  if (statusData.value?.latency_ms === undefined) return 'Keine Daten';
  return `${statusData.value.latency_ms} ms`;
});

const visibilityLabel = computed(() => {
  if (statusData.value?.visibility === 'private') return 'Passwort';
  if (statusData.value?.visibility === 'public') return 'Öffentlich';
  return 'Passwort';
});

const passwordDisplay = computed(() => {
  return showPassword.value ? 'ember' : '*****';
});

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return 'Noch nicht aktualisiert';
  return `Zuletzt aktualisiert: ${lastUpdated.value.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`;
});

const fetchStatus = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/api/gameservers/ttt/status');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json() as TttStatus;
    statusData.value = data;
    if (data.status === 'offline') {
      errorMessage.value = 'Der Server antwortet aktuell nicht auf die direkte Statusabfrage.';
    } else if (data.status === 'unknown') {
      errorMessage.value = 'Der Status konnte nicht eindeutig gelesen werden.';
    }
    lastUpdated.value = new Date();
  } catch {
    statusData.value = {
      status: 'unknown',
    };
    errorMessage.value = 'Status konnte nicht geladen werden.';
  } finally {
    loading.value = false;
  }
};

const togglePassword = async () => {
  showPassword.value = !showPassword.value;

  if (showPassword.value) {
    try {
      await navigator.clipboard.writeText('ember');
      passwordCopied.value = true;
      window.setTimeout(() => {
        passwordCopied.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy password to clipboard:', err);
    }
  }
};

onMounted(() => {
  fetchStatus();
  refreshTimer = window.setInterval(fetchStatus, STATUS_REFRESH_MS);
});

onUnmounted(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
});
</script>

<style scoped>
.ttt-server-section {
  padding-top: 1.5rem;
}

.cinematic-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: min(76vh, 760px);
  display: flex;
  align-items: stretch;
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  background: #080809;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(0, 0, 0, 0.55);
}

.cinematic-hero::before {
  content: '';
  position: absolute;
  inset: -4px;
  z-index: -2;
  background: url('../../assets/images/games/ttt_rooftop.jpeg') center/cover no-repeat;
  transform: scale(1.01);
  transform-origin: center;
  pointer-events: none;
}

.cinematic-hero::after {
  content: '';
  position: absolute;
  inset: -4px;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(7, 7, 8, 0.98) 0%, rgba(11, 11, 13, 0.78) 43%, rgba(11, 11, 13, 0.34) 100%),
    linear-gradient(0deg, rgba(18, 18, 18, 0.98) 0%, rgba(18, 18, 18, 0.14) 42%, rgba(18, 18, 18, 0.08) 100%),
    radial-gradient(ellipse at 72% 38%, rgba(249, 133, 0, 0.24), transparent 34%),
    linear-gradient(115deg, rgba(249, 133, 0, 0.12), transparent 36%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 480px);
  gap: 2rem;
  align-items: end;
  padding: clamp(1.25rem, 4vw, 4rem);
}

.hero-copy {
  max-width: 760px;
  padding-bottom: 1rem;
}

.eyebrow {
  color: var(--clr-primary-light);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  margin: 0 0 0.75rem;
}

.hero-copy h2 {
  color: var(--clr-text-primary);
  font-size: clamp(3rem, 8vw, 6.8rem);
  line-height: 0.9;
  margin: 0 0 1rem;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.75);
}

.hero-lead {
  color: var(--clr-white-light);
  max-width: 660px;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.65;
  margin: 0;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.7);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.5rem;
}

.hero-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 34px;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(255, 170, 75, 0.32);
  border-radius: 999px;
  color: var(--clr-text-primary);
  background: rgba(18, 18, 18, 0.42);
  backdrop-filter: blur(10px);
}

.hero-meta svg {
  color: var(--clr-primary-light);
}

.server-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.join-server-link {
  text-decoration: none;
}

.join-server-btn,
.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 46px;
}

.join-server-btn {
  box-shadow: 0 0 28px rgba(249, 133, 0, 0.32);
}

.refresh-button {
  border: 1px solid rgba(255, 170, 75, 0.34);
  border-radius: 8px;
  background: rgba(18, 18, 18, 0.48);
  color: var(--clr-text-primary);
  padding: 0 1rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: var(--clr-primary-transparent);
  transform: translateY(-2px);
}

.refresh-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-panel {
  align-self: end;
  background: rgba(18, 18, 18, 0.72);
  border: 1px solid rgba(255, 170, 75, 0.26);
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 18px 54px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(16px);
}

.status-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 170, 75, 0.18);
  padding-bottom: 1rem;
}

.status-label {
  color: var(--clr-text-secondary);
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
}

.status-header h3 {
  color: var(--clr-text-primary);
  margin: 0;
  font-size: 1.25rem;
}

.status-pill {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid var(--clr-border);
  color: var(--clr-text-secondary);
  background: var(--clr-transparent-light);
}

.status-pill.online {
  color: #88ff9b;
  border-color: rgba(136, 255, 155, 0.35);
  background: rgba(30, 126, 52, 0.2);
}

.status-pill.offline,
.status-pill.unknown {
  color: #ff9b8e;
  border-color: rgba(255, 69, 0, 0.35);
  background: rgba(255, 69, 0, 0.12);
}

.status-error {
  color: var(--clr-primary-light);
  background: rgba(249, 133, 0, 0.16);
  border: 1px solid rgba(255, 170, 75, 0.28);
  border-radius: 8px;
  padding: 0.8rem;
  margin-top: 1rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.status-metric {
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.9rem;
}

.highlight-metric {
  background: rgba(249, 133, 0, 0.15);
  border-color: rgba(255, 170, 75, 0.26);
}

.status-metric svg {
  color: var(--clr-primary-light);
}

.status-metric span,
.connection-row span {
  color: var(--clr-text-secondary);
  font-size: 0.82rem;
}

.status-metric strong,
.connection-row strong {
  color: var(--clr-text-primary);
  font-size: 1rem;
  overflow-wrap: anywhere;
}

.connection-row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.connection-row > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.9rem;
}

.password-display {
  cursor: pointer;
  user-select: none;
}

.password-text {
  color: var(--clr-primary-light);
  font-family: monospace;
  letter-spacing: 0.08em;
}

.password-display small {
  color: var(--clr-primary-light);
}

.last-updated {
  color: var(--clr-text-secondary);
  margin: 0.9rem 0 0;
  font-size: 0.85rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  overflow: hidden;
}

.feature-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.feature-image-contain {
  box-sizing: border-box;
  object-fit: contain;
  padding: 0.75rem;
  background:
    radial-gradient(circle at 50% 42%, rgba(249, 133, 0, 0.16), transparent 42%),
    var(--clr-surface-2);
}

.feature-text {
  padding: 1rem;
}

.feature-text h3 {
  color: var(--clr-primary-light);
  font-size: 1.05rem;
  margin: 0 0 0.55rem;
}

.feature-text p {
  color: var(--clr-text-secondary);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1100px) {
  .hero-content {
    grid-template-columns: 1fr;
    align-items: end;
  }

  .status-panel {
    max-width: 620px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .cinematic-hero {
    min-height: auto;
  }

  .hero-content {
    padding: 1rem;
  }

  .hero-copy h2 {
    font-size: 3rem;
  }

  .hero-meta,
  .server-actions {
    width: 100%;
  }

  .status-grid,
  .connection-row,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .join-server-link,
  .join-server-btn,
  .refresh-button {
    width: 100%;
  }
}
</style>
