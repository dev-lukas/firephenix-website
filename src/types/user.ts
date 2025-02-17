export interface UserProfile {
  name: string | null;
  discord_id: string | null;
  teamspeak_id: string | null;
  level: number;
  division: number;
  discord_channel: string | null;
  teamspeak_channel: string | null;
  total_time: number;
  daily_time: number;
  weekly_time: number;
  monthly_time: number;
}
