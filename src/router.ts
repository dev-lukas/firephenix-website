// router.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import GameServer from './views/GameServer.vue';
import Ranking from './views/Ranking.vue';
import DataPrivacy from './views/DataPrivacy.vue';
import Impressum from './views/Impressum.vue';
import PlayerProfile from './views/PlayerProfile.vue';
import Login from './views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/gameserver',
    name: 'GameServer',
    component: GameServer,
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
  },
  {
    path: '/dataprivacy',
    name: 'DataPrivacy',
    component: DataPrivacy,
  },
  {
    path: '/impressum',
    name: 'Impressum',
    component: Impressum,
  },
  {
    path: '/ranking/player-:id',
    name: 'PlayerProfile',
    component: PlayerProfile,
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
