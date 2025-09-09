<template>
  <div class="fullscreen-demo">
    <div class="demo-header">
      <h1>框架外页面演示</h1>
      <p>这个页面展示了框架外页面现在也保留了顶部导航栏</p>
    </div>

    <div class="content-sections">
      <!-- 页面特性说明 -->
      <van-cell-group inset title="页面特性">
        <van-cell title="布局模式" value="框架外全屏" />
        <van-cell title="顶部导航栏" value="已保留" />
        <van-cell title="底部标签栏" value="已隐藏" />
        <van-cell title="缓存状态" :value="isCached ? '启用' : '禁用'" />
      </van-cell-group>

      <!-- 交互演示 -->
      <van-cell-group inset title="交互演示">
        <van-cell title="计数器" :value="counter.toString()">
          <template #right-icon>
            <div style="display: flex; gap: 8px; align-items: center;">
              <van-button size="mini" @click="counter--" type="primary">-</van-button>
              <van-button size="mini" @click="counter++" type="primary">+</van-button>
            </div>
          </template>
        </van-cell>
        <van-cell title="输入内容">
          <template #value>
            <van-field v-model="inputContent" placeholder="输入一些内容" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 导航测试 -->
      <van-cell-group inset title="导航测试">
        <van-cell 
          title="返回首页" 
          label="点击返回按钮或这里返回" 
          is-link 
          @click="$router.push('/')"
        />
        <van-cell 
          title="访问大屏页面" 
          label="访问另一个框架外页面" 
          is-link 
          @click="$router.push('/bigscreen')"
        />
      </van-cell-group>

      <!-- 特性说明 -->
      <van-collapse v-model="activeNames" class="feature-notes">
        <van-collapse-item title="框架外页面改进" name="improvements">
          <div class="improvement-content">
            <h4>✨ 主要改进</h4>
            <ul>
              <li>保留了标准的顶部导航栏</li>
              <li>移除了浮动返回按钮</li>
              <li>统一的导航体验</li>
              <li>更好的视觉一致性</li>
            </ul>
            
            <h4>🎯 适用场景</h4>
            <ul>
              <li>大屏展示页面</li>
              <li>演示或展示页面</li>
              <li>全屏内容页面</li>
              <li>特殊功能页面</li>
            </ul>

            <h4>💻 技术实现</h4>
            <code>hideLayout: true</code> 的页面现在也会显示顶部导航栏
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0)
const inputContent = ref('')
const activeNames = ref([''])
const isCached = ref(false)
</script>

<style scoped>
.fullscreen-demo {
  min-height: calc(100vh - 46px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 0;
  margin: -16px;
  overflow: hidden;
}

.demo-header {
  text-align: center;
  padding: 40px 20px 20px;
  color: white;
  position: relative;
  z-index: 2;
}

.demo-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-header p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

.content-sections {
  padding: 20px;
  position: relative;
  z-index: 2;
}

.content-sections > * {
  margin-bottom: 16px;
}

.content-sections > *:last-child {
  margin-bottom: 0;
}

.feature-notes {
  margin-top: 20px;
}

.improvement-content {
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.improvement-content h4 {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #1989fa;
}

.improvement-content h4:first-child {
  margin-top: 0;
}

.improvement-content ul {
  margin: 8px 0 16px 0;
  padding-left: 20px;
}

.improvement-content li {
  margin: 6px 0;
  line-height: 1.5;
}

.improvement-content code {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  color: #e83e8c;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 5%;
  animation: float 4s ease-in-out infinite reverse;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  right: 30%;
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.van-cell) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-field__control) {
  text-align: right;
}

:deep(.van-collapse) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .demo-header {
    padding: 30px 16px 16px;
  }
  
  .demo-header h1 {
    font-size: 24px;
  }
  
  .demo-header p {
    font-size: 14px;
  }
  
  .content-sections {
    padding: 16px;
  }
}
</style>
