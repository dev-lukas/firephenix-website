// router.ts
import type { AppRouteRecord } from './types/router';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import GameServer from './views/GameServer.vue';
import Ranking from './views/Ranking.vue';
import DataPrivacy from './views/DataPrivacy.vue';
import Impressum from './views/Impressum.vue';
import PlayerProfile from './views/PlayerProfile.vue';
import Profile from './views/Profile.vue';
import Wiki from './views/Wiki.vue';
import Gmod from './banner/Gmod.vue';

const routes: AppRouteRecord[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: Wiki,
    meta: {
      title: 'Wiki',
    },
  },
  {
    path: '/gameserver',
    name: 'GameServer',
    component: GameServer,
    meta: {
      title: 'GameServer',
    },
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
    meta: {
      title: 'Ranking',
    },
  },
  {
    path: '/dataprivacy',
    name: 'DataPrivacy',
    component: DataPrivacy,
    meta: {
      title: 'Datenschutz',
    },
  },
  {
    path: '/impressum',
    name: 'Impressum',
    component: Impressum,
    meta: {
      title: 'Impressum',
    },
  },
  {
    path: '/ranking/player-:id',
    name: 'PlayerProfile',
    component: PlayerProfile,
    props: true,
    meta: {
      title: 'Spieler Profil',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    props: true,
    meta: {
      title: 'Profil',
    },
  },
  {
    path: '/banner/gmod',
    name: 'Gmod',
    component: Gmod,
    meta: {
      title: 'Gmod',
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  document.title = `FirePhenix - ${to.meta.title || ''}`;
  next();
});

export default router;
