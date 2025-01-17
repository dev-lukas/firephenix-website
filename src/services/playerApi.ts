
// services/playerApi.ts
import type { PlayerProfile } from '../types/player'

export const mockPlayerApi = {
    async getPlayerProfile(id: string): Promise<PlayerProfile> {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return {
        id,
        name: `Player ${id}`,
        level: Math.floor(Math.random() * 100),
        totalHours: Math.floor(Math.random() * 1000),
        monthlyHours: Math.floor(Math.random() * 200),
        weeklyHours: Math.floor(Math.random() * 50),
        hoursToNextLevel: Math.floor(Math.random() * 20),
        percentile: Math.floor(Math.random() * 100),
        levelProgress: Math.random() * 100,
        averageComparison: {
          playerHours: Math.floor(Math.random() * 1000),
          averageHours: 450
        }
      }
    }
  }  