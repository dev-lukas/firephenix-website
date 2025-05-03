<!-- components/profile/PlatformVerification.vue -->
<template>
  <div class="settings-section-container">
    <h2 class="section-title">Account Verbindung</h2>
    <p class="section-subtext">
      Verbinde deine Accounts um plattformübergreifend deine Zeit zu tracken
      und Rang-Belohnung in FirePhenix Game Servern zu erhalten.<br />
      Du <b>musst</b> für die Verifizierung online auf der Plattform sein.
    </p>
    <div class="settings-list">


      <div class="setting-item">
        <div class="item-info">
          <img src="/src/assets/images/other/steam-blue.png" alt="Steam" class="platform-logo-small"/>
          <h3>Steam</h3>
        </div>
        <div class="item-control">
          <div class="linked-status">
            <font-awesome-icon :icon="faCheckCircle" /> Verbunden
          </div>
        </div>
      </div>

      <div class="setting-item">
        <div class="item-info">
          <img src="/src/assets/images/other/discord.png" alt="Discord" class="platform-logo-small"/>
          <h3>Discord</h3>
        </div>
        <div class="item-control">
          <div v-if="isDiscordLinked" class="linked-status">
            <font-awesome-icon :icon="faCheckCircle" /> Verbunden
          </div>
          <div v-else class="connect-controls">
            <select v-model="selectedDiscordUser" class="platform-select-inline">
              <option value="" disabled>Online Benutzer auswählen</option>
              <option
                v-for="user in discordUsers"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
            <BaseButton
              variant="primary"
              size="small"
              :disabled="!selectedDiscordUser"
              @click="initiateVerification('discord')"
            >
              <font-awesome-icon :icon="faLink" /> Verbinden
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="setting-item">
        <div class="item-info">
           <img src="/src/assets/images/other/teamspeak.png" alt="TeamSpeak" class="platform-logo-small"/>
          <h3>TeamSpeak</h3>
        </div>
        <div class="item-control">
          <div v-if="isTeamspeakLinked" class="linked-status">
            <font-awesome-icon :icon="faCheckCircle" /> Verbunden
          </div>
          <div v-else class="connect-controls">
            <select v-model="selectedTeamspeakUser" class="platform-select-inline">
              <option value="" disabled>Online Benutzer auswählen</option>
              <option
                v-for="user in teamspeakUsers"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
            <BaseButton
              variant="primary"
              size="small"
              :disabled="!selectedTeamspeakUser"
              @click="initiateVerification('teamspeak')"
            >
               <font-awesome-icon :icon="faLink" /> Verbinden
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <base-modal v-model="showVerificationModal">
      <template #title> Verifizierungscode </template>

      <div class="verification-modal-content">
        <p class="verification-text">
          Dir wurde ein Bestätigungscode zu gesendetet.
          Dies könnte bis zu einer Minute dauern.
        </p>
        <div class="code-input-container">
          <input
            v-model="verificationCode"
            type="text"
            class="code-input"
            placeholder="••••••"
            maxlength="6"
          />
          <div class="input-glow"></div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">
          Abbrechen
        </BaseButton>
        <BaseButton variant="primary" glow @click="verifyCode">
          Bestätigen
        </BaseButton>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { UserProfile } from '../../types/user';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import { faCheckCircle, faLink } from '@fortawesome/free-solid-svg-icons';

interface Props {
  userData: UserProfile | null;
}

const { userData } = defineProps<Props>();

interface PlatformUser {
  id: string;
  name: string;
}

const discordUsers = ref<PlatformUser[]>([]);
const teamspeakUsers = ref<PlatformUser[]>([]);
const selectedDiscordUser = ref('');
const selectedTeamspeakUser = ref('');
const showVerificationModal = ref(false);
const verificationCode = ref('');
const currentPlatform = ref<'discord' | 'teamspeak' | null>(null);

const emit = defineEmits<{
  (e: 'verification-success'): void;
}>();

const isDiscordLinked = computed(() => !!userData?.discord_id && userData.discord_id !== 'None');
const isTeamspeakLinked = computed(() => !!userData?.teamspeak_id && userData.teamspeak_id !== 'None');

onMounted(async () => {
  try {
    const [discordResponse, teamspeakResponse] = await Promise.all([
      fetch('/api/user/online?platform=discord'),
      fetch('/api/user/online?platform=teamspeak'),
    ]);

    const discordData = await discordResponse.json();
    const teamspeakData = await teamspeakResponse.json();

    discordUsers.value = discordData.users;
    teamspeakUsers.value = teamspeakData.users;
  } catch (error) {
    console.error('Failed to fetch online users:', error);
  }
});

const initiateVerification = async (platform: 'discord' | 'teamspeak') => {
  currentPlatform.value = platform;
  const userId =
    platform === 'discord'
      ? selectedDiscordUser.value
      : selectedTeamspeakUser.value;

  const user = (
    platform === 'discord' ? discordUsers.value : teamspeakUsers.value
  ).find((u) => u.id === userId);

  if (!user) return;

  try {
    const response = await fetch('/api/user/profile/verification/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        platform_id: user.id,
      }),
    });
    if (response.ok) {
      showVerificationModal.value = true;
    }
  } catch (error) {
    console.error('Verification initiation failed:', error);
  }
};

const verifyCode = async () => {
  try {
    const response = await fetch('/api/user/profile/verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: currentPlatform.value,
        code: verificationCode.value,
      }),
    });

    if (response.ok) {
      closeModal();
      emit('verification-success');
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
};

const closeModal = () => {
  showVerificationModal.value = false;
  verificationCode.value = '';
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

.linked-status {
  color: var(--clr-success);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.connect-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.platform-select-inline {
  padding: 0.5rem 0.8rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 6px;
  color: var(--clr-text-primary);
  min-width: 180px;
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2rem;
}

.platform-select-inline:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 2px var(--clr-primary-transparent);
}

.item-control .base-button {
   padding: 0.5rem 1rem;
   font-size: 0.9rem;
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
  .connect-controls {
     width: 100%;
     justify-content: space-between;
  }
  .platform-select-inline {
      flex-grow: 1;
      min-width: 150px;
  }
}

.verification-modal-content {
  text-align: center;
}

.verification-text {
  margin-bottom: 1.5rem;
  color: var(--clr-text-secondary);
}

.code-input-container {
  position: relative;
  width: 200px;
  margin: 0 auto;
}

.code-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 0.5rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  transition: all 0.3s ease;
}

.code-input:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 2px var(--clr-primary-transparent);
}

.input-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: var(--clr-primary);
  opacity: 0;
  border-radius: 12px;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.code-input:focus + .input-glow {
  opacity: 0.1;
}
</style>
