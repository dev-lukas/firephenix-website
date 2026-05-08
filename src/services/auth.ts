import { defineStore } from 'pinia';

interface AuthState {
  steamId: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    steamId: null,
    csrfToken: null,
    isAuthenticated: false,
    isAdmin: false,
  }),
  actions: {
    async checkAuth() {
      const response = await fetch('/api/auth/check', {
        credentials: 'same-origin',
      });
      const data = await response.json();
      this.isAuthenticated = data.authenticated;
      this.steamId = data.steam_id;
      this.csrfToken = data.csrf_token;
      this.isAdmin = Boolean(data.is_admin);
      return this.isAuthenticated;
    },
    csrfHeaders(): Record<string, string> {
      return this.csrfToken ? { 'X-CSRF-Token': this.csrfToken } : {};
    },
  },
});
