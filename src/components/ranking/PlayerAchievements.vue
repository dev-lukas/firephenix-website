<!-- components/profile/PlayerAchievements.vue -->
<template>
    <div class="achievements-container">
      <h3 class="achievements-header">
        {{ unlockedCount }}/{{ totalAchievements }} Achievements
      </h3>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id" 
          class="achievement-item"
          :class="{ 'achievement-locked': !achievement.unlocked }"
        >
          <img 
            :src="`/src/assets/images/level/1.png`" 
            :alt="achievement.name"
            class="achievement-icon"
          />
          <div class="achievement-tooltip">
            <div class="tooltip-content">
              <h4>{{ achievement.name }}</h4>
              <p>{{ achievement.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  interface Achievement {
    id: number
    name: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: Date
  }
  
  const achievements = ref<Achievement[]>([
    {
      id: 1,
      name: '10 Hours',
      description: 'Play for 10 hours',
      icon: 'time-10',
      unlocked: true,
      unlockedAt: new Date('2024-01-10')
    },
    {
      id: 2,
      name: '40 Hours',
      description: 'Play for 40 hours',
      icon: 'time-10',
      unlocked: false,
      unlockedAt: new Date('2024-01-10')
    }
    // Add more achievements here
  ])
  
  const unlockedCount = computed(() => 
    achievements.value.filter(a => a.unlocked).length
  )
  
  const totalAchievements = computed(() => 
    achievements.value.length
  )
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE').format(date)
  }
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
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 1rem;
    justify-items: center;
    position: relative;
    padding: 1rem 0;
    margin: 1rem 0;
  }
  
  .achievement-item {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 8px;
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
    filter: grayscale(100%) opacity(0.5);
  }
  
  .achievement-tooltip {
    position: absolute;
    bottom: 120%;
    background: var(--clr-surface);
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
    background: var(--clr-surface);
    border-right: 1px solid var(--clr-border);
    border-bottom: 1px solid var(--clr-border);
  }
  
  /* Position fixes for tooltips near viewport edges */
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
      grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    }
  
    .achievement-item {
      width: 48px;
      height: 48px;
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
  