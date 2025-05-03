<template>
  <div class="skin-unlocker-container">
    <h2>TTT Skins - Season I</h2>
    <div class="skins-grid">
      <div v-for="(skin, index) in skins" :key="index" class="skin-card" 
        @mousemove="handleCardMouseMove($event, index)"
        @mouseleave="resetCardTransform(index)"
        :style="cardTransforms[index]"
      >
        <div class="skin-image-container">
          <img :src="skin.image" :alt="skin.name" class="skin-image" />
        </div>
        <BaseButton
          v-if="!seasonUnlockData[skin.requiredDivision as keyof typeof seasonUnlockData]"
          variant="primary"
          @click="openUnlockModal(index + 1)"
          :disabled="(bestDivision < skin.requiredDivision)"
        >
          Freischalten
        </BaseButton>
        <BaseButton
          v-else
          variant="secondary"
          :disabled="true"
        >
        Freigeschaltet
        </BaseButton>  
      </div>
    </div>
  </div>

  <!-- Unlock Modal -->
  <base-modal v-model="showUnlockModal">
    <template #title>
      Skin Freischalten
    </template>

    <div class="unlock-modal-content">
      <div v-if="loading" class="loading-message">
        <div class="spinner"></div>
        <p>Dein Skin wird freigeschaltet...</p>
      </div>
      <div v-else>
        <p>
          Möchtest du wirklich diesen Skin freischalten?
        </p>
        <p class="info-text">
          <font-awesome-icon :icon="faInfoCircle" />
          Du solltest bereits einmal auf dem TTT Server gespielt haben um den Skin erfolgreich abzuholen.
        </p>
      </div>
    </div>

    <template #footer>
      <base-button v-if="!loading" variant="secondary" @click="closeModal">
        Abbrechen
      </base-button>
      <base-button v-if="!loading" variant="primary" glow @click="confirmUnlock">
        Freischalten
      </base-button>
    </template>
  </base-modal>

  <!-- Error Modal -->
  <base-modal v-model="showErrorModal">
    <template #title>
      Fehler beim Freischalten
    </template>

    <div class="error-modal-content">
      <div class="error-icon">
        <font-awesome-icon :icon="faExclamationTriangle" />
      </div>
      <p>{{ errorMessage }}</p>
    </div>

    <template #footer>
      <base-button variant="primary" @click="closeErrorModal">
        Verstanden
      </base-button>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import tttSilver from '../../assets/images/games/ttt_reward_silver.png';
import tttGold from '../../assets/images/games/ttt_reward_gold.png';
import tttPlatinum from '../../assets/images/games/ttt_reward_platinum.png';
import tttDiamond from '../../assets/images/games/ttt_reward_diamond.png';
import tttPhoenix from '../../assets/images/games/ttt_reward_phoenix.png';

defineProps({
  bestDivision: {
    type: Number,
    required: true,
  },
  seasonUnlockData: {
    type: Object as () => {
      2: boolean;
      3: boolean;
      4: boolean;
      5: boolean;
      6: boolean;
    },
    required: true,
    default: () => ({
      2: false,
      3: false,
      4: false,
      5: false,
      6: false
    })
  }
});

const skins = [
  { name: 'Silber Skin', image: tttSilver, requiredDivision: 2 },
  { name: 'Gold Skin', image: tttGold, requiredDivision: 3 },
  { name: 'Platin Skin', image: tttPlatinum, requiredDivision: 4 },
  { name: 'Diamant Skin', image: tttDiamond, requiredDivision: 5 },
  { name: 'Phönix Skin', image: tttPhoenix, requiredDivision: 6 },
];

const showUnlockModal = ref(false);
const loading = ref(false);
const currentSkinId = ref<number | null>(null);
const showErrorModal = ref(false);
const errorMessage = ref('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');

const cardTransforms = reactive<{ [key: number]: any }>({});

function handleCardMouseMove(e: MouseEvent, idx: number) {
  const card = (e.currentTarget as HTMLElement);
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * 8; // max 8deg
  const rotateY = ((x - centerX) / centerX) * -8;
  cardTransforms[idx] = {
    '--rotate-x': `${rotateX}deg`,
    '--rotate-y': `${rotateY}deg`,
    'zIndex': 2
  };
}

function resetCardTransform(idx: number) {
  cardTransforms[idx] = {
    '--rotate-x': '0deg',
    '--rotate-y': '0deg',
    'zIndex': 1
  };
}

const openUnlockModal = (skinId: number) => {
  currentSkinId.value = skinId;
  showUnlockModal.value = true;
};

const closeModal = () => {
  showUnlockModal.value = false;
  currentSkinId.value = null;
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const confirmUnlock = async () => {
  if (currentSkinId.value === null) return;
  
  loading.value = true;
  try {
    const response = await fetch('/api/user/profile/skins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        platform: 'garrysmod', 
        tier: currentSkinId.value + 1 
      }),
    });

    if (response.ok) {
      // Handle success
      console.log(`Successfully unlocked skin ${currentSkinId.value + 1}`);
    } else {
      // Parse error response
      const errorData = await response.json().catch(() => null);
      errorMessage.value = errorData?.message || 'Fehler beim Freischalten des Skins. Bitte versuche es später erneut.';
      showErrorModal.value = true;
      console.error('Failed to unlock skin:', errorData);
    }
  } catch (error) {
    console.error('Skin unlock failed:', error);
    errorMessage.value = 'Ein Netzwerkfehler ist aufgetreten. Bitte überprüfe deine Internetverbindung.';
    showErrorModal.value = true;
  } finally {
    loading.value = false;
    closeModal();
  }
};
</script>

<style scoped>
.skin-unlocker-container {
  padding: 2.5rem; 
  background: linear-gradient(145deg, var(--clr-surface-elevated-1), var(--clr-surface-elevated-2)); 
  border: 1px solid var(--clr-border-subtle); 
  border-radius: 12px; 
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); 
}

.skin-unlocker-container h2 {
  color: var(--clr-text-primary);
  font-size: 1.8rem; 
  margin-bottom: 2.5rem; 
  font-weight: 600; 
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem; 
  justify-items: center;
}

.skin-card {
  background: var(--clr-surface);
  border-radius: 10px; 
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem; 
  transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1), filter 0.18s cubic-bezier(.4,2,.6,1);
  transform: perspective(700px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
  filter: drop-shadow(0 0 8px rgba(255, 200, 80, 0.08));
  position: relative;
  box-shadow: 0 0 0 0 rgba(255, 200, 80, 0.12), 0 2px 16px 0 rgba(0,0,0,0.10), 0 0 16px 2px rgba(255, 200, 80, 0.08);
}

.skin-card:hover {
  box-shadow: 0 0 0 4px rgba(255, 200, 80, 0.18), 0 8px 32px 0 rgba(0,0,0,0.18), 0 0 32px 8px rgba(255, 200, 80, 0.18);
  filter: drop-shadow(0 0 16px rgba(255, 200, 80, 0.18));
  animation: bling 0.7s cubic-bezier(.4,2,.6,1);
}

@keyframes bling {
  0% { filter: brightness(1) drop-shadow(0 0 8px #ffe066); }
  30% { filter: brightness(1.15) drop-shadow(0 0 24px #ffe066); }
  60% { filter: brightness(1.05) drop-shadow(0 0 12px #ffe066); }
  100% { filter: brightness(1) drop-shadow(0 0 8px #ffe066); }
}

.skin-image-container {
  width: 100%;
  max-width: 10vh;
  max-height: 28vh;
  background-color: var(--clr-surface-elevated-2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  overflow: hidden;
  border: 1px solid var(--clr-border-subtle);
}

.skin-image {
  display: block;
  width: 100%; 
  height: 100%;
  object-fit: fill;
}

.skin-card .base-button {
  width: 100%;
  margin-top: auto;
  padding: 0.8rem 1.5rem; 
  font-size: 0.95rem; 
}

.skin-card .base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5; 
  background-color: var(--clr-button-secondary-bg); 
  color: var(--clr-text-disabled);
}

/* Modal styles */
.unlock-modal-content {
  text-align: center;
  padding: 1rem 0;
}

.info-text {
  margin-top: 1rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--clr-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error modal styles */
.error-modal-content {
  text-align: center;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 2rem;
  color: #e74c3c;
  margin-bottom: 0.5rem;
}
</style>