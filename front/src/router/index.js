import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login.vue"),
    meta: {
      title:'Accueil',
    }
  },
  {
    path: '/texttopic',
    name: 'TextTopic',
    component: () => import("../views/TextTopic.vue"),
    meta: {
      title:'Forum',
    }
  },
  {
    path: '/multitopic',
    name: 'MultiTopic',
    component: () => import("../views/MultiTopic.vue"),
    meta: {
      title:'Forum',
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import("../views/User.vue"),
    meta: {
      title:'Utilisateur',
    }
  },
  {
    path: '/topic',
    name: 'Topic',
    component: () => import("../views/Topic.vue"),
    meta: {
      title:'Forum',
    }
  },
  {
    path: '/comment/:id',
    name: 'Comment',
    component: () => import("../views/Comment.vue"),
    meta: {
      title:'Discussion X',
    }
  },
  {
    path: '/edituser',
    name: 'EditUser',
    component: () => import("../views/EditUser.vue"),
    meta: {
      title:'Utilisateur X ',
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router
