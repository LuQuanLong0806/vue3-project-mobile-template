<template>
  <div class="not-found">
    <div class="error-content">
      <van-empty 
        image="error" 
        description="页面走丢了"
        :image-size="[240, 180]"
      >
        <template #description>
          <div class="error-info">
            <div class="error-code">404</div>
            <h1 class="error-title">页面未找到</h1>
            <p class="error-description">
              抱歉，您访问的页面不存在或已被移动。
            </p>
          </div>
        </template>
      </van-empty>
      
      <div class="error-actions">
        <van-button 
          type="primary" 
          size="large" 
          icon="home-o"
          block
          @click="goHome"
        >
          返回首页
        </van-button>
        
        <van-button 
          size="large" 
          icon="arrow-left"
          hairline
          block
          @click="goBack"
        >
          返回上页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  background-color: #f7f8fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.error-content {
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.error-info {
  padding: 20px 0;
}

.error-code {
  font-size: 80px;
  font-weight: bold;
  color: #ee0a24;
  margin-bottom: 16px;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
  text-shadow: 2px 2px 4px rgba(238, 10, 36, 0.2);
}

.error-title {
  font-size: 20px;
  color: #323233;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.error-description {
  font-size: 14px;
  color: #646566;
  margin: 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  padding: 0 16px;
}

/* Vant组件样式调整 */
:deep(.van-empty) {
  padding: 40px 0 20px;
}

:deep(.van-empty__description) {
  margin-top: 20px;
}

:deep(.van-button) {
  border-radius: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 60px;
  }
  
  .error-title {
    font-size: 18px;
  }
  
  .error-description {
    font-size: 13px;
  }
  
  .error-actions {
    padding: 0 8px;
  }
}
</style>
