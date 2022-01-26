import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login.vue")
  },
  {
    path: '/texttopic',
    name: 'TextTopic',
    component: () => import("../views/TextTopic.vue")
  },
  {
    path: '/multitopic',
    name: 'MultiTopic',
    component: () => import("../views/MultiTopic.vue")
  },
  {
    path: '/user',
    name: 'User',
    component: () => import("../views/User.vue")
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import("../views/Signup.vue")
  },
  {
    path: '/topic',
    name: 'Topic',
    component: () => import("../views/Topic.vue")
  },
  {
    path: '/comment',
    name: 'Comment',
    component: () => import("../views/Comment.vue")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
