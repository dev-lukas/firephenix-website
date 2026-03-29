<template>
  <div class="skin-showcase">
    <!-- Hero banner -->
    <div class="hero-banner">
      <img :src="heroBg" alt="" class="hero-bg" />
      <div class="hero-overlay">
        <h2 class="hero-title">Season I</h2>
        <p class="hero-sub">TTT Rüstungen</p>
      </div>
    </div>

    <!-- Skin cards -->
    <div class="skins-row">
      <div
        v-for="(skin, index) in skins"
        :key="index"
        class="skin-card"
        :class="{
          locked: bestDivision < skin.requiredDivision,
          claimable: bestDivision >= skin.requiredDivision && !isUnlocked(skin.requiredDivision),
          claimed: isUnlocked(skin.requiredDivision)
        }"
        :style="{
          '--card-color': skin.color,
          '--delay': (index * 100) + 'ms'
        }"
        @mousemove="handleTilt($event, index)"
        @mouseleave="resetTilt(index)"
      >
        <div class="card-inner" :style="tiltStyles[index]">
          <!-- Division badge corner -->
          <div class="division-badge">
            <img :src="skin.badgeImage" :alt="skin.divisionName" class="badge-img" />
          </div>

          <!-- Skin image -->
          <div class="skin-visual">
            <img :src="skin.image" :alt="skin.name" class="skin-img" />
            <div v-if="bestDivision < skin.requiredDivision" class="locked-overlay">
              <font-awesome-icon :icon="['fas', 'lock']" class="lock-icon" />
              <span class="lock-text">{{ skin.divisionName }} benötigt</span>
            </div>
          </div>

          <!-- Info -->
          <div class="skin-info">
            <span class="skin-name">{{ skin.name }}</span>
            <span class="skin-division">{{ skin.divisionName }}</span>
          </div>

          <!-- Action -->
          <div class="skin-action">
            <button
              v-if="isUnlocked(skin.requiredDivision)"
              class="btn-claimed"
              disabled
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" />
              Freigeschaltet
            </button>
            <button
              v-else-if="bestDivision >= skin.requiredDivision"
              class="btn-claim"
              @click="openUnlockModal(index + 1)"
            >
              Freischalten
            </button>
            <div v-else class="locked-label">
              <font-awesome-icon :icon="['fas', 'lock']" />
              Gesperrt
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Unlock confirmation modal -->
  <base-modal v-model="showUnlockModal">
    <template #title>Skin Freischalten</template>
    <div class="modal-body">
      <div v-if="loading" class="modal-loading">
        <div class="spinner"></div>
        <p>Dein Skin wird freigeschaltet...</p>
      </div>
      <div v-else>
        <p>Möchtest du wirklich diesen Skin freischalten?</p>
        <p class="modal-info">
          <font-awesome-icon :icon="faInfoCircle" />
          Du solltest bereits einmal auf dem TTT Server gespielt haben um den Skin erfolgreich abzuholen.
        </p>
      </div>
    </div>
    <template #footer>
      <base-button v-if="!loading" variant="secondary" @click="closeModal">Abbrechen</base-button>
      <base-button v-if="!loading" variant="primary" glow @click="confirmUnlock">Freischalten</base-button>
    </template>
  </base-modal>

  <!-- Error modal -->
  <base-modal v-model="showErrorModal">
    <template #title>Fehler beim Freischalten</template>
    <div class="modal-body modal-error">
      <font-awesome-icon :icon="faExclamationTriangle" class="error-icon" />
      <p>{{ errorMessage }}</p>
    </div>
    <template #footer>
      <base-button variant="primary" @click="showErrorModal = false">Verstanden</base-button>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import tttSilver from '../../assets/images/games/ttt_reward_silver.png';
import tttGold from '../../assets/images/games/ttt_reward_gold.png';
import tttPlatinum from '../../assets/images/games/ttt_reward_platinum.png';
import tttDiamond from '../../assets/images/games/ttt_reward_diamond.png';
import tttPhoenix from '../../assets/images/games/ttt_reward_phoenix.png';

const heroBg = computed(() => new URL('../../assets/images/games/ttt_rewards.png', import.meta.url).href);

const props = defineProps({
  bestDivision: { type: Number, required: true },
  seasonUnlockData: {
    type: Object as () => { 2: boolean; 3: boolean; 4: boolean; 5: boolean; 6: boolean },
    required: true,
    default: () => ({ 2: false, 3: false, 4: false, 5: false, 6: false })
  }
});

const getBadge = (name: string) => new URL(`../../assets/images/ranks/${name}.png`, import.meta.url).href;

const skins = [
  { name: 'Silber Rüstung', image: tttSilver, requiredDivision: 2, divisionName: 'Silber', color: '#c0c0c0', badgeImage: getBadge('silver') },
  { name: 'Gold Rüstung', image: tttGold, requiredDivision: 3, divisionName: 'Gold', color: '#ffd700', badgeImage: getBadge('gold') },
  { name: 'Platin Rüstung', image: tttPlatinum, requiredDivision: 4, divisionName: 'Platin', color: '#e5e4e2', badgeImage: getBadge('platinum') },
  { name: 'Diamant Rüstung', image: tttDiamond, requiredDivision: 5, divisionName: 'Diamant', color: '#b9f2ff', badgeImage: getBadge('diamond') },
  { name: 'Phönix Rüstung', image: tttPhoenix, requiredDivision: 6, divisionName: 'Phönix', color: '#ff4500', badgeImage: getBadge('phoenix') },
];

const isUnlocked = (div: number) => props.seasonUnlockData?.[div as keyof typeof props.seasonUnlockData] ?? false;

// 3D tilt
const tiltStyles = reactive<Record<number, Record<string, string>>>({});

function handleTilt(e: MouseEvent, idx: number) {
  const el = (e.currentTarget as HTMLElement);
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  tiltStyles[idx] = {
    transform: `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.02)`,
  };
}

function resetTilt(idx: number) {
  tiltStyles[idx] = { transform: 'perspective(800px) rotateX(0) rotateY(0) scale(1)' };
}

// Unlock logic (kept from original)
const showUnlockModal = ref(false);
const loading = ref(false);
const currentSkinId = ref<number | null>(null);
const showErrorModal = ref(false);
const errorMessage = ref('Ein Fehler ist aufgetreten.');

const openUnlockModal = (skinId: number) => {
  currentSkinId.value = skinId;
  showUnlockModal.value = true;
};

const closeModal = () => {
  showUnlockModal.value = false;
  currentSkinId.value = null;
};

const confirmUnlock = async () => {
  if (currentSkinId.value === null) return;
  loading.value = true;
  try {
    const response = await fetch('/api/user/profile/skins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: 'garrysmod', tier: currentSkinId.value + 1 }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      errorMessage.value = errorData?.message || 'Fehler beim Freischalten. Bitte versuche es später erneut.';
      showErrorModal.value = true;
    }
  } catch {
    errorMessage.value = 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.';
    showErrorModal.value = true;
  } finally {
    loading.value = false;
    closeModal();
  }
};
</script>

<style scoped>
.skin-showcase {
  position: relative;
  z-index: 1;
}

/* ── Hero Banner ── */
.hero-banner {
  position: relative;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  filter: blur(2px) brightness(0.35);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
  letter-spacing: 2px;
}

.hero-sub {
  font-size: 1rem;
  color: var(--clr-primary-light);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  margin-top: 0.3rem;
}

/* ── Skin Cards Row ── */
.skins-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

.skin-card {
  opacity: 0;
  transform: translateY(20px);
  animation: card-up 0.5s var(--transition-smooth) var(--delay) forwards;
}

@keyframes card-up {
  to { opacity: 1; transform: translateY(0); }
}

.card-inner {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 14px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  height: 100%;
}

.skin-card:hover .card-inner {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3),
              0 0 20px -5px var(--card-color, transparent);
  border-color: color-mix(in srgb, var(--card-color, transparent) 30%, transparent);
}

/* ── Division Badge ── */
.division-badge {
  position: absolute;
  top: -12px;
  right: -8px;
  width: 40px;
  height: 40px;
  z-index: 2;
}

.badge-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
}

.locked .badge-img {
  filter: grayscale(100%) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  opacity: 0.4;
}

/* ── Skin Visual ── */
.skin-visual {
  width: 100%;
  height: 200px;
  background: var(--clr-surface-2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--clr-border);
}

.skin-img {
  height: 90%;
  width: auto;
  object-fit: contain;
  transition: transform 0.4s var(--transition-smooth), filter 0.4s ease;
}

.skin-card:hover:not(.locked) .skin-img {
  transform: scale(1.05);
}

.locked .skin-img {
  filter: grayscale(100%) brightness(0.4);
}

.locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 10px;
}

.lock-icon {
  font-size: 1.5rem;
  color: var(--clr-text-secondary);
}

.lock-text {
  font-size: 0.75rem;
  color: var(--clr-text-secondary);
  font-weight: 500;
}

/* ── Skin Info ── */
.skin-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.skin-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--clr-text-primary);
}

.skin-division {
  font-size: 0.78rem;
  color: var(--clr-text-secondary);
}

/* ── Actions ── */
.skin-action {
  width: 100%;
  margin-top: auto;
}

.btn-claim {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid var(--clr-border-strong);
  border-radius: 8px;
  background: var(--clr-primary-transparent);
  color: var(--clr-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-claim:hover {
  background: var(--clr-primary);
  color: var(--clr-background);
  box-shadow: 0 4px 15px var(--clr-primary-transparent-strong);
  transform: translateY(-1px);
}

.btn-claimed {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid var(--clr-added);
  border-radius: 8px;
  background: rgba(30, 126, 52, 0.15);
  color: var(--clr-added);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.locked-label {
  width: 100%;
  padding: 0.7rem 1rem;
  text-align: center;
  color: var(--clr-text-secondary);
  font-size: 0.85rem;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

/* ── Claimable glow pulse ── */
.claimable .card-inner {
  border-color: var(--clr-border-strong);
  animation: claim-pulse 3s ease-in-out infinite alternate;
}

@keyframes claim-pulse {
  0% { box-shadow: 0 0 0 0 var(--clr-primary-transparent); }
  100% { box-shadow: 0 0 20px -5px var(--clr-primary-transparent-strong); }
}

/* ── Modal ── */
.modal-body {
  text-align: center;
  padding: 1rem 0;
  color: var(--clr-text-primary);
}

.modal-info {
  margin-top: 1rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--clr-surface-3);
  border-radius: 50%;
  border-top-color: var(--clr-primary);
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.modal-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 2rem;
  color: var(--clr-error);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-banner {
    height: 150px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .skins-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .skin-visual {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .skins-row {
    grid-template-columns: 1fr;
  }
}
</style>
