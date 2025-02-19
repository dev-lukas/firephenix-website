<template>
  <div class="level-progress">
    <div class="progress-info">
      <div class="current-level">
        <img
          :src="`/src/assets/images/level/${level}.png`"
          :alt="`Level ${level}`"
        />
        <span>Level {{ level }}</span>
      </div>
      <div v-if="!isMaxLevel" class="next-level">
        <img
          :src="`/src/assets/images/level/${level + 1}.png`"
          :alt="`Level ${level + 1}`"
        />
        <span>Level {{ level + 1 }}</span>
      </div>
    </div>

    <template v-if="isMaxLevel">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `100%` }">
          <span class="progress-text">{{ progressPercentage }}%</span>
        </div>
      </div>

      <div class="time-remaining">
        <i class="fas fa-clock"></i>
        <span>Du hast den Zenit erreicht</span>
      </div>
    </template>
    <template v-else>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${progressPercentage}%` }">
          <span class="progress-text">{{ progressPercentage }}%</span>
        </div>
      </div>

      <div class="time-remaining">
        <i class="fas fa-clock"></i>
        <span
          >Noch {{ formatTime(timeToNextLevel) }} bis zum nächsten Level</span
        >
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const MAX_LEVEL = 25;

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  timeToNextLevel: {
    type: Number,
    required: true,
  },
});

const isMaxLevel = computed(() => props.level >= MAX_LEVEL);

const progressPercentage = computed(() => {
  if (isMaxLevel.value) return 100;
  const levelRequirement = props.timeToNextLevel + props.totalTime;
  return Math.min(Math.floor((props.totalTime / levelRequirement) * 100), 100);
});

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} Std ${remainingMinutes} Min`;
};
</script>

<style scoped>
.level-progress {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.current-level,
.next-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-level img,
.next-level img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.current-level span,
.next-level span {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.progress-bar-container {
  height: 24px;
  background: var(--clr-surface-elevated-1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--clr-primary) 0%,
    var(--clr-primary-light) 100%
  );
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
  min-width: 24px;
}

.progress-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.time-remaining {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.time-remaining i {
  color: var(--clr-primary);
}

.max-level-message {
  text-align: center;
  color: var(--clr-primary);
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
}

.max-level-message i {
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .level-progress {
    padding: 1rem;
  }

  .current-level img,
  .next-level img {
    width: 32px;
    height: 32px;
  }

  .progress-bar-container {
    height: 20px;
  }

  .time-remaining {
    font-size: 0.8rem;
  }
}
</style>
