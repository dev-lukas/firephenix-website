<!-- components/profile/PlatformVerification.vue -->
<template>
  <div class="verification-container">
    <base-box>
      <h2 class="verification-title">Account Verbindung</h2>
      <p class="verification-subtext">
        Verbinde deine Voice-Chats um plattformübergreifend deine Zeit zu
        tracken und Rang-Belohnung in FirePhenix Game Servern zu erhalten.<br />
        Du <b>musst</b> für die Verifizierung online auf der Plattform sein.
      </p>
      <div class="platform-sections">
        <!-- Discord Section -->
        <base-box elevated hoverable class="platform-section discord-section">
          <div class="platform-header">
            <i class="fab fa-discord platform-icon"></i>
            <h3>Verbinde deinen Discord Account</h3>
          </div>
          <div class="platform-content">
            <div
              v-if="userData?.discord_id && userData?.discord_id != 'None'"
              class="linked-status"
            >
              <i class="fas fa-check-circle"></i> Verbunden
            </div>
            <template v-else>
              <select v-model="selectedDiscordUser" class="platform-select">
                <option value="" disabled>Online Benutzer auswählen</option>
                <option
                  v-for="user in discordUsers"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
              <base-button
                variant="primary"
                :disabled="!selectedDiscordUser"
                glow
                :full-width="true"
                @click="initiateVerification('discord')"
              >
                <i class="fas fa-link"></i>
                Account verknüpfen
              </base-button>
            </template>
          </div>
        </base-box>

        <!-- TeamSpeak Section -->
        <base-box elevated hoverable class="platform-section teamspeak-section">
          <div class="platform-header">
            <i class="fab fa-teamspeak platform-icon"></i>
            <h3>Verbinde deinen TeamSpeak Account</h3>
          </div>
          <div class="platform-content">
            <div
              v-if="userData?.teamspeak_id && userData?.teamspeak_id != 'None'"
              class="linked-status"
            >
              <i class="fas fa-check-circle"></i> Verbunden
            </div>
            <template v-else>
              <select v-model="selectedTeamspeakUser" class="platform-select">
                <option value="" disabled>Online Benutzer auswählen</option>
                <option
                  v-for="user in teamspeakUsers"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
              <base-button
                variant="primary"
                :disabled="!selectedTeamspeakUser"
                glow
                :full-width="true"
                @click="initiateVerification('teamspeak')"
              >
                <i class="fas fa-link"></i>
                Account verknüpfen
              </base-button>
            </template>
          </div>
        </base-box>
      </div>
    </base-box>

    <!-- Verification Modal -->
    <base-modal v-model="showVerificationModal">
      <template #title> Verifizierungscode </template>

      <div class="verification-modal-content">
        <p class="verification-text">
          An {{ currentPlatform }} gesendeter Bestätigungscode
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
        <base-button variant="secondary" @click="closeModal">
          Abbrechen
        </base-button>
        <base-button variant="primary" glow @click="verifyCode">
          Bestätigen
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { UserProfile } from '../../types/user';
import BaseBox from '../base/BaseBox.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';

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
.verification-container {
  width: 100%;
  margin: 0 auto;
  color: var(--clr-text-primary);
}

.verification-box {
  background: var(--clr-surface);
  border-radius: 20px;
  padding: 0rem 1.5rem 1.5rem;
  border: 1px solid var(--clr-border);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
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

.linked-status {
  color: #4caf50;
  font-weight: 500;
  padding: 1rem;
  text-align: center;
  border: 2px solid var(--clr-border);
  border-radius: 8px;
}

.linked-status i {
  margin-right: 0.5rem;
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

.platform-select {
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  margin-bottom: 1.5rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
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

.verification-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--clr-background);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.verification-modal {
  background: var(--clr-surface);
  padding: 2rem;
  border-radius: 15px;
  width: min(90%, 400px);
  position: relative;
  overflow: hidden;
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

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm {
  background: var(--clr-primary);
  color: white;
}

.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

@keyframes glowPulse {
  0% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(0.98);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.02);
  }
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(0.98);
  }
}

@media (max-width: 768px) {
  .platform-sections {
    grid-template-columns: 1fr;
  }

  .verification-box {
    padding: 2rem 1.5rem;
  }
}
</style>
