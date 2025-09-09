<template>
  <div class="cache-demo">
    <div class="header">
      <h2>Vue3 路由缓存演示</h2>
      <p>这个页面演示了Vue3中路由缓存的工作原理</p>
    </div>

    <div class="demo-sections">
      <!-- 缓存状态显示 -->
      <van-cell-group inset title="当前页面缓存状态">
        <van-cell title="页面是否被缓存" :value="isCached() ? '是' : '否'">
          <template #icon>
            <van-icon 
              :name="isCached() ? 'success' : 'cross'" 
              :color="isCached() ? '#07c160' : '#ee0a24'" 
            />
          </template>
        </van-cell>
        <van-cell title="激活次数" :value="activatedCount + ' 次'" />
        <van-cell title="创建时间" :value="createdTime" />
        <van-cell title="最后激活时间" :value="lastActivatedTime" />
      </van-cell-group>

      <!-- 计数器演示 -->
      <van-cell-group inset title="状态保持演示">
        <van-cell title="计数器值" :value="counter.toString()">
          <template #right-icon>
            <div style="display: flex; gap: 8px;">
              <van-button size="mini" @click="counter--">-</van-button>
              <van-button size="mini" @click="counter++">+</van-button>
            </div>
          </template>
        </van-cell>
        <van-cell title="输入框内容">
          <template #value>
            <van-field v-model="inputValue" placeholder="输入一些内容" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 缓存控制 -->
      <van-cell-group inset title="缓存控制">
        <van-cell title="启用页面缓存" :value="isCached() ? '已启用' : '已禁用'">
          <template #right-icon>
            <van-switch 
              :model-value="isCached()" 
              @update:model-value="toggleCache"
            />
          </template>
        </van-cell>
        <van-cell title="刷新当前页面缓存" is-link @click="refreshPageCache">
          <template #icon>
            <van-icon name="refresh" color="#1989fa" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 导航测试 -->
      <van-cell-group inset title="缓存测试">
        <van-cell 
          title="访问其他页面后返回" 
          label="离开此页面再返回，观察状态是否保持"
          is-link 
          @click="$router.push('/about')"
        />
        <van-cell 
          title="访问不缓存的页面" 
          label="访问大屏页面（每次都重新渲染）"
          is-link 
          @click="$router.push('/bigscreen')"
        />
      </van-cell-group>

      <!-- 技术说明 -->
      <van-collapse v-model="activeNames" class="technical-notes">
        <van-collapse-item title="Vue3 缓存技术要点" name="tech">
          <div class="tech-content">
            <h4>1. 缓存识别方式</h4>
            <code>:key="route.name"</code> - 基于路由名称
            
            <h4>2. 条件缓存</h4>
            <code>v-if="route.meta?.keepAlive !== false"</code>
            
            <h4>3. 生命周期钩子</h4>
            <ul>
              <li><code>onActivated()</code> - 组件激活时</li>
              <li><code>onDeactivated()</code> - 组件失活时</li>
            </ul>
            
            <h4>4. 与Vue2的区别</h4>
            <p>Vue2依赖组件name，Vue3可以使用路由name，更灵活</p>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { useCache } from '@/composables/useCache'
import { showSuccessToast } from 'vant'

// 页面状态
const counter = ref(0)
const inputValue = ref('')
const activatedCount = ref(0)
const createdTime = ref('')
const lastActivatedTime = ref('')
const activeNames = ref([''])

// 使用缓存管理
const { isCached, refresh, enable, disable } = useCache({
  key: 'CacheDemo',
  onActivated: () => {
    console.log('🔄 CacheDemo页面被激活（自定义回调）')
  },
  onDeactivated: () => {
    console.log('💤 CacheDemo页面被失活（自定义回调）')
  }
})

// 组件创建时记录时间
onMounted(() => {
  createdTime.value = new Date().toLocaleTimeString()
  console.log('🎉 CacheDemo组件被创建')
  
  // 确保页面被添加到缓存
  setTimeout(() => {
    enable()
  }, 100) // 延迟一点确保路由完全加载
})

// 页面激活时的额外处理
onActivated(() => {
  console.log('📱 Vue的onActivated钩子被调用')
  // 页面激活时更新激活次数（这个会在每次从缓存恢复时调用）
  activatedCount.value++
  lastActivatedTime.value = new Date().toLocaleTimeString()
})

// 页面失活时的额外处理
onDeactivated(() => {
  console.log('📱 Vue的onDeactivated钩子被调用')
})

// 切换缓存状态
const toggleCache = (enabled: boolean) => {
  if (enabled) {
    enable()
    showSuccessToast('已启用页面缓存')
  } else {
    disable()
    showSuccessToast('已禁用页面缓存')
  }
}

// 刷新页面缓存
const refreshPageCache = () => {
  refresh()
  showSuccessToast('页面缓存已刷新')
}
</script>

<style scoped>
.cache-demo {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.demo-sections > * {
  margin-bottom: 16px;
}

.demo-sections > *:last-child {
  margin-bottom: 0;
}

.technical-notes {
  margin-top: 20px;
}

.tech-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tech-content h4 {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #1989fa;
}

.tech-content h4:first-child {
  margin-top: 0;
}

.tech-content code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
}

.tech-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.tech-content li {
  margin: 4px 0;
}

.tech-content p {
  margin: 8px 0;
  line-height: 1.6;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-field__control) {
  text-align: right;
}
</style>
