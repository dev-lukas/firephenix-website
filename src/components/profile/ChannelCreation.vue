<!-- components/profile/ChannelCreation.vue -->
<template>
  <div class="verification-container">
    <base-box>
      <h2 class="verification-title">Channel Erstellung</h2>
      <p class="verification-subtext">
        Erstelle deinen eigenen permanenten Voice Channel
      </p>
      <div class="platform-sections">
        <!-- Level Lock Section -->
        <base-box
          v-if="(userData?.level ?? 0) < 20"
          elevated
          hoverable
          class="platform-section locked-section"
        >
          <div class="platform-header">
            <font-awesome-icon :icon="faLock" class="platform-icon" />
            <h3>Gesperrt</h3>
          </div>
          <div class="platform-content">
            <div class="locked-message">
              <img
                src="/src/assets/images/level/20.png"
                alt="Lock"
                class="lock-icon"
              />
              <p class="hint-text">
                Du musst Level 20 erreichen um eigene permanenten Channel zu
                erstellen.
              </p>
            </div>
          </div>
        </base-box>

        <!-- Channel Creation Sections -->
        <template v-else>
          <!-- Discord Channel -->
          <base-box elevated hoverable class="platform-section discord-section">
            <div class="platform-header">
              <h3>Discord Channel</h3>
            </div>
            <div class="platform-content">
              <div
                v-if="!userData?.discord_id"
                class="channel-warning"
              >
                <i class="fas fa-check-circle"></i> Verbinde zuerst dein Discord
                Account!
              </div>
              <div v-else-if="userData?.discord_channel" class="channel-status">
                <i class="fas fa-check-circle"></i> Channel bereits erstellt
              </div>
              <div v-else class="button-container">
                <base-button
                  variant="primary"
                  glow
                  @click="createChannel('discord')"
                  :full-width="true"
                >
                  <i class="fas fa-plus"></i>
                  Channel erstellen
                </base-button>
              </div>
            </div>
          </base-box>

          <!-- TeamSpeak Channel -->
          <base-box
            elevated
            hoverable
            class="platform-section teamspeak-section"
          >
            <div class="platform-header">
              <h3>TeamSpeak Channel</h3>
            </div>
            <div class="platform-content">
              <div
                v-if="
                  !userData?.teamspeak_id
                "
                class="channel-warning"
              >
                <i class="fas fa-check-circle"></i> Verbinde zuerst dein
                TeamSpeak Account!
              </div>
              <div
                v-else-if="userData?.teamspeak_channel"
                class="channel-status"
              >
                <i class="fas fa-check-circle"></i> Channel bereits erstellt
              </div>
              <div v-else class="button-container">
                <base-button
                  variant="primary"
                  glow
                  @click="createChannel('teamspeak')"
                  :full-width="true"
                >
                  <i class="fas fa-plus"></i>
                  Channel erstellen
                </base-button>
              </div>
            </div>
          </base-box>
        </template>
      </div>
    </base-box>

    <base-modal v-model="showCreationModal">
      <template #title>
        {{ currentPlatform === 'discord' ? 'Discord' : 'TeamSpeak' }} Channel
        erstellen
      </template>

      <div class="creation-modal-content">
        <div v-if="loading" class="loading-message">
          <div class="spinner"></div>
          <p>Dein Channel wird erstellt...</p>
        </div>
        <div v-else>
          <p>
            Möchtest du wirklich einen permanenten
            {{ currentPlatform === 'discord' ? 'Discord' : 'TeamSpeak' }} Channel
            erstellen?
          </p>
          <p class="info-text">
            <font-awesome-icon :icon="faInfoCircle" />
            Der Channel wird automatisch mit deinem Account verknüpft.
          </p>
        </div>
      </div>

      <template #footer>
        <base-button v-if="!loading" variant="secondary" @click="closeModal">
          Abbrechen
        </base-button>
        <base-button v-if="!loading" variant="primary" glow @click="confirmChannelCreation">
          Erstellen
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UserProfile } from '../../types/user';
import BaseBox from '../base/BaseBox.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import { 
  faLock, 
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  userData: UserProfile | null;
}

const { userData } = defineProps<Props>();
const emit = defineEmits<{
  (e: 'channel-created'): void;
}>();

const showCreationModal = ref(false);
const currentPlatform = ref<'discord' | 'teamspeak' | null>(null);
const loading = ref(false);

const createChannel = (platform: 'discord' | 'teamspeak') => {
  currentPlatform.value = platform;
  showCreationModal.value = true;
};

const confirmChannelCreation = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/user/profile/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: currentPlatform.value }),
    });

    if (response.ok) {
      emit('channel-created');
      closeModal();
    }
  } catch (error) {
    console.error('Channel creation failed:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showCreationModal.value = false;
  currentPlatform.value = null;
};
</script>

<style scoped>
.locked-section {
  text-align: center;
  grid-column: 1 / -1;
  max-width: 600px;
  margin: 0 auto;
}

.lock-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.hint-text {
  color: var(--clr-text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1rem;
}

.channel-warning {
  color: var(--clr-text-secondary);
  font-weight: 500;
  padding: 1rem;
  text-align: center;
  border: 2px solid var(--clr-border);
  border-radius: 8px;
}

.channel-status {
  color: #4caf50;
  font-weight: 500;
  padding: 1rem;
  text-align: center;
  border: 2px solid var(--clr-border);
  border-radius: 8px;
}

.verification-container {
  width: 100%;
  margin: 3rem auto;
  color: var(--clr-text-primary);
}

.verification-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 0.8rem;
  padding-top: 1rem;
}

.verification-subtext {
  text-align: center;
  color: var(--clr-text-secondary);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 2rem;
}

.platform-sections {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 2rem;
  justify-items: center;
}

.platform-section {
  background: var(--clr-surface-elevated-1);
  border: 2px solid var(--clr-border);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: 0 2px 2px var(--clr-border);
  transition: all 0.3s ease;
}

.platform-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px var(--clr-border);
}

.platform-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.platform-icon {
  font-size: 1.8rem;
  color: var(--clr-primary);
}

.verify-button {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: var(--clr-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.verify-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(249, 133, 0, 0.2),
    transparent
  );
  transition: 0.5s;
}

.verify-button:hover:not(:disabled) .button-glow {
  left: 100%;
}

@media (max-width: 768px) {
  .platform-sections {
    grid-template-columns: 1fr;
  }

  .verification-box {
    padding: 2rem 1.5rem;
  }
}

.info-text {
  margin-top: 1rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.info-text i {
  color: var(--clr-primary);
  margin-right: 0.5rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--clr-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
