<template>
  <div class="platform-breakdown" v-if="total > 0">
    <h3 class="breakdown-title">Plattform-Verteilung</h3>
    <div class="bar-container">
      <div
        class="bar-segment discord"
        :style="{ width: animatedDiscordPercent + '%' }"
      >
        <span v-if="discordPercent > 15" class="bar-label">{{ discordPercent }}%</span>
      </div>
      <div
        class="bar-segment teamspeak"
        :style="{ width: animatedTeamspeakPercent + '%' }"
      >
        <span v-if="teamspeakPercent > 15" class="bar-label">{{ teamspeakPercent }}%</span>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot discord-dot"></span>
        <span class="legend-text">Discord — {{ formatTime(discordTime) }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot teamspeak-dot"></span>
        <span class="legend-text">TeamSpeak — {{ formatTime(teamspeakTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  discordTime: { type: Number, default: 0 },
  teamspeakTime: { type: Number, default: 0 },
});

const total = computed(() => props.discordTime + props.teamspeakTime);
const discordPercent = computed(() => total.value ? Math.round((props.discordTime / total.value) * 100) : 0);
const teamspeakPercent = computed(() => total.value ? 100 - discordPercent.value : 0);

const animatedDiscordPercent = ref(0);
const animatedTeamspeakPercent = ref(0);

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes} Min`;
  return `${hours} Std`;
};

onMounted(() => {
  requestAnimationFrame(() => {
    animatedDiscordPercent.value = discordPercent.value;
    animatedTeamspeakPercent.value = teamspeakPercent.value;
  });
});
</script>

<style scoped>
.platform-breakdown {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  z-index: 1;
  position: relative;
  opacity: 0;
  animation: card-enter 0.5s var(--transition-smooth) 0.1s forwards;
}

@keyframes card-enter {
  to { opacity: 1; transform: translateY(0); }
}

.breakdown-title {
  color: var(--clr-text-primary);
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.bar-container {
  display: flex;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--clr-surface-2);
  margin-bottom: 1rem;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
  min-width: 0;
}

.bar-segment.discord {
  background: var(--clr-discord);
}

.bar-segment.teamspeak {
  background: var(--clr-teamspeak);
}

.bar-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.legend {
  display: flex;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.discord-dot { background: var(--clr-discord); }
.teamspeak-dot { background: var(--clr-teamspeak); }

.legend-text {
  color: var(--clr-text-secondary);
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  .legend {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
