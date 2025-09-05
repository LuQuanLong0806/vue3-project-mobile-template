<template>
  <div class="big-screen" ref="screenRef">
    <!-- 移动端大屏容器 -->
    <div class="mobile-screen-container">
      <!-- 顶部导航栏 -->
      <van-nav-bar 
        title="数据可视化" 
        fixed 
        placeholder
        left-arrow
        @click-left="$router.back()"
      >
        <template #right>
          <van-icon name="setting-o" @click="showSettings = true" />
        </template>
      </van-nav-bar>
      
      <!-- 状态信息卡片 -->
      <van-cell-group>
        <van-cell 
          title="屏幕信息" 
          :value="currentResolution"
          icon="tv-o"
        />
        <van-cell 
          title="设备类型" 
          :value="screenType"
          icon="phone-o"
        />
      </van-cell-group>
      
      <!-- 数据统计卡片 -->
      <div class="data-overview">
        <van-notice-bar 
          text="实时数据监控" 
          left-icon="volume-o"
          background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
        />
        
        <van-grid :column-num="2" :gutter="12">
          <van-grid-item 
            v-for="item in dataCards" 
            :key="item.id"
            class="data-grid-item"
          >
            <div class="data-card-mobile">
              <div class="data-header">
                <van-icon :name="item.iconName" :color="item.color" size="24" />
                <span class="data-title">{{ item.title }}</span>
              </div>
              <div class="data-content">
                <div class="data-value" :style="{ color: item.color }">
                  {{ item.value }}
                </div>
                <div class="data-unit">{{ item.unit }}</div>
                <van-tag 
                  :type="item.trend === 'up' ? 'primary' : 'warning'" 
                  size="small"
                >
                  {{ item.change }}
                </van-tag>
              </div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
      
      <!-- 图表区域 -->
      <div class="chart-section">
        <van-cell-group title="数据趋势图">
          <van-cell>
            <div class="mock-chart">
              <div class="chart-bars">
                <div 
                  class="chart-bar" 
                  v-for="(height, index) in chartData" 
                  :key="index"
                  :style="{ height: height + '%' }"
                ></div>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
        
        <van-cell-group title="系统监控">
          <van-cell 
            v-for="item in monitorData" 
            :key="item.name"
            :title="item.name"
            :value="item.value + '%'"
          >
            <template #right-icon>
              <van-circle
                :rate="item.value"
                :speed="100"
                :size="40"
                :stroke-width="3"
                :color="getProgressColor(item.value)"
                layer-color="#ebedf0"
                :text="item.value + '%'"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      
      <!-- 更新时间 -->
      <van-cell-group>
        <van-cell 
          title="最后更新" 
          :value="updateTime"
          icon="clock-o"
        />
      </van-cell-group>
    </div>
    
    <!-- 设置弹出层 -->
    <van-popup 
      v-model:show="showSettings" 
      position="bottom" 
      :style="{ height: '40%' }"
      round
    >
      <van-cell-group>
        <van-cell title="设置" size="large" />
        <van-cell title="自动刷新">
          <template #right-icon>
            <van-switch v-model="autoRefresh" size="small" />
          </template>
        </van-cell>
        <van-cell title="刷新间隔" :value="refreshInterval + '秒'" is-link />
      </van-cell-group>
      
      <div style="padding: 16px;">
        <van-button type="primary" block @click="showSettings = false">
          确认
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { showToast } from 'vant'

// 响应式数据
const screenRef = ref<HTMLElement>()
const showSettings = ref(false)
const autoRefresh = ref(true)
const refreshInterval = ref(3)
const updateTime = ref(new Date().toLocaleTimeString())

// 计算属性
const currentResolution = computed(() => {
  return `${window.innerWidth} × ${window.innerHeight}`
})

const screenType = computed(() => {
  const width = window.innerWidth
  if (width < 768) return '移动设备'
  if (width < 1024) return '平板设备' 
  return '桌面设备'
})

// 数据卡片
const dataCards = reactive([
  {
    id: 1,
    title: '在线用户',
    value: '2,847',
    unit: '人',
    change: '+12.5%',
    trend: 'up',
    color: '#1989fa',
    iconName: 'friends-o'
  },
  {
    id: 2,
    title: 'CPU使用率',
    value: '68.5',
    unit: '%',
    change: '+2.1%',
    trend: 'up',
    color: '#07c160',
    iconName: 'desktop-o'
  },
  {
    id: 3,
    title: '内存使用',
    value: '4.2',
    unit: 'GB',
    change: '-0.8%',
    trend: 'down',
    color: '#ff976a',
    iconName: 'cluster-o'
  },
  {
    id: 4,
    title: '网络流量',
    value: '156.8',
    unit: 'MB/s',
    change: '+5.2%',
    trend: 'up',
    color: '#ee0a24',
    iconName: 'exchange'
  }
])

// 图表数据
const chartData = ref([45, 68, 32, 89, 76, 54, 91, 38, 67, 85])

// 监控数据
const monitorData = reactive([
  { name: 'CPU', value: 68 },
  { name: '内存', value: 45 },
  { name: '磁盘', value: 78 },
  { name: '网络', value: 92 }
])

// 方法
function refreshData() {
  updateData()
  showToast({
    message: '数据已刷新',
    type: 'success',
    duration: 1500
  })
}

function getProgressColor(value: number) {
  if (value < 50) return '#07c160'  // 绿色
  if (value < 80) return '#ff976a'  // 橙色
  return '#ee0a24'  // 红色
}

function updateData() {
  // 模拟数据更新
  updateTime.value = new Date().toLocaleTimeString()
  
  // 更新图表数据
  chartData.value = chartData.value.map(() => Math.floor(Math.random() * 100))
  
  // 更新监控数据
  monitorData.forEach(item => {
    item.value = Math.floor(Math.random() * 100)
  })
}

// 定时更新数据
let timer: NodeJS.Timeout | null = null

onMounted(() => {
  // 启动数据更新定时器
  if (autoRefresh.value) {
    timer = setInterval(updateData, refreshInterval.value * 1000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.big-screen {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

.mobile-screen-container {
  background-color: #f7f8fa;
}

.data-overview {
  margin: 16px 0;
}

.data-grid-item {
  height: auto;
}

.data-card-mobile {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.data-title {
  font-size: 13px;
  color: #646566;
  font-weight: 500;
}

.data-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.data-unit {
  font-size: 12px;
  color: #969799;
  margin-bottom: 8px;
}

.chart-section {
  margin: 16px 0;
}

.mock-chart {
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100%;
  max-width: 240px;
  width: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #1989fa, #07c160);
  border-radius: 3px 3px 0 0;
  transition: height 0.5s ease;
  min-width: 8px;
}

/* Vant组件样式调整 */
:deep(.van-nav-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

:deep(.van-nav-bar .van-nav-bar__title) {
  color: white;
  font-weight: 600;
}

:deep(.van-nav-bar .van-icon) {
  color: white;
}

:deep(.van-cell-group) {
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-cell-group--inset) {
  margin: 16px;
}

:deep(.van-grid-item__content) {
  padding: 0;
  background: transparent;
}

:deep(.van-notice-bar) {
  margin: 16px;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.van-tag) {
  border-radius: 12px;
  font-size: 11px;
  padding: 2px 6px;
}

:deep(.van-circle__text) {
  font-size: 10px;
  font-weight: 500;
}

:deep(.van-popup) {
  border-radius: 16px 16px 0 0;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-cell__value) {
  color: #646566;
}

/* 渐变背景效果 */
:deep(.van-notice-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* 响应式适配 */
@media (max-width: 375px) {
  .data-value {
    font-size: 20px;
  }
  
  .data-title {
    font-size: 12px;
  }
  
  .mock-chart {
    height: 100px;
  }
  
  :deep(.van-cell-group) {
    margin: 12px;
  }
  
  :deep(.van-notice-bar) {
    margin: 12px;
  }
}

@media (min-width: 768px) {
  .mobile-screen-container {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
