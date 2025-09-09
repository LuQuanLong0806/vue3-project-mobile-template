<template>
  <div class="cache-manager">
    <div class="header">
      <h2>缓存管理中心</h2>
      <p class="description">管理应用的页面缓存，优化用户体验</p>
    </div>

    <!-- 缓存状态概览 -->
    <div class="cache-stats">
      <van-cell-group inset>
        <van-cell title="缓存状态" :value="healthStatus.message" :label="healthStatusLabel">
          <template #icon>
            <van-icon 
              :name="healthStatus.status === 'healthy' ? 'success' : 'warning'" 
              :color="healthStatus.status === 'healthy' ? '#07c160' : '#ff976a'"
              size="20"
            />
          </template>
        </van-cell>
        <van-cell title="活跃缓存" :value="cacheStats.totalCached + ' 个'" />
        <van-cell title="缓存规则" :value="cacheRules.length + ' 条'" />
      </van-cell-group>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <van-row :gutter="10">
        <van-col span="12">
          <van-button 
            type="primary" 
            size="large" 
            icon="delete-o" 
            @click="clearExpiredCache"
            block
          >
            清除过期
          </van-button>
        </van-col>
        <van-col span="12">
          <van-button 
            type="danger" 
            size="large" 
            icon="clear" 
            @click="showClearAllDialog"
            block
          >
            清除全部
          </van-button>
        </van-col>
      </van-row>
    </div>

    <!-- 缓存列表 -->
    <div class="cache-list">
      <van-cell-group inset>
        <van-cell 
          v-for="item in cacheStats.cacheInfo" 
          :key="item.name"
          :title="getPageTitle(item.name)"
          :label="`缓存时间: ${item.cachedAt} | 有效期: ${item.duration}分钟`"
        >
          <template #value>
            <div class="cache-item-actions">
              <van-tag 
                :type="item.isExpired ? 'danger' : 'success'" 
                size="medium"
                style="margin-right: 8px;"
              >
                {{ item.isExpired ? '已过期' : '活跃' }}
              </van-tag>
              <van-button 
                type="primary" 
                size="mini" 
                @click="refreshCache(item.name)"
              >
                刷新
              </van-button>
            </div>
          </template>
        </van-cell>
        
        <van-empty 
          v-if="cacheStats.totalCached === 0"
          image="search" 
          description="暂无缓存数据"
        />
      </van-cell-group>
    </div>

    <!-- 导航历史 -->
    <div class="navigation-history">
      <van-collapse v-model="activeCollapse">
        <van-collapse-item title="导航历史" name="history">
          <van-tag 
            v-for="(route, index) in navigationHistory.slice(-8)" 
            :key="index"
            type="default"
            style="margin: 2px;"
          >
            {{ getPageTitle(route) }}
          </van-tag>
          <van-empty 
            v-if="navigationHistory.length === 0"
            image="search" 
            description="暂无导航历史"
            :image-size="60"
          />
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 缓存规则管理 -->
    <div class="cache-rules">
      <van-collapse v-model="activeCollapse">
        <van-collapse-item title="缓存规则" name="rules">
          <van-cell 
            v-for="rule in cacheRules" 
            :key="rule.name"
            :title="getPageTitle(rule.name)"
            :label="`缓存时长: ${rule.duration}分钟 | 最大实例: ${rule.maxInstances}`"
          >
            <template #value>
              <van-switch 
                :model-value="isCacheEnabled(rule.name)" 
                @update:model-value="toggleCacheRule(rule.name, $event)"
                size="20"
              />
            </template>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 确认对话框 -->
    <van-dialog 
      v-model:show="showClearDialog" 
      title="确认清除缓存"
      message="确定要清除所有缓存吗？这将导致所有页面重新加载。"
      show-cancel-button
      @confirm="clearAllCache"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCacheStore } from '@/stores/cache'
import { CacheUtils, cacheManager } from '@/utils/cache'
import { showSuccessToast } from 'vant'

// 缓存store
const cacheStore = useCacheStore()

// 响应式数据
const activeCollapse = ref<string[]>([])
const showClearDialog = ref(false)

// 计算属性
const cacheStats = computed(() => cacheStore.cacheStats)
const cacheRules = computed(() => cacheStore.cacheRules)
const navigationHistory = computed(() => cacheStore.navigationHistory)

// 缓存健康状态
const healthStatus = computed(() => CacheUtils.checkHealth())
const healthStatusLabel = computed(() => {
  const stats = cacheStats.value
  if (stats.totalCached === 0) return '建议启用页面缓存'
  const expired = stats.cacheInfo.filter(item => item.isExpired).length
  return expired > 0 ? `发现 ${expired} 个过期缓存` : '缓存运行良好'
})

// 页面标题映射
const pageTitleMap: Record<string, string> = {
  'Home': '首页',
  'Counter': '计数器',
  'About': '关于',
  'LessDemo': '样式演示',
  'BigScreen': '大屏适配',
  'Demo': '原布局演示',
  'Example': '示例页面',
  'NotFound': '404页面'
}

// 获取页面标题
const getPageTitle = (name: string): string => {
  return pageTitleMap[name] || name
}

// 检查缓存是否启用
const isCacheEnabled = (name: string): boolean => {
  return cacheStore.cachedViews.includes(name)
}

// 切换缓存规则
const toggleCacheRule = (name: string, enabled: boolean) => {
  if (enabled) {
    cacheStore.addCachedView(name)
    showSuccessToast(`已启用 ${getPageTitle(name)} 缓存`)
  } else {
    cacheStore.removeCachedView(name)
    showSuccessToast(`已禁用 ${getPageTitle(name)} 缓存`)
  }
}

// 刷新单个缓存
const refreshCache = (name: string) => {
  cacheManager.refresh(name)
  showSuccessToast(`已刷新 ${getPageTitle(name)} 缓存`)
}

// 清除过期缓存
const clearExpiredCache = () => {
  cacheManager.clearExpired()
  showSuccessToast('已清除过期缓存')
}

// 显示清除全部对话框
const showClearAllDialog = () => {
  showClearDialog.value = true
}

// 清除全部缓存
const clearAllCache = () => {
  cacheManager.clearAll()
  showSuccessToast('已清除所有缓存')
}

// 定时清理过期缓存
onMounted(() => {
  // 每30秒检查一次过期缓存
  const timer = setInterval(() => {
    cacheStore.clearExpiredCache()
  }, 30 * 1000)

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<style scoped>
.cache-manager {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  font-size: 20px;
  color: #323233;
  margin: 0 0 8px 0;
}

.description {
  font-size: 14px;
  color: #646566;
  margin: 0;
}

.cache-stats,
.cache-list,
.navigation-history,
.cache-rules {
  margin-bottom: 16px;
}

.actions {
  margin-bottom: 20px;
}

.cache-item-actions {
  display: flex;
  align-items: center;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-cell__label) {
  font-size: 12px;
  color: #969799;
}

:deep(.van-collapse-item__title) {
  font-weight: 500;
  font-size: 16px;
}

:deep(.van-tag) {
  margin: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cache-manager {
    padding: 12px;
  }
  
  .header h2 {
    font-size: 18px;
  }
  
  .description {
    font-size: 13px;
  }
}
</style>
