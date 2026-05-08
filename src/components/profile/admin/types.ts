export type AdminFetch = <T = unknown>(
  url: string,
  options?: RequestInit
) => Promise<T>;

export type Platform = 'discord' | 'teamspeak';

export interface PlayerSummary {
  id: number;
  steam_id: string | null;
  discord_id: string | null;
  teamspeak_id: string | null;
  name: string;
  level: number;
  division: number;
  ranking_disabled: boolean;
}

export interface PlatformTime {
  total_time: number;
  daily_time: number;
  weekly_time: number;
  monthly_time: number;
  season_time: number;
  last_update: string | null;
}

export interface PlayerDetail extends PlayerSummary {
  channels: Record<Platform, string | null>;
  moveable: Record<Platform, boolean>;
  created_at: string | null;
  ranking: {
    disabled: boolean;
    disabled_at: string | null;
    disabled_reason: string | null;
  };
  platform_time: Record<Platform, PlatformTime | null>;
  activity_heatmap: Partial<
    Record<Platform, { slots: number; minutes: number }>
  >;
  login_streaks: Partial<
    Record<
      Platform,
      {
        logins: number;
        current_streak: number;
        longest_streak: number;
        last_login: string | null;
      }
    >
  >;
}

export interface AuditEntry {
  id: number;
  admin_steam_id: string;
  action: string;
  target_identifiers: Record<string, unknown>;
  summary: Record<string, unknown>;
  result_status: string;
  created_at: string | null;
}

export interface TttStatus {
  ok?: boolean;
  status?: string;
  state?: string;
  manager_state?: string;
  players?: number | { current?: number; max?: number; bots?: number };
  current_players?: number;
  max_players?: number;
  player_count?: number;
  num_players?: number;
  clients?: number;
  maxplayers?: number;
  max_clients?: number;
  map?: string;
  current_map?: string;
  map_name?: string;
  host?: string;
  port?: number;
  name?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}
