import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useFavicon } from '@vueuse/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './assets/css/variables.css';
import {
  faUsers,
  faSignal,
  faMap,
  faClock,
  faServer,
  faCodeBranch,
  faGlobe,
  faPlay,
  faCopy,
  faStar,
  faSync,
  faFire,
  faSearch,
  faTrophy,
  faExclamationCircle,
  faCalendarAlt,
  faCalendarWeek,
  faInfoCircle,
  faLock,
  faCheckCircle,
  faSquarePollVertical,
  faSignInAlt,
  faCalendarDay,
  faDownload,
  faPuzzlePiece,
  faQuestionCircle,
  faRankingStar,
  faChartSimple,
  faPersonRifle,
  faTriangleExclamation,
  faPalette,
  faGavel,
  faCog,
  faPlus,
  faFileAlt,
  faCookieBite,
  faShieldAlt,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const icon = useFavicon();
icon.value = new URL('./assets/images/phoenix_icon.png', import.meta.url).href;

library.add(
  faUsers,
  faSignal,
  faMap,
  faClock,
  faServer,
  faCodeBranch,
  faGlobe,
  faPlay,
  faCopy,
  faStar,
  faSync,
  faFire,
  faSearch,
  faTrophy,
  faCalendarAlt,
  faCalendarWeek,
  faInfoCircle,
  faExclamationCircle,
  faLock,
  faCheckCircle,
  faPlus,
  faSignInAlt,
  faCalendarDay,
  faDownload,
  faPuzzlePiece,
  faQuestionCircle,
  faTriangleExclamation,
  faCookieBite,
  faShieldAlt,
  faTimes,
  faCheck,
  faRankingStar,
  faChartSimple,
  faPersonRifle,
  faPalette,
  faGavel,
  faFileAlt,
  faCog,
  faSquarePollVertical
);

const app = createApp(App);
app.use(createPinia());
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
