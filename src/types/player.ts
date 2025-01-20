// types/player.ts
export interface PlayerProfile {
  id: string;
  name: string;
  level: number;
  totalHours: number;
  monthlyHours: number;
  weeklyHours: number;
  hoursToNextLevel: number;
  percentile: number;
  levelProgress: number;
  averageComparison: {
    playerHours: number;
    averageHours: number;
  };
}
