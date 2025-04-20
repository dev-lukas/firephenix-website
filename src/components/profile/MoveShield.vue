<!-- components/profile/MoveShield.vue -->
<template>
    <div class="settings-section-container">
      <h2 class="section-title">Move Shield</h2>
      <p class="section-subtext">
        Aktiviere ein Move Shield damit andere Mitglieder dich nicht bewegen können.
      </p>
      <div class="settings-list">
        <!-- Level Lock Section -->
        <div
          v-if="(userData?.level ?? 0) < 2"
          class="setting-item locked-item"
        >
          <div class="locked-content">
            <font-awesome-icon :icon="faLock" class="lock-icon-indicator" />
            <div class="locked-text">
              <h3>Gesperrt bis Level 2</h3>
              <p>
                Du musst Level 2 erreichen um das Move Shield zu aktivieren.
              </p>
            </div>
            <img
              src="/src/assets/images/level/2.png"
              alt="Level 2"
              class="level-lock-icon"
            />
          </div>
        </div>

        <!-- Channel Creation Sections -->
        <template v-else>
          <!-- Discord Shield -->
          <div class="setting-item">
            <div class="item-info">
              <img src="/src/assets/images/other/discord.png" alt="Discord" class="platform-logo-small"/>
              <h3>Discord Shield <span class="experimental-tag">Experimental</span></h3>
              <p v-if="!userData?.discord_id" class="platform-warning">
                <font-awesome-icon :icon="faExclamationCircle" /> Verbinde zuerst dein Discord Account!
              </p>
            </div>
            <div class="item-control">
              <BaseSwitch
                :model-value="!userData?.discord_moveable"
                @update:model-value="toggleShield('discord', $event)"
                :disabled="!userData?.discord_id"
              />
            </div>
          </div>

          <!-- TeamSpeak Shield -->
          <div class="setting-item">
            <div class="item-info">
              <img src="/src/assets/images/other/teamspeak.png" alt="TeamSpeak" class="platform-logo-small"/>
              <h3>TeamSpeak Shield</h3>
              <p v-if="!userData?.teamspeak_id" class="platform-warning">
                <font-awesome-icon :icon="faExclamationCircle" /> Verbinde zuerst dein TeamSpeak Account!
              </p>
            </div>
            <div class="item-control">
              <BaseSwitch
                :model-value="!userData?.teamspeak_moveable"
                @update:model-value="toggleShield('teamspeak', $event)"
                :disabled="!userData?.teamspeak_id"
              />
            </div>
          </div>
        </template>
      </div>

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
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import BaseSwitch from '../base/BaseSwitch.vue';
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

const toggleShield = (platform: 'discord' | 'teamspeak', isActive: boolean) => {
  const operation = isActive ? 'activate' : 'deactivate';
  createChannel(platform, operation);
};

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
      emit('reload-data');
    } else {
      console.error('Shield operation failed, reloading data to revert switch.');
      emit('reload-data');
    }
  } catch (error) {
    console.error('Shield operation failed:', error);
    operationSuccess.value = false;
    emit('reload-data');
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showSetModal.value = false;
  currentPlatform.value = null;
  loading.value = false;
};
</script>

<style scoped>
.settings-section-container {
  width: 100%;
  margin-bottom: 3rem;
  color: var(--clr-text-primary);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--clr-border);
  color: var(--clr-text-primary);
}

.section-subtext {
  color: var(--clr-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--clr-surface-elevated-1);
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.setting-item:hover {
  background-color: var(--clr-surface-elevated-2);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-info h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: var(--clr-text-primary);
}

.item-info p {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
  margin: 0;
}

.platform-logo-small {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.platform-warning {
  color: var(--clr-warning) !important;
  font-size: 0.85rem !important;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.locked-item {
  background-color: var(--clr-surface);
  border-color: var(--clr-border);
  opacity: 0.7;
}

.locked-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.lock-icon-indicator {
  font-size: 1.5rem;
  color: var(--clr-text-secondary);
}

.locked-text h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  color: var(--clr-text-primary);
}

.locked-text p {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
}

.level-lock-icon {
  width: 40px;
  height: 40px;
  margin-left: auto;
}

.experimental-tag {
  display: inline-block;
  background-color: var(--clr-experimental);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  margin-left: 8px;
  vertical-align: middle;
}

/* Modal Content Styling */
.creation-modal-content {
  text-align: center; /* Center align all content */
  padding: 1rem 0; /* Add some padding */
}

.loading-message, .success-message, .error-message {
  display: flex;
  flex-direction: column; /* Stack icon and text vertically */
  align-items: center; /* Center items horizontally */
  gap: 1rem; /* Space between icon and text */
}

.success-message .svg-inline--fa, /* Target FontAwesome icon */
.error-message .svg-inline--fa {
  font-size: 3rem; /* Increase icon size */
}

.success-message {
  color: var(--clr-success);
}

.error-message {
  color: var(--clr-error);
}

.loading-message p,
.success-message p,
.error-message p {
  margin: 0; /* Remove default margins */
  font-size: 1rem;
  color: var(--clr-text-secondary);
}

.success-message p {
  color: var(--clr-text-primary); /* Make success text primary */
}

.spinner {
  border: 4px solid var(--clr-surface-elevated-2);
  border-top: 4px solid var(--clr-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem; /* Add space below spinner */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  .item-control {
    margin-left: auto;
    margin-top: 0.5rem;
  }
  .locked-content {
    gap: 1rem;
  }
  .level-lock-icon {
     width: 35px;
     height: 35px;
  }
}
</style>
