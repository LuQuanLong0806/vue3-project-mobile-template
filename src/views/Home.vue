<template>
  <div class="home">
    <div class="welcome-section">
      <h1 class="page-title">欢迎使用Vue3移动端应用</h1>
      <p class="description">
        这是一个现代化的Vue3移动端项目模板，使用Vant UI组件库，适配移动端开发。
      </p>
    </div>
    
    <div class="features">
      <van-notice-bar 
        text="主要特性"
        left-icon="volume-o"
        mode="closeable"
        background="#fff7e6"
        color="#ed6a0c"
      />
      
      <div class="feature-grid">
        <van-card
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :desc="feature.description"
          :thumb="feature.icon"
          class="feature-card"
        />
      </div>
    </div>
    
    <div class="actions">
      <van-grid :column-num="2" :gutter="10">
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
          icon="apps-o" 
          text="计数器" 
          @click="$router.push('/counter')"
        />
        <van-grid-item 
          icon="info-o" 
          text="关于项目" 
          @click="$router.push('/about')"
        />
      </van-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Vue 3',
    description: '最新的Vue3框架，支持Composition API和更好的TypeScript集成',
    icon: 'https://via.placeholder.com/48x48/42b883/ffffff?text=V'
  },
  {
    title: 'TypeScript',
    description: '强类型支持，提供更好的开发体验和代码质量',
    icon: 'https://via.placeholder.com/48x48/3178c6/ffffff?text=TS'
  },
  {
    title: 'Vant UI',
    description: '轻量、可靠的移动端Vue组件库',
    icon: 'https://via.placeholder.com/48x48/07c160/ffffff?text=VA'
  },
  {
    title: 'Vite',
    description: '极速的构建工具，提供快速的热更新和优化的构建',
    icon: 'https://via.placeholder.com/48x48/646cff/ffffff?text=VT'
  },
  {
    title: '移动端适配',
    description: '基于PostCSS的响应式移动端适配方案，支持px转vw',
    icon: 'https://via.placeholder.com/48x48/ff6b35/ffffff?text=M'
  },
  {
    title: 'Pinia状态管理',
    description: '新一代的Vue状态管理库，简单易用',
    icon: 'https://via.placeholder.com/48x48/ffd859/ffffff?text=P'
  }
]
</script>

<style scoped>
.home {
  background-color: #f7f8fa;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 16px;
  text-align: center;
  margin: -16px -16px 16px -16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
}

.features {
  margin-bottom: 16px;
}

.feature-grid {
  margin-top: 16px;
}

.feature-card {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.actions {
  margin-top: 16px;
}

/* Vant组件样式调整 */
:deep(.van-grid-item__content) {
  padding: 24px 16px;
  background-color: white;
  border-radius: 8px;
}

:deep(.van-grid-item__icon) {
  font-size: 28px;
  color: #1989fa;
}

:deep(.van-grid-item__text) {
  font-size: 14px;
  color: #323233;
  margin-top: 8px;
}

:deep(.van-card) {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 20px 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .description {
    font-size: 13px;
  }
}
</style>
