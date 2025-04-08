<template>
  <div class="level-progress">
    <!-- Level Progress Section -->
    <div class="progress-section">
      <div class="progress-info">
        <div class="current-level">
          <img
            :src="`/src/assets/images/level/${level}.png`"
            :alt="`Level ${level}`"
          />
          <span v-if="level <= 20">Level {{ level }}</span>
          <span v-if="level > 20">Prestige {{ level - 20 }}</span>
        </div>
        <div v-if="!isMaxLevel" class="next-level">
          <img
            :src="`/src/assets/images/level/${level + 1}.png`"
            :alt="`Level ${level + 1}`"
          />
          <span v-if="level + 1 <= 20">Level {{ level + 1 }}</span>
          <span v-if="level > 20">Prestige {{ (level + 1) - 20 }}</span>
        </div>
      </div>

      <template v-if="isMaxLevel">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `100%` }">
            <span class="progress-text">MAX</span>
          </div>
        </div>
        <div class="time-remaining">
          <i class="fas fa-crown"></i>
          <span>Maximales Level erreicht</span>
        </div>
      </template>
      <template v-else>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${levelProgressPercentage}%` }">
            <span class="progress-text">{{ levelProgressPercentage }}%</span>
          </div>
        </div>
        <div class="time-remaining">
          <i class="fas fa-clock"></i>
          <span>Noch {{ formatTime(timeToNextLevel) }} bis zum nächsten Level</span>
        </div>
      </template>
    </div>

    <!-- Division Progress Section -->
    <div class="progress-section division-section">
       <div class="progress-info">
        <div class="current-level">
          <img
            :src="currentRank.image"
            :alt="currentRank.name"
          />
          <span>{{ currentRank.name }}</span>
        </div>
        <div v-if="!isMaxDivision" class="next-level">
          <img
            :src="nextRank.image"
            :alt="nextRank.name"
          />
          <span>{{ nextRank.name }}</span>
        </div>
      </div>

      <template v-if="isMaxDivision">
        <div class="progress-bar-container">
          <div class="progress-bar rank-bar" :style="{ width: `100%` }">
             <span class="progress-text">MAX</span>
          </div>
        </div>
         <div class="time-remaining">
          <i class="fas fa-trophy"></i>
          <span>Höchste Division erreicht</span>
        </div>
      </template>
      <template v-else>
        <div class="progress-bar-container">
          <div class="progress-bar rank-bar" :style="{ width: `${divisionProgressPercentage}%` }">
            <span class="progress-text">{{ divisionProgressPercentage }}%</span>
          </div>
        </div>
        <div class="time-remaining">
          <i class="fas fa-clock"></i>
          <span>Noch {{ formatTime(timeToNextDivision) }} bis zur nächsten Division</span>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';

const MAX_LEVEL = 25;
const MAX_DIVISION = 6;

const ranks = [
  { id: 1, name: 'Bronze', image: '/src/assets/images/ranks/bronze.png' },
  { id: 2, name: 'Silber', image: '/src/assets/images/ranks/silver.png' },
  { id: 3, name: 'Gold', image: '/src/assets/images/ranks/gold.png' },
  { id: 4, name: 'Platin', image: '/src/assets/images/ranks/platinum.png' },
  { id: 5, name: 'Diamant', image: '/src/assets/images/ranks/diamond.png' },
  { id: 6, name: 'Phönix', image: '/src/assets/images/ranks/phoenix.png' },
];

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
  division: {
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
  seasonTime: {
    type: Number,
    required: true,
  },
  timeToNextDivision: {
    type: Number,
    required: true,
  },
});

const isMaxLevel = computed(() => props.level >= MAX_LEVEL);
const isMaxDivision = computed(() => props.division >= MAX_DIVISION);

const levelProgressPercentage = computed(() => {
  if (isMaxLevel.value) return 100;
  const levelRequirement = props.timeToNextLevel + props.totalTime;
  return Math.min(Math.floor((props.totalTime / levelRequirement) * 100), 100);
});

const divisionProgressPercentage = computed(() => {
  if (isMaxDivision.value) return 100;
  const divisionRequirement = props.timeToNextDivision + props.seasonTime;
  return Math.min(Math.floor((props.seasonTime / divisionRequirement) * 100), 100);
});

const currentRank = computed(() => {
  return ranks.find(r => r.id === props.division) || ranks[0]; // Default to Bronze if not found
});

const nextRank = computed(() => {
  if (isMaxDivision.value) return null;
  return ranks.find(r => r.id === props.division + 1) || ranks[ranks.length - 1];
});

const formatTime = (minutes) => {
  if (minutes <= 0) return '0 Min';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60); // Round minutes
  let result = '';
  if (hours > 0) {
    result += `${hours} Std `;
  }
  result += `${remainingMinutes} Min`;
  return result.trim();
};
</script>

<style scoped>
.level-progress {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Add gap between level and division sections */
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center; /* Vertically align items */
}

.current-level,
.next-level {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Increased gap slightly */
}

.current-level img,
.next-level img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: contain; /* Ensure rank images fit well */
}

.current-level span,
.next-level span {
  color: var(--clr-text-primary); /* Use primary text color */
  font-size: 1rem; /* Slightly larger font */
  font-weight: 500;
}

.progress-bar-container {
  height: 24px;
  background: var(--clr-surface-elevated-1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem; /* Reduced margin */
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--clr-primary) 0%,
    var(--clr-primary-light) 100%
  );
  border-radius: 12px 0 0 12px; /* Keep left radius */
  transition: width 0.3s ease;
  position: relative;
  min-width: 30px; /* Ensure text is visible */
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Align text to the right */
  padding-right: 8px; /* Add padding for text */
}

/* Specific gradient for rank bar */
.progress-bar.rank-bar {
   /* Added fallback colors */
   background: linear-gradient(
    90deg,
    var(--clr-accent, #ea580c) 0%, /* Fallback: orange-600 */
    var(--clr-accent-light, #fb923c) 100% /* Fallback: orange-400 */
  );
}

.progress-text {
  /* Removed absolute positioning */
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 24px; /* Match container height */
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

/* Style icon for max division */
.division-section .time-remaining i {
    color: var(--clr-accent);
}

/* ... existing max-level-message and animation styles ... */

@media (max-width: 768px) {
  .level-progress {
    padding: 1rem;
    gap: 1.5rem; /* Adjust gap for smaller screens */
  }

  .current-level img,
  .next-level img {
    width: 32px;
    height: 32px;
  }

  .current-level span,
  .next-level span {
    font-size: 0.9rem;
  }

  .progress-bar-container {
    height: 20px;
  }

   .progress-bar {
     min-width: 25px;
     padding-right: 6px;
   }

  .progress-text {
    font-size: 0.75rem;
    line-height: 20px;
  }

  .time-remaining {
    font-size: 0.8rem;
  }
}
</style>
