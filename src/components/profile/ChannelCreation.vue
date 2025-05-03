<!-- components/profile/ChannelCreation.vue -->
<template>
  <div class="settings-section-container">
    <h2 class="section-title">Channel Erstellung</h2>
    <p class="section-subtext">
      Erstelle deinen eigenen permanenten Voice Channel auf Discord oder TeamSpeak.
      Du musst Prestige I erreicht haben und den entsprechenden Account verknüpft haben.
    </p>

    <div class="settings-list">
      <!-- Level Lock Section -->
      <div
        v-if="(userData?.level ?? 0) < 21"
        class="setting-item locked-item"
      >
        <div class="item-info">
          <font-awesome-icon :icon="faLock" class="item-icon locked-icon" />
          <h3>Gesperrt</h3>
        </div>
        <div class="item-control locked-control">
          <img
            src="/src/assets/images/level/21.png"
            alt="Prestige I"
            class="level-lock-icon"
          />
          <p class="locked-message">
            Erreiche Prestige I um eigene permanente Channel zu erstellen.
          </p>
        </div>
      </div>

      <!-- Channel Creation Sections -->
      <template v-else>
        <!-- Discord Channel -->
        <div class="setting-item">
          <div class="item-info">
            <img src="/src/assets/images/other/discord.png" alt="Discord" class="platform-logo-small"/>
            <h3>Discord Channel</h3>
          </div>
          <div class="item-control">
            <div v-if="!userData?.discord_id" class="channel-warning">
              <font-awesome-icon :icon="faExclamationTriangle" /> Account nicht verbunden
            </div>
            <div v-else-if="userData?.discord_channel" class="channel-status">
              <font-awesome-icon :icon="faCheckCircle" /> Channel erstellt
              <BaseButton
                v-if="userData?.apex_rank || userData?.apex_division"
                variant="primary"
                size="small"
                @click="upgradeChannel('discord')"
                class="upgrade-button"
                :disabled="userData?.discord_upgraded"
              >
                <font-awesome-icon :icon="faStar" /> Apex Upgrade
              </BaseButton>
              <BaseButton
                v-else
                variant="primary"
                size="small"
                disabled
                class="upgrade-button-disabled"
              >
                <font-awesome-icon :icon="faStar" /> Apex Upgrade
              </BaseButton>
              <div v-if="userData?.discord_upgraded" class="channel-upgraded">
                <font-awesome-icon :icon="faCrown" /> Apex Upgradet
              </div>
            </div>
            <BaseButton
              v-else
              variant="primary"
              size="small"
              @click="createChannel('discord')"
            >
              <font-awesome-icon :icon="faPlus" /> Erstellen
            </BaseButton>
          </div>
        </div>

        <!-- TeamSpeak Channel -->
        <div class="setting-item">
          <div class="item-info">
            <img src="/src/assets/images/other/teamspeak.png" alt="TeamSpeak" class="platform-logo-small"/>
            <h3>TeamSpeak Channel</h3>
          </div>
          <div class="item-control">
            <div v-if="!userData?.teamspeak_id" class="channel-warning">
               <font-awesome-icon :icon="faExclamationTriangle" /> Account nicht verbunden
            </div>
            <div v-else-if="userData?.teamspeak_channel" class="channel-status">
              <font-awesome-icon :icon="faCheckCircle" /> Channel erstellt
              <BaseButton
                v-if="userData?.apex_rank || userData?.apex_division"
                variant="primary"
                size="small"
                @click="upgradeChannel('teamspeak')"
                class="upgrade-button"
                :disabled="userData?.teamspeak_upgraded"
              >
                <font-awesome-icon :icon="faStar" /> Apex Upgrade
              </BaseButton>
              <BaseButton
                v-else
                variant="primary"
                size="small"
                disabled
                class="upgrade-button-disabled"
              >
                <font-awesome-icon :icon="faStar" /> Apex Upgrade
              </BaseButton>
              <div v-if="userData?.teamspeak_upgraded" class="channel-upgraded">
                <font-awesome-icon :icon="faCrown" /> Apex Upgraded
              </div>
            </div>
            <BaseButton
              v-else
              variant="primary"
              size="small"
              @click="createChannel('teamspeak')"
            >
               <font-awesome-icon :icon="faPlus" /> Erstellen
            </BaseButton>
          </div>
        </div>
      </template>
    </div>

    <!-- Creation Modal -->
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

    <!-- Upgrade Modal -->
    <base-modal v-model="showUpgradeModal">
      <template #title>
        {{ currentPlatform === 'discord' ? 'Discord' : 'TeamSpeak' }} Channel
        Apex Upgrade
      </template>

      <div class="creation-modal-content">
        <div v-if="loading" class="loading-message">
          <div class="spinner"></div>
          <p>Dein Channel wird auf Apex upgradet...</p>
        </div>
        <div v-else>
          <p>
            Möchtest du wirklich deinen
            {{ currentPlatform === 'discord' ? 'Discord' : 'TeamSpeak' }} Channel
            auf Apex upgraden?
          </p>
          <p class="info-text">
            <font-awesome-icon :icon="faInfoCircle" />
            Das Apex Upgrade gewährt dir die beste Position auf den Servern für deinen Channel.
          </p>
        </div>
      </div>

      <template #footer>
        <base-button v-if="!loading" variant="secondary" @click="closeModal">
          Abbrechen
        </base-button>
        <base-button v-if="!loading" variant="primary" glow @click="confirmChannelUpgrade">
          Upgraden
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
import { 
  faLock, 
  faInfoCircle,
  faPlus,
  faCheckCircle,
  faExclamationTriangle,
  faStar,
  faCrown
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  userData: UserProfile | null;
}

const { userData } = defineProps<Props>();
const emit = defineEmits<{
  (e: 'channel-created'): void;
}>();

const showCreationModal = ref(false);
const showUpgradeModal = ref(false);
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

const upgradeChannel = (platform: 'discord' | 'teamspeak') => {
  currentPlatform.value = platform;
  showUpgradeModal.value = true;
};

const confirmChannelUpgrade = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/user/profile/channel/apex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: currentPlatform.value }),
    });

    if (response.ok) {
      emit('channel-created');
      closeModal();
    }
  } catch (error) {
    console.error('Channel apex upgrade failed:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showCreationModal.value = false;
  showUpgradeModal.value = false;
  currentPlatform.value = null;
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

.locked-item {
  background-color: var(--clr-surface-elevated-1);
}

.locked-item:hover {
  background-color: var(--clr-surface-elevated-1);
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

.platform-logo-small {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.item-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-icon.locked-icon {
  color: var(--clr-text-secondary);
  font-size: 1.3rem;
}

.locked-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-lock-icon {
  width: 32px;
  height: 32px;
}

.locked-message {
  color: var(--clr-text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

.channel-warning {
  color: var(--clr-warning);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.channel-status {
  color: var(--clr-success);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.channel-upgraded {
  color: var(--clr-accent);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.item-control .base-button {
   padding: 0.5rem 1rem;
   font-size: 0.9rem;
}

.upgrade-button {
  background-color: var(--clr-accent);
  color: var(--clr-text-primary);
  margin-left: 1rem;
}

.upgrade-button-disabled {
  background-color: var(--clr-surface-elevated-1);
  color: var(--clr-text-secondary);
  margin-left: 1rem;
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  .item-control {
    width: 100%;
    justify-content: flex-end;
  }
  .locked-control {
    width: 100%;
    justify-content: flex-start;
    padding-top: 0.5rem;
    border-top: 1px solid var(--clr-border);
    margin-top: 0.8rem;
  }
}

/* Modal styles */
.creation-modal-content {
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
</style>
