import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import './style/index.scss';
import './style/maptalks.css';

createApp(App)
  .use(router)
  .mount('#app');
