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

interface DayTimeData {
  morning: number | string;
  noon: number | string;
  evening: number | string;
  night: number | string;
}

interface ActivityHeatmap {
  data: {
    [key: string]: DayTimeData;
  };
}

export interface Player {
  id: string;
  rank: number;
  name: string;
  level: number;
  division: string;
  total_time: number;
  monthly_time: number;
  weekly_time: number;
  time_to_next_level: number;
  rank_percentage: number;
  mean_total_time: number;
  best_player_time: number;
  activity_heatmap: ActivityHeatmap;
}
