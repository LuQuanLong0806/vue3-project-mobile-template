<template>
  <div class="hello-world">
    <van-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <van-tag type="success">Vue 3</van-tag>
        </div>
      </template>
      
      <div class="welcome-content">
        <p class="greeting">{{ msg }}</p>
        <p class="description">
          这是一个基于Vue3 + TypeScript + Vite的现代化前端项目模板
        </p>
        
        <div class="stats">
          <div class="visit-counter">
            <div class="counter-title">页面访问次数</div>
            <div class="counter-value">{{ visitCount }}</div>
          </div>
          <van-button type="primary" @click="incrementVisit">
            点击增加访问次数
          </van-button>
        </div>
      </div>
    </van-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  msg: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎使用Vue3模板'
})

const visitCount = ref(0)

function incrementVisit() {
  visitCount.value++
}
</script>

<style scoped>
.hello-world {
  margin: 20px 0;
}

.welcome-card {
  max-width: 500px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  text-align: center;
}

.greeting {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 16px;
}

.description {
  color: #606266;
  margin-bottom: 24px;
  line-height: 1.6;
}

.stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.visit-counter {
  text-align: center;
}

.counter-title {
  font-size: 14px;
  color: #646566;
  margin-bottom: 8px;
}

.counter-value {
  font-size: 24px;
  font-weight: 600;
  color: #1989fa;
}
</style>
