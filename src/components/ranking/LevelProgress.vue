<template>
  <div class="level-progress">
    <!-- Level Progress Section -->
    <div class="progress-section">
      <div class="progress-info">
        <div class="current-level">
          <img
            :src="getLevelImg(level)"
            :alt="`Level ${level}`"
          />
          <span v-if="level <= 20">Level {{ level }}</span>
          <span v-if="level > 20">Prestige {{ getRomanTimeString(level - 20 )}}</span>
        </div>
        <div v-if="!isMaxLevel" class="next-level">
          <img
            :src="getLevelImg(level + 1)"
            :alt="`Level ${level + 1}`"
          />
          <span v-if="level + 1 <= 20">Level {{ level + 1 }}</span>
          <span v-if="level > 20">Prestige {{ getRomanTimeString((level + 1) - 20) }}</span>
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
          <div class="progress-bar" :style="{ width: `${animatedLevelPercentage}%` }">
            <span class="progress-text">{{ animatedLevelPercentage }}%</span>
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
          <div class="progress-bar rank-bar" :style="{ width: `${animatedDivisionPercentage}%` }">
            <span class="progress-text">{{ animatedDivisionPercentage }}%</span>
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
import { computed, ref, onMounted, watch } from 'vue';
import { getRomanTimeString } from '../../services/romanTimeString';

const MAX_LEVEL = 25;
const MAX_DIVISION = 6;

const getRankImg = (rank) => new URL(`../../assets/images/ranks/${rank}.png`, import.meta.url).href;

const ranks = [
  { id: 1, name: 'Bronze', image: getRankImg('bronze') },
  { id: 2, name: 'Silber', image: getRankImg('silver') },
  { id: 3, name: 'Gold', image: getRankImg('gold') },
  { id: 4, name: 'Platin', image: getRankImg('platinum') },
  { id: 5, name: 'Diamant', image: getRankImg('diamond') },
  { id: 6, name: 'Phönix', image: getRankImg('phoenix') },
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

const animatedLevelPercentage = ref(0);
const animatedDivisionPercentage = ref(0);

function animateProgress(target, animatedRef) {
  let start = 0;
  const duration = 800; // ms
  const startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    animatedRef.value = Math.floor(progress * target);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      animatedRef.value = target;
    }
  }
  requestAnimationFrame(animate);
}

onMounted(() => {
  animateProgress(levelProgressPercentage.value, animatedLevelPercentage);
  animateProgress(divisionProgressPercentage.value, animatedDivisionPercentage);
});

watch(levelProgressPercentage, (newVal) => {
  animateProgress(newVal, animatedLevelPercentage);
});

watch(divisionProgressPercentage, (newVal) => {
  animateProgress(newVal, animatedDivisionPercentage);
});

const currentRank = computed(() => {
  return ranks.find(r => r.id === props.division) || ranks[0]; 
});

const nextRank = computed(() => {
  if (isMaxDivision.value) return null;
  return ranks.find(r => r.id === props.division + 1) || ranks[ranks.length - 1];
});

const formatTime = (minutes) => {
  if (minutes <= 0) return '0 Min';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  let result = '';
  if (hours > 0) {
    result += `${hours} Std `;
  }
  result += `${remainingMinutes} Min`;
  return result.trim();
};

const getLevelImg = (level) => new URL(`../../assets/images/level/${level}.png`, import.meta.url).href;
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
  z-index: 1;
  position: relative;
  gap: 2rem; 
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center; 
}

.current-level,
.next-level {
  display: flex;
  align-items: center;
  gap: 0.75rem; 
}

.current-level img,
.next-level img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: contain; 
}

.current-level span,
.next-level span {
  color: var(--clr-text-primary); 
  font-size: 1rem; 
  font-weight: 500;
}

.progress-bar-container {
  height: 24px;
  background: var(--clr-surface-2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--clr-primary) 0%,
    var(--clr-primary-light) 100%
  );
  border-radius: 12px 0 0 12px;
  transition: width 0.3s ease;
  position: relative;
  min-width: 30px; 
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  padding-right: 8px; 
  overflow: hidden; 
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -40%;
  width: 60%; 
  height: 100%;
  background: linear-gradient(120deg, var(--clr-transparent-light) 0%, var(--clr-transparent) 50%, var(--clr-transparent-light) 100%);
  animation: shimmer 2.2s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    left: -40%;
  }
  100% {
    left: 100%; 
  }
}


.progress-bar.rank-bar {
   background: linear-gradient(
    90deg,
    var(--clr-red) 0%, 
    var(--clr-primary) 100% 
  );
}

.progress-bar.rank-bar::after {
  background: linear-gradient(120deg, var(--clr-transparent-light) 0%, var(--clr-transparent) 50%, var(--clr-transparent-light) 100%);
}

.progress-text {
  color: var(--clr-text-primary);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 24px;
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

.division-section .time-remaining i {
    color: var(--clr-primary);
}

@media (max-width: 768px) {
  .level-progress {
    padding: 1rem;
    gap: 1.5rem; 
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
