<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <van-nav-bar 
      :title="currentTitle" 
      fixed 
      placeholder
      left-arrow
      @click-left="onNavBack"
    />

    <!-- 路由视图 -->
    <div class="main-content">
      <router-view />
    </div>

    <!-- 底部标签栏 -->
    <van-tabbar v-model="activeTab" fixed placeholder @change="onTabChange">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/counter">计数器</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/bigscreen">大屏适配</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/less">样式演示</van-tabbar-item>
      <van-tabbar-item icon="info-o" to="/about">关于</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 当前页面标题
const currentTitle = computed(() => {
  return route.meta?.title as string || 'Vue3移动端应用'
})

// 底部标签栏激活状态
const activeTab = ref(0)

// 根据路径设置底部标签栏激活状态
const routeToTabMap: Record<string, number> = {
  '/': 0,
  '/counter': 1,
  '/bigscreen': 2,
  '/less': 3,
  '/about': 4
}

// 监听路由变化，更新标签栏状态
watch(() => route.path, (newPath) => {
  activeTab.value = routeToTabMap[newPath] ?? 0
}, { immediate: true })

// 导航栏返回按钮
const onNavBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// 标签栏切换
const onTabChange = (index: number) => {
  const paths = ['/', '/counter', '/bigscreen', '/less', '/about']
  if (paths[index]) {
    router.push(paths[index])
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.main-content {
  padding: 16px;
  padding-bottom: 70px; /* 为底部标签栏预留空间 */
  min-height: calc(100vh - 46px - 50px); /* 减去顶部导航栏和底部标签栏高度 */
  background-color: #f7f8fa;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
}
</style>
