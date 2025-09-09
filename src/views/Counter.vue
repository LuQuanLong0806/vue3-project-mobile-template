<template>
  <div class="counter">
    <van-cell-group>
      <van-cell 
        title="计数器示例" 
        value="Pinia状态管理演示"
        icon="orders-o"
        size="large"
      />
    </van-cell-group>
    
    <div class="counter-display">
      <div class="count-value">{{ count }}</div>
      <div class="count-info">
        <van-tag :type="isEven ? 'success' : 'warning'" size="large">
          {{ isEven ? '偶数' : '奇数' }}
        </van-tag>
        <van-tag type="primary" size="large">
          双倍值: {{ doubleCount }}
        </van-tag>
      </div>
    </div>
    
    <div class="counter-controls">
      <van-button 
        type="danger" 
        @click="decrement"
        :disabled="count <= 0"
        size="large"
        icon="minus"
        block
      >
        减少
      </van-button>
      
      <van-button 
        type="primary" 
        @click="increment"
        size="large"
        icon="plus"
        block
      >
        增加
      </van-button>
    </div>
    
    <div class="counter-actions">
      <van-button 
        @click="reset" 
        size="large"
        icon="replay"
        hairline
        block
      >
        重置
      </van-button>
      
      <van-button 
        @click="showSetDialog = true" 
        size="large"
        icon="edit"
        type="default"
        hairline
        block
      >
        设置值
      </van-button>
    </div>
    
    <!-- 设置数值对话框 -->
    <van-dialog
      v-model:show="showSetDialog"
      title="设置计数器值"
      show-cancel-button
      @confirm="handleSetCount"
    >
      <div class="dialog-content">
        <van-field
          v-model="newValue"
          type="number"
          label="新值"
          placeholder="请输入新的计数器值"
          :rules="[{ required: true, message: '请输入值' }]"
        />
        <van-slider 
          v-model="newValue" 
          :min="0" 
          :max="100" 
          style="margin: 20px 0;"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores'
import { showToast } from 'vant'

const counterStore = useCounterStore()
// 使用 storeToRefs 保持响应性
const { count, doubleCount, isEven } = storeToRefs(counterStore)
// 方法可以直接解构
const { increment, decrement, reset, setCount } = counterStore

const showSetDialog = ref(false)
const newValue = ref(0)

// 监听count变化，同步更新newValue
watch(() => count.value, (val) => {
  newValue.value = val
}, { immediate: true })

function handleSetCount() {
  setCount(newValue.value)
  showSetDialog.value = false
  showToast({
    message: `计数器已设置为 ${newValue.value}`,
    type: 'success'
  })
}
</script>

<style scoped>
.counter {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

.counter-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 40px 20px;
  margin: 16px 0;
  border-radius: 12px;
}

.count-value {
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.count-info {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.counter-controls {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

.counter-controls .van-button {
  flex: 1;
}

.counter-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.dialog-content {
  padding: 16px;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell) {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-cell__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.van-cell__value) {
  color: #666;
  font-size: 14px;
}

:deep(.van-tag) {
  border-radius: 16px;
  font-weight: 500;
}

:deep(.van-button) {
  border-radius: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .count-value {
    font-size: 48px;
  }
  
  .counter-display {
    padding: 30px 16px;
  }
  
  .count-info {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
