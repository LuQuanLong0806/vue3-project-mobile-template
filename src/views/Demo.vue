<template>
  <div class="demo-page">
    <div class="demo-container">
      <!-- 演示说明 -->
      <div class="demo-header">
        <h2 class="demo-title">原 App.vue 布局演示</h2>
        <p class="demo-desc">
          这里展示了原始的 App.vue 布局结构，包含完整的导航栏和底部标签栏功能。
        </p>
      </div>

      <!-- 模拟的应用布局 -->
      <div class="demo-app-wrapper">
        <!-- 顶部导航栏演示 -->
        <van-nav-bar 
          title="Demo - 原布局展示" 
          left-arrow
          @click-left="$router.back()"
        />

        <!-- 主要内容区域 -->
        <div class="demo-main-content">
          <div class="welcome-section">
            <h3>原 App.vue 内容展示</h3>
            <p>这是原来 App.vue 中的导航和布局结构的演示</p>
          </div>
          
          <!-- 功能展示区域 -->
          <div class="feature-showcase">
            <van-notice-bar 
              text="这里展示原App.vue的布局特性"
              left-icon="info-o"
              background="#f0f9ff"
              color="#0ea5e9"
            />
            
            <div class="demo-features">
              <van-cell-group inset>
                <van-cell title="顶部导航栏" value="van-nav-bar" />
                <van-cell title="路由视图区域" value="router-view" />
                <van-cell title="底部标签栏" value="van-tabbar" />
                <van-cell title="响应式布局" value="移动端适配" />
              </van-cell-group>
            </div>
            
            <!-- 原底部标签栏功能展示 -->
            <div class="original-tabs-demo">
              <h4>原底部标签栏功能</h4>
              <van-grid :column-num="3" :gutter="10">
                <van-grid-item 
                  icon="home-o" 
                  text="首页" 
                  @click="$router.push('/Example')"
                />
                <van-grid-item 
                  icon="apps-o" 
                  text="计数器" 
                  @click="$router.push('/counter')"
                />
                <van-grid-item 
                  icon="chart-trending-o" 
                  text="大屏适配" 
                  @click="$router.push('/bigscreen')"
                />
                <van-grid-item 
                  icon="setting-o" 
                  text="样式演示" 
                  @click="$router.push('/less')"
                />
                <van-grid-item 
                  icon="info-o" 
                  text="关于" 
                  @click="$router.push('/about')"
                />
              </van-grid>
            </div>
          </div>
        </div>

        <!-- 模拟底部标签栏 (仅展示，不实际功能) -->
        <div class="demo-tabbar">
          <van-tabbar v-model="activeDemoTab" :safe-area-inset-bottom="false">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="apps-o">计数器</van-tabbar-item>
            <van-tabbar-item icon="chart-trending-o">大屏适配</van-tabbar-item>
            <van-tabbar-item icon="setting-o">样式演示</van-tabbar-item>
            <van-tabbar-item icon="info-o">关于</van-tabbar-item>
          </van-tabbar>
        </div>
      </div>
      
      <!-- 返回提示 -->
      <div class="demo-footer">
        <van-button 
          type="primary" 
          size="large" 
          @click="$router.push('/Example')"
          round
        >
          返回首页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 演示用的底部标签栏状态
const activeDemoTab = ref(0)
</script>

<style scoped>
.demo-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding: 16px;
}

.demo-container {
  max-width: 400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.demo-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.demo-desc {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
}

.demo-app-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
}

.demo-main-content {
  padding: 16px;
  min-height: 400px;
  background-color: #f7f8fa;
}

.welcome-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
}

.welcome-section h3 {
  font-size: 18px;
  color: #323233;
  margin: 0 0 8px 0;
}

.welcome-section p {
  font-size: 14px;
  color: #646566;
  margin: 0;
}

.feature-showcase {
  margin-top: 16px;
}

.demo-features {
  margin: 16px 0;
}

.original-tabs-demo {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.original-tabs-demo h4 {
  font-size: 16px;
  color: #323233;
  margin: 0 0 16px 0;
}

.demo-tabbar {
  position: relative;
  border-top: 1px solid #eee;
}

.demo-footer {
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .demo-page {
    padding: 12px;
  }
  
  .demo-header {
    padding: 16px;
  }
  
  .demo-title {
    font-size: 18px;
  }
  
  .demo-desc {
    font-size: 13px;
  }
}
</style>
