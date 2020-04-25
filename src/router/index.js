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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/coursework',
    name: 'coursework',
    component: () => import('../views/coursework/Coursework.vue'),
  },
  {
    path: '/coursework/:coursework?',
    name: 'courseworkView',
    component: () => import('../views/coursework/CourseworkView.vue'),
    children: [
      {
        path: '/edit',
        name: 'courseworkEdit',
        component: () => import('../views/coursework/CourseworkEdit.vue'),
      },
      {
        path: '/milestone/:milestone?',
        name: 'milestoneView',
        component: () => import('../views/coursework/milestone/MilestoneView.vue'),
        children: [
          {
            path: '/edit',
            name: 'milestoneEdit',
            component: () => import('../views/coursework/milestone/MilestoneEdit.vue'),
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
