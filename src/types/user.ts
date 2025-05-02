export interface UserProfile {
  id: string;
  name: string | null;
  discord_id: string | null;
  teamspeak_id: string | null;
  level: number;
  division: number;
  discord_channel: string | null;
  teamspeak_channel: string | null;
  discord_moveable: boolean;
  teamspeak_moveable: boolean;
  total_time: number;
  daily_time: number;
  weekly_time: number;
  monthly_time: number;
  season_time: number;
  apex_division: boolean;
  apex_rank: boolean;
  discord_upgraded: boolean;
  teamspeak_upgraded: boolean;
  time_to_next_level: number;
  time_to_next_division: number;
  best_division_achieved: number;
  season_one_skins_unlocked: {
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
  };
  activity_heatmap: {
    data: {
      [key: string]: {
        morning: number | string;
        noon: number | string;
        evening: number | string;
        night: number | string;
      };
    };
  };
  login_streaks: {
    discord: {
      current: number;
      longest: number;
    };
    teamspeak: {
      current: number;
      longest: number;
    };
  };
}
