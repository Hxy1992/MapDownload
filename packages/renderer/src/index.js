import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import './style/index.scss';
import './style/maptalks.css';
import naive from './naive-ui-load';
import './utils/downloadCascadeTiles';

createApp(App)
  .use(router)
  .use(naive)
  .mount('#app');
