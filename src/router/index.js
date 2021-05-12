import Vue from 'vue';
import VueRouter from 'vue-router';
import Chart from '../views/Chart.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Chart',
    component: Chart
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/Map.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
