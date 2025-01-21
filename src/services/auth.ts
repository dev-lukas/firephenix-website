import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    steamId: null,
    isAuthenticated: false,
  }),
  actions: {
    checkAuth() {
      return fetch('/api/auth/check')
        .then((response) => response.json())
        .then((data) => {
          this.isAuthenticated = data.authenticated;
          this.steamId = data.steam_id;
          return this.isAuthenticated;
        });
    },
  },
});
