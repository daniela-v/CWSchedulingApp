import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/courseworks',
    name: 'coursework',
    component: () => import('../views/coursework/Coursework.vue'),
  },
  {
    path: '/courseworks/:coursework?',
    name: 'courseworkView',
    component: () => import('../views/coursework/CourseworkView.vue'),
    children: [
      {
        path: 'edit',
        name: 'courseworkEdit',
        component: () => import('../views/coursework/CourseworkEdit.vue'),
      },
      {
        path: 'milestones',
        redirect: (to) => ({ name: 'courseworkView', params: to.params, query: { tab: 'milestones', ...to.query } }),
      },
      {
        path: 'milestones/create',
        name: 'milestoneCreate',
        component: () => import('../views/coursework/milestone/MilestoneCreate.vue'),
      },
      {
        path: 'milestones/:milestoneId?/edit',
        name: 'milestoneEdit',
        component: () => import('../views/coursework/milestone/MilestoneEdit.vue'),
      },
    ],
  },
  {
    path: '*',
    name: 'home',
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
