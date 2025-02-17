import type { RouteRecordRaw } from 'vue-router';

export type AppRouteRecord = RouteRecordRaw & {
  meta?: {
    requiresAuth?: boolean;
    title?: string;
  };
};

export interface PlayerProfileParams {
  id: string;
}
