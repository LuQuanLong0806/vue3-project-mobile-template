<template>
  <div class="storage-demo">
    <div class="header">
      <h2>本地存储 TypeScript 演示</h2>
      <p>展示重构后的 MyLocalStorage 类的功能</p>
    </div>

    <div class="demo-sections">
      <!-- 基础操作演示 -->
      <van-cell-group inset title="基础操作">
        <van-cell title="存储文本数据">
          <template #value>
            <div class="input-group">
              <van-field v-model="textData" placeholder="输入文本" />
              <van-button size="mini" @click="saveText" type="primary">保存</van-button>
            </div>
          </template>
        </van-cell>
        <van-cell title="获取文本数据" :value="savedText || '暂无数据'" />
        
        <van-cell title="用户信息对象">
          <template #value>
            <van-button size="mini" @click="saveUserInfo" type="primary">保存示例用户</van-button>
          </template>
        </van-cell>
        <van-cell title="用户姓名" :value="userInfo?.name || '暂无'" />
        <van-cell title="用户邮箱" :value="userInfo?.email || '暂无'" />
      </van-cell-group>

      <!-- 高级功能演示 -->
      <van-cell-group inset title="高级功能">
        <van-cell title="带过期时间的数据">
          <template #value>
            <van-button size="mini" @click="saveWithExpiry" type="warning">保存（10秒过期）</van-button>
          </template>
        </van-cell>
        <van-cell title="过期数据状态" :value="expiryData || '已过期或不存在'" />
        
        <van-cell title="嵌套路径存储">
          <template #value>
            <van-button size="mini" @click="saveNestedData" type="success">保存嵌套数据</van-button>
          </template>
        </van-cell>
        <van-cell title="应用主题" :value="appTheme || '默认'" />
        <van-cell title="应用语言" :value="appLanguage || '默认'" />
      </van-cell-group>

      <!-- 存储统计 -->
      <van-cell-group inset title="存储统计">
        <van-cell title="数据大小" :value="stats.size + ' 字节'" />
        <van-cell title="数据条目" :value="stats.count + ' 个'" />
        <van-cell title="存储模式" :value="stats.usingMemory ? '内存存储' : '持久化存储'" />
        <van-cell title="所有键名">
          <template #value>
            <van-button size="mini" @click="showAllKeys" type="default">查看键名</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 操作按钮 -->
      <van-cell-group inset title="操作">
        <van-cell title="刷新数据" is-link @click="refreshData" />
        <van-cell title="生成UUID" is-link @click="generateNewUUID" />
        <van-cell title="清空演示数据" is-link @click="showClearDialog" />
      </van-cell-group>

      <!-- UUID演示 -->
      <van-cell-group inset title="UUID生成">
        <van-cell title="标准UUID" :value="standardUUID" />
        <van-cell title="短UUID" :value="shortUUID" />
        <van-cell title="自定义UUID" :value="customUUID" />
      </van-cell-group>

      <!-- 技术说明 -->
      <van-collapse v-model="activeNames" class="tech-notes">
        <van-collapse-item title="TypeScript 重构亮点" name="highlights">
          <div class="highlight-content">
            <h4>🎯 主要改进</h4>
            <ul>
              <li><strong>完整的类型定义</strong> - 所有接口和类型声明</li>
              <li><strong>泛型支持</strong> - 类型安全的数据操作</li>
              <li><strong>现代化语法</strong> - ES6+ 和 TypeScript 最佳实践</li>
              <li><strong>增强的错误处理</strong> - 更完善的异常处理</li>
              <li><strong>调试支持</strong> - 可选的调试模式</li>
              <li><strong>扩展功能</strong> - 统计、过期检查等新特性</li>
            </ul>

            <h4>🔧 新增功能</h4>
            <ul>
              <li>自动过期检查和清理</li>
              <li>嵌套路径支持（如 'user.profile.name'）</li>
              <li>存储统计和监控</li>
              <li>Cookie 备份机制</li>
              <li>内存存储降级</li>
            </ul>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 对话框 -->
    <van-dialog
      v-model:show="showKeys"
      title="所有存储键名"
      :message="allKeysText"
      confirm-button-text="确定"
    />

    <van-dialog
      v-model:show="clearDialog"
      title="确认清空"
      message="确定要清空所有演示数据吗？"
      show-cancel-button
      @confirm="clearDemoData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storage, generateUUID } from '@/utils/db'
import { showToast } from 'vant'

// 响应式数据
const textData = ref('')
const savedText = ref('')
const userInfo = ref<{ name: string; email: string; id: string } | null>(null)
const expiryData = ref('')
const appTheme = ref('')
const appLanguage = ref('')
const activeNames = ref([''])

// UUID数据
const standardUUID = ref('')
const shortUUID = ref('')
const customUUID = ref('')

// 对话框状态
const showKeys = ref(false)
const clearDialog = ref(false)

// 存储统计
const stats = ref({
  size: 0,
  count: 0,
  usingMemory: false
})

// 所有键名
const allKeys = ref<string[]>([])

// 计算属性
const allKeysText = computed(() => {
  return allKeys.value.length > 0 
    ? allKeys.value.join('\n') 
    : '暂无存储数据'
})

// 保存文本数据
const saveText = () => {
  if (!textData.value.trim()) {
    showToast('请输入文本内容')
    return
  }
  
  const success = storage.set('demo.text', textData.value)
  if (success) {
    showToast('文本保存成功')
    refreshData()
  } else {
    showToast('保存失败')
  }
}

// 保存用户信息
const saveUserInfo = () => {
  const user = {
    id: generateUUID(),
    name: '张三',
    email: 'zhangsan@example.com'
  }
  
  const success = storage.set('demo.user', user)
  if (success) {
    showToast('用户信息保存成功')
    refreshData()
  } else {
    showToast('保存失败')
  }
}

// 保存带过期时间的数据
const saveWithExpiry = () => {
  const expiryTime = Date.now() + 10 * 1000 // 10秒后过期
  const success = storage.set('demo.expiry', '这是一条临时数据', {
    expires: expiryTime,
    tag: 'temporary'
  })
  
  if (success) {
    showToast('临时数据已保存（10秒后过期）')
    refreshData()
  }
}

// 保存嵌套数据
const saveNestedData = () => {
  storage.set('demo.app.theme', 'dark')
  storage.set('demo.app.language', 'zh-CN')
  showToast('嵌套数据保存成功')
  refreshData()
}

// 生成新的UUID
const generateNewUUID = () => {
  standardUUID.value = generateUUID()
  shortUUID.value = generateUUID({ length: 8 })
  customUUID.value = generateUUID({ length: 12, radix: 16 })
  showToast('UUID已重新生成')
}

// 显示所有键名
const showAllKeys = () => {
  allKeys.value = storage.getAllKeys().filter(key => key.startsWith('demo.'))
  showKeys.value = true
}

// 显示清空对话框
const showClearDialog = () => {
  clearDialog.value = true
}

// 清空演示数据
const clearDemoData = () => {
  const demoKeys = storage.getAllKeys().filter(key => key.startsWith('demo.'))
  storage.remove(demoKeys)
  showToast('演示数据已清空')
  refreshData()
}

// 刷新所有数据
const refreshData = () => {
  // 获取文本数据
  savedText.value = storage.get<string>('demo.text') as string || ''
  
  // 获取用户信息
  userInfo.value = storage.get<{ name: string; email: string; id: string }>('demo.user') as { name: string; email: string; id: string } | null
  
  // 获取过期数据
  expiryData.value = storage.get<string>('demo.expiry') as string || ''
  
  // 获取嵌套数据
  appTheme.value = storage.get<string>('demo.app.theme') as string || ''
  appLanguage.value = storage.get<string>('demo.app.language') as string || ''
  
  // 获取存储统计
  stats.value = storage.getStorageStats()
}

// 页面加载时初始化数据
onMounted(() => {
  refreshData()
  generateNewUUID()
})
</script>

<style scoped>
.storage-demo {
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

.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-group .van-field {
  flex: 1;
}

.tech-notes {
  margin-top: 20px;
}

.highlight-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.highlight-content h4 {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #1989fa;
}

.highlight-content h4:first-child {
  margin-top: 0;
}

.highlight-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.highlight-content li {
  margin: 4px 0;
  line-height: 1.6;
}

.highlight-content strong {
  color: #323233;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-field__control) {
  font-size: 14px;
}

:deep(.van-button--mini) {
  min-width: 60px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .storage-demo {
    padding: 12px;
  }
  
  .header {
    padding: 16px;
  }
  
  .header h2 {
    font-size: 18px;
  }
  
  .header p {
    font-size: 13px;
  }
  
  .input-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .input-group .van-field {
    width: 100%;
  }
}
</style>
