import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/player'
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import('@/views/PlayerView.vue'),
    meta: { title: '播放页' }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/ListView.vue'),
    meta: { title: '播放列表' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 音乐播放器` : '音乐播放器'
  next()
})

export default router
