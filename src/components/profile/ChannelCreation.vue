<!-- components/profile/ChannelCreation.vue -->
<template>
  <div class="verification-container">
    <div class="verification-box">
      <h2 class="verification-title">Channel Erstellung</h2>
      <p class="verification-subtext">
        Erstelle deinen eigenen permanenten Voice Channel
      </p>
      <div class="platform-sections">
        <!-- Level Lock Section -->
        <div
          v-if="userData?.level < 20"
          class="platform-section locked-section"
        >
          <div class="platform-header">
            <i class="fas fa-lock platform-icon"></i>
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
        </div>

        <!-- Channel Creation Sections -->
        <template v-else>
          <!-- Discord Channel -->
          <div class="platform-section discord-section">
            <div class="platform-header">
              <i class="fab fa-discord platform-icon"></i>
              <h3>Discord Channel</h3>
            </div>
            <div class="platform-content">
              <div
                v-if="userData?.discord_id && userData?.discord_id == 'None'"
                class="channel-warning"
              >
                <i class="fas fa-check-circle"></i> Verbinde zuerst dein Discord
                Account!
              </div>
              <div v-else-if="userData?.discord_channel" class="channel-status">
                <i class="fas fa-check-circle"></i> Channel bereits erstellt
              </div>
              <button
                v-else
                @click="createChannel('discord')"
                class="verify-button"
              >
                <span class="button-glow"></span>
                <i class="fas fa-plus"></i>
                Channel erstellen
              </button>
            </div>
          </div>

          <!-- TeamSpeak Channel -->
          <div class="platform-section teamspeak-section">
            <div class="platform-header">
              <i class="fab fa-teamspeak platform-icon"></i>
              <h3>TeamSpeak Channel</h3>
            </div>
            <div class="platform-content">
              <div
                v-if="
                  userData?.teamspeak_id && userData?.teamspeak_id == 'None'
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
              <button
                v-else
                @click="createChannel('teamspeak')"
                class="verify-button"
              >
                <span class="button-glow"></span>
                <i class="fas fa-plus"></i>
                Channel erstellen
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  userData: {
    type: Object,
    default: null,
  },
});

const createChannel = async (platform) => {
  try {
    const response = await fetch('/api/profile/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform }),
    });

    if (response.ok) {
      window.location.reload();
    }
  } catch (error) {
    console.error('Channel creation failed:', error);
  }
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
</style>
