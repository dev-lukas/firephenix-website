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
  faSearch,
  faTrophy,
  faExclamationCircle,
  faCalendarAlt,
  faCalendarWeek,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const icon = useFavicon();
icon.value = 'src/assets/images/phoenix_icon.png';

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
  faSearch,
  faTrophy,
  faCalendarAlt,
  faCalendarWeek,
  faInfoCircle,
  faExclamationCircle
);

const app = createApp(App);
app.use(createPinia());
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
