<!-- components/profile/ChannelCreation.vue -->
<template>
    <div class="verification-container">
      <base-box>
        <h2 class="verification-title">Move Shield</h2>
        <p class="verification-subtext">
          Aktiviere ein Move Shield damit andere Mitglieder dich nicht bewegen können.
        </p>
        <div class="platform-sections">
          <!-- Level Lock Section -->
          <base-box
            v-if="(userData?.level ?? 0) < 5"
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
                  src="/src/assets/images/level/5.png"
                  alt="Lock"
                  class="lock-icon"
                />
                <p class="hint-text">
                  Du musst Level 5 erreichen um das Move Shield zu aktivieren.
                </p>
              </div>
            </div>
          </base-box>
  
          <!-- Channel Creation Sections -->
          <template v-else>
            <!-- Discord Channel -->
            <base-box elevated hoverable class="platform-section discord-section">
              <div class="platform-header">
                <i class="fab fa-discord platform-icon"></i>
                <h3>Discord Shield<span class="experimental-tag">Experimental</span></h3>
              </div>
              <div class="platform-content">
                <div
                  v-if="!userData?.discord_id"
                  class="channel-warning"
                >
                  <font-awesome-icon :icon="faCheckCircle" />
                  Verbinde zuerst dein Discord Account!
                </div>
                <div v-else-if="userData?.discord_moveable" class="button-container">
                    <base-button
                    variant="primary"
                    glow
                    @click="createChannel('discord', 'activate')"
                    :full-width="true"
                    >
                    Move Shield aktivieren
                  </base-button>
                </div>
                <div v-else class="button-container">
                  <base-button
                    variant="primary-light"
                    glow
                    @click="createChannel('discord', 'deactivate')"
                    :full-width="true"
                  >
                    Move Shield deaktivieren
                  </base-button>
                </div>
              </div>
            </base-box>
  
            <!-- TeamSpeak Channel -->
            <base-box elevated hoverable class="platform-section teamspeak-section">
              <div class="platform-header">
                <i class="fab fa-teamspeak platform-icon"></i>
                <h3>TeamSpeak Shield</h3>
              </div>
              <div class="platform-content">
                <div
                  v-if="!userData?.teamspeak_id"
                  class="channel-warning"
                >
                  <font-awesome-icon :icon="faCheckCircle" />
                  Verbinde zuerst dein TeamSpeak Account!
                </div>
                <div v-else-if="userData?.teamspeak_moveable" class="button-container">
                    <base-button
                    variant="primary"
                    glow
                    @click="createChannel('teamspeak', 'activate')"
                    :full-width="true"
                    >
                    Move Shield aktivieren
                  </base-button>
                </div>
                <div v-else class="button-container">
                  <base-button
                    variant="primary-light"
                    glow
                    @click="createChannel('teamspeak', 'deactivate')"
                    :full-width="true"
                  >
                    Move Shield deaktivieren
                  </base-button>
                </div>
              </div>
            </base-box>
          </template>
        </div>
      </base-box>
  
      <base-modal v-model="showSetModal">
        <template #title>
          Move Shield {{ loading ? 'wird bearbeitet' : (operationSuccess ? 'Erfolg' : 'Fehler') }}
        </template>
  
        <div class="creation-modal-content">
          <div v-if="loading" class="loading-message">
            <div class="spinner"></div>
            <p>Dein Move Shield wird {{ operationType === 'activate' ? 'aktiviert' : 'deaktiviert' }}...</p>
          </div>
          <div v-else-if="operationSuccess" class="success-message">
            <font-awesome-icon :icon="faCheckCircle" />
            <p v-if="operationType === 'activate'">
              Dein Move Shield wurde erfolgreich aktiviert.
            </p>
            <p v-else>
              Dein Move Shield wurde erfolgreich deaktiviert.
            </p>
          </div>
          <div v-else class="error-message">
            <font-awesome-icon :icon="faExclamationCircle" />
            <p>
              Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.
            </p>
          </div>
        </div>
  
        <template #footer>
          <base-button v-if="!loading" variant="secondary" @click="closeModal">
            Ok
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
    faCheckCircle,
    faExclamationCircle 
  } from '@fortawesome/free-solid-svg-icons';
  
  interface Props {
    userData: UserProfile | null;
  }
  
  const { userData } = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'channel-created'): void;
    (e: 'reload-data'): void;
  }>();
  
  const showSetModal = ref(false);
  const currentPlatform = ref<'discord' | 'teamspeak' | null>(null);
  const operationType = ref<'activate' | 'deactivate'>('activate');
  const operationSuccess = ref(true);
  const loading = ref(false);
  
  const createChannel = async (
    platform: 'discord' | 'teamspeak', 
    operation: 'activate' | 'deactivate'
  ) => {
    currentPlatform.value = platform;
    operationType.value = operation;
    loading.value = true;
    showSetModal.value = true;
    
    try {
      const response = await fetch('/api/user/profile/moveshield', {
        method: operation === 'activate' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
  
      operationSuccess.value = response.ok;
      
      if (response.ok) {
        emit('channel-created');
        emit('reload-data'); // Emit to reload user data
      }
    } catch (error) {
      console.error('Shield operation failed:', error);
      operationSuccess.value = false;
    } finally {
      loading.value = false;
    }
  };
  
  const closeModal = () => {
    showSetModal.value = false;
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

    & > svg {
      font-size: 1.5rem;
      margin-right: 0.5rem; 
    }
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
    position: relative;
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
  
  .success-message, .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem;
  }
  
  .success-message i, .success-message svg {
    color: #4caf50;
    font-size: 2.5rem; /* Increased size */
    margin-bottom: 1rem;
  }
  
  .error-message i {
    color: #f44336;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .experimental-tag {
    position: relative;
    display: inline-block;
    background-color: var(--clr-experimental);
    color: white;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 0.65rem;
    font-weight: 600;
    margin-left: 8px;
    transform: translateY(-8px);
  }
  </style>
