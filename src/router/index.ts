import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于'
    }
  },
  {
    path: '/counter',
    name: 'Counter',
    component: () => import('@/views/Counter.vue'),
    meta: {
      title: '计数器示例'
    }
  },
  {
    path: '/bigscreen',
    name: 'BigScreen',
    component: () => import('@/views/BigScreen.vue'),
    meta: {
      title: '大屏适配演示'
    }
  },
  {
    path: '/less',
    name: 'LessDemo',
    component: () => import('@/views/LessDemo.vue'),
    meta: {
      title: 'Less预处理器演示'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Vue3项目模板`
  }
  next()
})

export default router
