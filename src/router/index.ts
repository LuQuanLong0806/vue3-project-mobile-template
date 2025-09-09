import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HOME.vue'),
    meta: {
      title: '首页',
      keepAlive: true, // 启用缓存
      cacheKey: 'home' // 缓存键名
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于',
      keepAlive: true, // 启用缓存
      cacheKey: 'about'
    }
  },
  {
    path: '/counter',
    name: 'Counter',
    component: () => import('@/views/Counter.vue'),
    meta: {
      title: '计数器示例',
      keepAlive: true, // 启用缓存
      cacheKey: 'counter'
    }
  },
  {
    path: '/bigscreen',
    name: 'BigScreen',
    component: () => import('@/views/BigScreen.vue'),
    meta: {
      title: '大屏适配演示',
      hideLayout: true, // 大屏页面在框架外展示
      keepAlive: false, // 大屏页面不缓存，每次重新渲染
      cacheKey: 'big-screen'
    }
  },
  {
    path: '/less',
    name: 'LessDemo',
    component: () => import('@/views/LessDemo.vue'),
    meta: {
      title: 'Less预处理器演示',
      keepAlive: true, // 启用缓存
      cacheKey: 'less-demo'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo.vue'),
    meta: {
      title: '原布局演示',
      hideLayout: true, // 演示页面在框架外展示
      keepAlive: false, // 演示页面不缓存
      cacheKey: 'demo'
    }
  },
  {
    path: '/cache-manager',
    name: 'CacheManager',
    component: () => import('@/views/CacheManager.vue'),
    meta: {
      title: '缓存管理',
      keepAlive: false, // 缓存管理页面不需要缓存，保持数据实时性
      cacheKey: 'cache-manager'
    }
  },
  {
    path: '/cache-demo',
    name: 'CacheDemo',
    component: () => import('@/views/CacheDemo.vue'),
    meta: {
      title: '缓存演示',
      keepAlive: true, // 启用缓存用于演示
      cacheKey: 'cache-demo'
    }
  },
  {
    path: '/fullscreen-demo',
    name: 'FullscreenDemo',
    component: () => import('@/views/FullscreenDemo.vue'),
    meta: {
      title: '框架外页面演示',
      hideLayout: true, // 框架外显示但保留导航栏
      keepAlive: false, // 每次重新渲染
      cacheKey: 'fullscreen-demo'
    }
  },
  {
    path: '/storage-demo',
    name: 'StorageDemo',
    component: () => import('@/views/StorageDemo.vue'),
    meta: {
      title: 'TypeScript存储演示',
      keepAlive: true, // 启用缓存用于演示
      cacheKey: 'storage-demo'
    }
  },
  {
    path: '/env-demo',
    name: 'EnvDemo',
    component: () => import('@/views/EnvDemo.vue'),
    meta: {
      title: '多环境配置演示',
      keepAlive: true,
      cacheKey: 'env-demo'
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
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 南京场景服务平台`
  }
  next()
})

export default router
