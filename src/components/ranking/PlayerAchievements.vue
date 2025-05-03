<!-- components/profile/PlayerAchievements.vue -->
<template>
  <div class="achievements-container">
    <h3 class="achievements-header">
      {{ unlockedCount }}/{{ totalAchievements }} Achievements
    </h3>

    <div v-if="loading" class="loading-state">
      <p>Lade Achievements...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Fehler beim Laden der Achievements</p>
    </div>
    
    <div v-else class="achievements-grid">
      
      <div
        v-for="(level, index) in maxLevels.logins"
        :key="`logins-${index}`"
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.logins?.achievement_level < index + 1 }"
      >
        <img
          :src="`/src/assets/images/achievements/logins/${index + 1}.png`"
          :alt="`Logins Level ${index + 1}`"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Dauergast {{ getRomanTimeString(index + 1) }}</h4>
            <p>{{ getLoginDescription(index + 1) }}</p>
            <p v-if="achievements.logins?.total_logins">Gesamt: {{ achievements.logins.total_logins }} Logins</p>
          </div>
        </div>
      </div>

      <div
        v-for="(level, index) in maxLevels.time"
        :key="`time-${index}`"
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.time?.achievement_level < index + 1 }"
      >
        <img
          :src="`/src/assets/images/achievements/time/${index + 1}.png`"
          :alt="`Time Level ${index + 1}`"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Ausdauernd {{ getRomanTimeString(index + 1) }}</h4>
            <p>{{ getTimeDescription(index + 1) }}</p>
            <p v-if="achievements.time?.total_hours">
              Gesamt: {{ Math.floor(achievements.time.total_hours) }} Stunden
            </p>
          </div>
        </div>
      </div>      

      <div
        v-for="(level, index) in maxLevels.heatmap"
        :key="`heatmap-${index}`"
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.heatmap?.achievement_level < index + 1 }"
      >
        <img
          :src="`/src/assets/images/achievements/days/${index + 1}.png`"
          :alt="`Heatmap Level ${index + 1}`"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Flexibel {{ getRomanTimeString(index + 1) }}</h4>
            <p>{{ getHeatmapDescription(index + 1) }}</p>
            <p v-if="achievements.heatmap?.active_days">Aktive Tage: {{ achievements.heatmap.active_days }}</p>
          </div>
        </div>
      </div>

      <div
        v-for="(level, index) in maxLevels.streak"
        :key="`streak-${index}`"
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.streak?.achievement_level < index + 3 }"
      >
        <img
          :src="`/src/assets/images/achievements/streak/${index + 1}.png`"
          :alt="`Streak Level ${index + 1}`"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Beharrlich {{ getRomanTimeString(index + 1) }}</h4>
            <p>{{ getStreakDescription(index + 1) }}</p>
            <p v-if="achievements.streak?.longest_streak">Längste Serie: {{ achievements.streak.longest_streak }} Tage</p>
          </div>
        </div>
      </div>

      <div
        v-for="(level, index) in maxLevels.division"
        :key="`division-${index}`"
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.division?.achievement_level < index + 1 }"
      >
        <img
          :src="`/src/assets/images/achievements/season/${index + 1}.png`"
          :alt="`Division Level ${index + 1}`"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Kompetetiv {{ getRomanTimeString(index + 1) }}</h4>
            <p>{{ getDivisionDescription(index + 1) }}</p>
          </div>
        </div>
      </div>

      <div
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.apex?.achievement_level === 0 }"
      >
        <img
          src="/src/assets/images/achievements/apex.png"
          alt="Apex Predator"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Apex Predator</h4>
            <p>Schließe eine Season als Erster ab</p>
          </div>
        </div>
      </div>

      <div
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.old_member?.achievement_level === 0 }"
      >
        <img
          src="/src/assets/images/achievements/anvil.png"
          alt="Old Member"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Altes Eisen</h4>
            <p>Sei ein Urgestein von FirePhenix</p>
          </div>
        </div>
      </div>

      <div
        class="achievement-item"
        :class="{ 'achievement-locked': achievements.legacy_supporter?.achievement_level === 0 }"
      >
        <img
          src="/src/assets/images/achievements/honor.png"
          alt="Legacy Supporter"
          class="achievement-icon"
        />
        <div class="achievement-tooltip">
          <div class="tooltip-content">
            <h4>Ehrenmitglied</h4>
            <p>Unterstütze den Server in der Vergangenheit</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getRomanTimeString } from '../../services/romanTimeString';

const props = defineProps({
  playerId: {
    type: String,
    required: true,
  },
});

const playerId = props.playerId;

interface AchievementData {
  achievement_level: number;
  total_hours?: number;
  total_logins?: number;
  longest_streak?: number;
  active_days?: number;
}

interface AchievementsResponse {
  apex: AchievementData;
  division: AchievementData;
  heatmap: AchievementData;
  legacy_supporter: AchievementData;
  logins: AchievementData;
  old_member: AchievementData;
  streak: AchievementData;
  time: AchievementData;
}

const achievements = ref<AchievementsResponse>({
  apex: { achievement_level: 0 },
  division: { achievement_level: 0 },
  heatmap: { achievement_level: 0, active_days: 0 },
  legacy_supporter: { achievement_level: 0 },
  logins: { achievement_level: 0, total_logins: 0 },
  old_member: { achievement_level: 0 },
  streak: { achievement_level: 0, longest_streak: 0, total_logins: 0 },
  time: { achievement_level: 0, total_hours: 0 }
});

const loading = ref(true);
const error = ref(false);

const maxLevels = {
  division: 4,
  heatmap: 4,
  logins: 4,
  streak: 4,
  time: 4
};

const getDivisionDescription = (level: number): string => {
  const descriptions = [
    'Erreiche Gold in einer Season',
    'Erreiche Platin in einer Season',
    'Erreiche Diamant in einer Season',
    'Erreiche Phönix in einer Season'
  ];
  return descriptions[level - 1] || '';
};

const getHeatmapDescription = (level: number): string => {
  const descriptions = [
    'Sei an 3 verschiedenen Wochentagen aktiv',
    'Sei an 5 verschiedenen Wochentagen aktiv',
    'Sei an allen Wochentagen aktiv',
    'Sei an allen Wochentagen und Zeiten aktiv'
  ];
  return descriptions[level - 1] || '';
};

const getLoginDescription = (level: number): string => {
  const descriptions = [
    'Logge dich 2 mal ein',
    'Logge dich 30 mal ein',
    'Logge dich 365 mal ein',
    'Logge dich 3650 mal ein'
  ];
  return descriptions[level - 1] || '';
};

const getStreakDescription = (level: number): string => {
  const descriptions = [
    'Logge dich 2 Tage in Folge ein',
    'Logge dich 7 Tage in Folge ein',
    'Logge dich 14 Tage in Folge ein',
    'Logge dich 30 Tage in Folge ein'
  ];
  return descriptions[level - 1] || '';
};

const getTimeDescription = (level: number): string => {
  const descriptions = [
    'Spiele 1 Stunden',
    'Spiele 10 Stunden',
    'Spiele 100 Stunden',
    'Spiele 1000 Stunden'
  ];
  return descriptions[level - 1] || '';
};

const fetchAchievements = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/ranking/profile/achievements?id=' + playerId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    achievements.value = data;
  } catch (err) {
    console.error('Error fetching achievements:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAchievements();
});

const totalAchievements = computed(() => {
  return Object.keys(maxLevels).reduce((acc, key) => {
    return acc + maxLevels[key as keyof typeof maxLevels];
  }, 3); 
});

const unlockedCount = computed(() => {
  if (!achievements.value) return 0;
  
  let count = 0;
  
  // Count tiered achievements
  Object.keys(maxLevels).forEach(key => {
    const achievementKey = key as keyof typeof achievements.value;
    count += achievements.value[achievementKey]?.achievement_level || 0;
  });
  
  // Count binary achievements
  if (achievements.value.apex?.achievement_level > 0) count++;
  if (achievements.value.old_member?.achievement_level > 0) count++;
  if (achievements.value.legacy_supporter?.achievement_level > 0) count++;
  
  return count;
});
</script>

<style scoped>
.achievements-container {
  background: var(--clr-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  margin-top: 2rem;
}

.achievements-header {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--clr-border);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  margin: 1rem auto;
  gap: 1.5rem;
  justify-items: center;
  position: relative;
  padding: 1rem 0;
}

.achievement-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: visible;
  cursor: pointer;
}

.achievement-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.achievement-locked {
  filter: grayscale(100%);
}

.achievement-tooltip {
  position: absolute;
  bottom: 120%;
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1rem;
  width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content {
  position: relative;
}

.achievement-tooltip h4 {
  color: var(--clr-primary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.achievement-tooltip p {
  color: var(--clr-text-secondary);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.unlock-date {
  display: block;
  font-size: 0.75rem;
  color: var(--clr-text-secondary);
}

.achievement-item:hover .achievement-tooltip {
  opacity: 1;
  visibility: visible;
  bottom: 115%;
}

.achievement-item:hover .achievement-icon {
  transform: scale(1.1);
}

.achievement-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: var(--clr-background);
  border-right: 1px solid var(--clr-border);
  border-bottom: 1px solid var(--clr-border);
}

.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  color: var(--clr-text-secondary);
}

.achievement-item:first-child .achievement-tooltip,
.achievement-item:nth-child(2) .achievement-tooltip {
  left: 0;
  transform: none;
}

.achievement-item:first-child .achievement-tooltip::after,
.achievement-item:nth-child(2) .achievement-tooltip::after {
  left: 32px;
  transform: rotate(45deg);
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 1rem;
  }

  .achievement-item {
    width: 70px; 
    height: 70px; 
  }

  .achievement-tooltip {
    width: 150px;
  }

  .achievement-item:first-child .achievement-tooltip::after,
  .achievement-item:nth-child(2) .achievement-tooltip::after {
    left: 24px;
  }
}
</style>
