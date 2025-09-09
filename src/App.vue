<template>
  <div id="app">
    <!-- 框架内页面布局 -->
    <template v-if="!hideLayout">
      <!-- 顶部导航栏 - 仅在非首页显示返回按钮 -->
      <van-nav-bar 
        :title="currentTitle" 
        fixed 
        placeholder
        :left-arrow="!isHomePage"
        @click-left="onNavBack"
        class="app-nav"
      />

      <!-- 路由视图 - 框架内 -->
      <div class="main-content">
        <router-view v-slot="{ Component, route }">
          <!-- Vue3 推荐方式：基于路由名称缓存 -->
          <keep-alive :include="cachedViews">
            <component 
              :is="Component" 
              :key="route.name"
              v-if="route.meta?.keepAlive !== false"
            />
          </keep-alive>
          <!-- 不缓存的组件使用完整路径作为key -->
          <component 
            :is="Component" 
            :key="route.fullPath"
            v-if="route.meta?.keepAlive === false"
          />
        </router-view>
      </div>

      <!-- 底部标签栏 -->
      <van-tabbar 
        v-model="activeTab" 
        fixed 
        placeholder 
        safe-area-inset-bottom
        class="app-tabbar"
      >
        <van-tabbar-item icon="home-o" to="/">
          首页
        </van-tabbar-item>
        <van-tabbar-item icon="apps-o" to="/counter">
          场景
        </van-tabbar-item>
        <van-tabbar-item icon="chart-trending-o" to="/bigscreen">
          产品
        </van-tabbar-item>
        <!-- <van-tabbar-item icon="setting-o" to="/less">
          样式
        </van-tabbar-item> -->
        <van-tabbar-item icon="info-o" to="/about">
          我的
        </van-tabbar-item>
      </van-tabbar>
    </template>

    <!-- 框架外页面布局 -->
    <template v-else>
      <!-- 顶部导航栏 - 框架外页面也保留 -->
      <van-nav-bar 
        :title="currentTitle" 
        fixed 
        placeholder
        left-arrow
        @click-left="onNavBack"
        class="fullscreen-nav"
      />
      
      <!-- 路由视图 - 框架外（全屏但保留导航栏） -->
      <div class="fullscreen-content">
        <router-view v-slot="{ Component, route }">
          <!-- 框架外页面的缓存控制 -->
          <keep-alive :include="cachedViews">
            <component 
              :is="Component" 
              :key="route.name"
              v-if="route.meta?.keepAlive !== false"
            />
          </keep-alive>
          <!-- 不缓存的组件（如全屏页面） -->
          <component 
            :is="Component" 
            :key="route.fullPath"
            v-if="route.meta?.keepAlive === false"
          />
        </router-view>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCacheStore } from '@/stores/cache'

const route = useRoute()
const router = useRouter()
const cacheStore = useCacheStore()

// 当前页面标题
const currentTitle = computed(() => {
  return route.meta?.title as string || 'Vue3移动端应用'
})

// 缓存的视图列表
const cachedViews = computed(() => cacheStore.cachedViews)

// 是否为首页
const isHomePage = computed(() => {
  return route.path === '/'
})

// 是否隐藏布局（框架外显示）
const hideLayout = computed(() => {
  return route.meta?.hideLayout === true
})

// 底部标签栏激活状态
const activeTab = ref(0)

// 根据路径设置底部标签栏激活状态
const routeToTabMap: Record<string, number> = {
  '/': 0,
  '/counter': 1,
  '/bigscreen': 2, // 保留映射，但大屏页面实际不显示标签栏
  '/about': 3
}

// 监听路由变化，更新标签栏状态和缓存管理
watch(() => route, (to, from) => {
  // 更新标签栏状态
  activeTab.value = routeToTabMap[to.path] ?? 0
  
  // 处理缓存逻辑
  cacheStore.handleRouteChange(to, from || {})
}, { immediate: true, deep: true })

// 导航栏返回按钮
const onNavBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f7f8fa;
  position: relative;
}

.app-nav {
  z-index: 1000;
}

.main-content {
  padding: 16px;
  padding-bottom: 80px; /* 为底部标签栏预留更多空间 */
  min-height: calc(100vh - 46px - 60px); /* 减去顶部导航栏和底部标签栏高度 */
  background-color: #f7f8fa;
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 全屏内容样式（框架外显示但保留导航栏） */
.fullscreen-content {
  width: 100%;
  min-height: calc(100vh - 46px); /* 减去顶部导航栏高度 */
  background-color: #f7f8fa;
  overflow: auto;
  position: relative;
  padding: 16px;
  /* 禁用系统默认的下拉刷新 */
  overscroll-behavior-y: contain;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  box-sizing: border-box;
}

/* 框架外页面导航栏样式 */
.fullscreen-nav {
  z-index: 1000;
}

/* 确保框架外页面的导航栏也有相同的样式 */
:deep(.fullscreen-nav .van-nav-bar) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.fullscreen-nav .van-nav-bar__title) {
  font-weight: 600;
  color: #323233;
}

/* 全屏页面的路由视图内容样式 */
.fullscreen-content > * {
  width: 100%;
}

.app-tabbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 2000 !important;
}

/* 优化底部标签栏样式 */
:deep(.van-tabbar-item) {
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

:deep(.van-tabbar-item--active) {
  color: #1989fa;
}

:deep(.van-tabbar-item__text) {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
  margin-bottom: 2px;
}

/* 确保标签栏不会被其他元素覆盖 */
:deep(.van-tabbar) {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

/* 防止标签栏内容溢出 */
:deep(.van-tabbar-item__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

/* 导航栏样式优化 */
:deep(.van-nav-bar) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.van-nav-bar__title) {
  font-weight: 600;
  color: #323233;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
    padding-bottom: 75px; /* 移动端增加更多底部空间 */
  }
  
  .fullscreen-content {
    /* 移动端全屏内容优化 */
    padding: 12px;
    min-height: calc(100vh - 46px);
  }
  
  :deep(.van-tabbar-item__text) {
    font-size: 11px;
  }
  
  :deep(.van-tabbar-item__icon) {
    font-size: 18px;
  }
  
  .app-tabbar {
    /* 确保在移动端也固定在底部 */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

/* 处理 iOS 安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .main-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
  
  .app-tabbar {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 处理 Android 导航栏 */
@media (max-height: 640px) {
  .main-content {
    padding-bottom: 85px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 500px) {
  .main-content {
    padding-bottom: 65px;
  }
  
  .fullscreen-content {
    /* 横屏时适配导航栏高度 */
    min-height: calc(100vh - 46px);
    overflow: auto;
  }
  
  :deep(.van-tabbar-item__text) {
    font-size: 10px;
  }
  
  :deep(.van-tabbar-item__icon) {
    font-size: 16px;
  }
}

/* 平滑过渡效果 */
* {
  box-sizing: border-box;
}
</style>
