import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App.vue';
import router from './router';
import ThousandsComma from './filters/thousandsComma.js';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.filter('ThousandsComma', ThousandsComma);
Vue.component('Loading', Loading);
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
