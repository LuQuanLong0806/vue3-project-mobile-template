import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CacheRule {
  // 路由名称
  name: string
  // 缓存条件：from路由 -> to路由
  condition?: {
    from?: string[]
    to?: string[]
  }
  // 缓存时间（分钟），0表示永久缓存
  duration?: number
  // 最大缓存实例数
  maxInstances?: number
}

export const useCacheStore = defineStore('cache', () => {
  // 当前缓存的视图组件名称列表
  const cachedViews = ref<string[]>([])
  
  // 缓存规则配置
  const cacheRules = ref<CacheRule[]>([
    {
      name: 'Home',
      duration: 10, // 首页缓存10分钟
      maxInstances: 1
    },
    {
      name: 'Counter',
      duration: 5, // 计数器页面缓存5分钟
      maxInstances: 1
    },
    {
      name: 'About',
      duration: 30, // 关于页面缓存30分钟
      maxInstances: 1
    },
    {
      name: 'LessDemo',
      duration: 15, // 样式演示页面缓存15分钟
      maxInstances: 1
    },
         {
           name: 'CacheDemo',
           duration: 0, // 缓存演示页面永久缓存，用于演示效果
           maxInstances: 1
         },
         {
           name: 'StorageDemo',
           duration: 15, // 存储演示页面缓存15分钟
           maxInstances: 1
         },
         {
           name: 'EnvDemo',
           duration: 10, // 环境配置演示页面缓存10分钟
           maxInstances: 1
         }
  ])
  
  // 缓存时间戳记录
  const cacheTimestamps = ref<Record<string, number>>({})
  
  // 路由导航历史
  const navigationHistory = ref<string[]>([])
  
  // 添加视图到缓存
  const addCachedView = (name: string) => {
    if (!name || cachedViews.value.includes(name)) return
    
    const rule = cacheRules.value.find(r => r.name === name)
    if (!rule) return
    
    // 检查该页面类型的实例数限制（修复：这里应该检查同名页面的数量，而不是总数量）
    const sameNameInstances = cachedViews.value.filter(view => view === name).length
    if (rule.maxInstances && sameNameInstances >= rule.maxInstances) {
      // 如果已经有相同名称的缓存，直接返回（因为maxInstances通常为1）
      return
    }
    
    // 全局缓存数量限制（防止内存占用过多）
    const MAX_TOTAL_CACHE = 10
    if (cachedViews.value.length >= MAX_TOTAL_CACHE) {
      // 移除最旧的缓存
      const oldestView = cachedViews.value.shift()
      if (oldestView) {
        delete cacheTimestamps.value[oldestView]
        console.log(`🗑️ 移除旧缓存: ${oldestView}`)
      }
    }
    
    cachedViews.value.push(name)
    cacheTimestamps.value[name] = Date.now()
    
    console.log(`✅ 缓存视图: ${name}`, cachedViews.value)
  }
  
  // 从缓存中移除视图
  const removeCachedView = (name: string) => {
    const index = cachedViews.value.indexOf(name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
      delete cacheTimestamps.value[name]
      console.log(`❌ 移除缓存: ${name}`, cachedViews.value)
    }
  }
  
  // 清除所有缓存
  const clearAllCache = () => {
    cachedViews.value = []
    cacheTimestamps.value = {}
    navigationHistory.value = []
    console.log('🗑️ 清除所有缓存')
  }
  
  // 清除过期缓存
  const clearExpiredCache = () => {
    const now = Date.now()
    const expiredViews: string[] = []
    
    Object.entries(cacheTimestamps.value).forEach(([name, timestamp]) => {
      const rule = cacheRules.value.find(r => r.name === name)
      if (rule && rule.duration && rule.duration > 0) {
        const expireTime = timestamp + (rule.duration * 60 * 1000)
        if (now > expireTime) {
          expiredViews.push(name)
        }
      }
    })
    
    expiredViews.forEach(name => {
      removeCachedView(name)
    })
    
    if (expiredViews.length > 0) {
      console.log(`⏰ 清除过期缓存:`, expiredViews)
    }
  }
  
  // 更新导航历史
  const updateNavigationHistory = (routeName: string) => {
    navigationHistory.value.push(routeName)
    // 保持历史记录在合理长度
    if (navigationHistory.value.length > 10) {
      navigationHistory.value = navigationHistory.value.slice(-10)
    }
  }
  
  // 根据路由变化智能管理缓存
  const handleRouteChange = (to: any, from: any) => {
    const toName = to.name as string
    const fromName = from.name as string
    
    // 更新导航历史
    if (toName) {
      updateNavigationHistory(toName)
    }
    
    // 清除过期缓存
    clearExpiredCache()
    
    // 判断是否需要缓存当前页面
    if (toName && to.meta?.keepAlive !== false) {
      const rule = cacheRules.value.find(r => r.name === toName)
      if (rule) {
        // 检查缓存条件
        let shouldCache = true
        
        if (rule.condition) {
          if (rule.condition.from && fromName) {
            shouldCache = rule.condition.from.includes(fromName)
          }
          if (rule.condition.to && shouldCache) {
            shouldCache = rule.condition.to.includes(toName)
          }
        }
        
        if (shouldCache) {
          addCachedView(toName)
        }
      }
    }
    
    // 处理特殊场景：从详情页返回列表页时，移除详情页缓存
    if (fromName && fromName.includes('Detail') && toName && toName.includes('List')) {
      removeCachedView(fromName)
    }
  }
  
  // 获取缓存统计信息
  const cacheStats = computed(() => {
    return {
      totalCached: cachedViews.value.length,
      cachedViews: cachedViews.value,
      cacheInfo: cachedViews.value.map(name => {
        const rule = cacheRules.value.find(r => r.name === name)
        const timestamp = cacheTimestamps.value[name]
        return {
          name,
          cachedAt: new Date(timestamp).toLocaleTimeString(),
          duration: rule?.duration || 0,
          isExpired: rule?.duration ? 
            Date.now() > (timestamp + rule.duration * 60 * 1000) : false
        }
      })
    }
  })
  
  // 动态添加缓存规则
  const addCacheRule = (rule: CacheRule) => {
    const existingIndex = cacheRules.value.findIndex(r => r.name === rule.name)
    if (existingIndex > -1) {
      cacheRules.value[existingIndex] = rule
    } else {
      cacheRules.value.push(rule)
    }
  }
  
  // 移除缓存规则
  const removeCacheRule = (name: string) => {
    const index = cacheRules.value.findIndex(r => r.name === name)
    if (index > -1) {
      cacheRules.value.splice(index, 1)
      removeCachedView(name)
    }
  }
  
  return {
    // 状态
    cachedViews: computed(() => cachedViews.value),
    cacheRules: computed(() => cacheRules.value),
    navigationHistory: computed(() => navigationHistory.value),
    cacheStats,
    
    // 方法
    addCachedView,
    removeCachedView,
    clearAllCache,
    clearExpiredCache,
    handleRouteChange,
    addCacheRule,
    removeCacheRule,
    updateNavigationHistory
  }
})

// 缓存工具函数
export const useCacheUtils = () => {
  const cacheStore = useCacheStore()
  
  // 手动刷新指定页面缓存
  const refreshPageCache = (routeName: string) => {
    cacheStore.removeCachedView(routeName)
    console.log(`🔄 刷新页面缓存: ${routeName}`)
  }
  
  // 预加载页面到缓存
  const preloadPage = (routeName: string) => {
    cacheStore.addCachedView(routeName)
    console.log(`⚡ 预加载页面: ${routeName}`)
  }
  
  // 获取页面是否被缓存
  const isPageCached = (routeName: string): boolean => {
    return cacheStore.cachedViews.includes(routeName)
  }
  
  // 批量管理缓存
  const batchCacheOperation = (operation: 'add' | 'remove' | 'clear', routeNames?: string[]) => {
    switch (operation) {
      case 'add':
        routeNames?.forEach(name => cacheStore.addCachedView(name))
        break
      case 'remove':
        routeNames?.forEach(name => cacheStore.removeCachedView(name))
        break
      case 'clear':
        cacheStore.clearAllCache()
        break
    }
  }
  
  return {
    refreshPageCache,
    preloadPage,
    isPageCached,
    batchCacheOperation
  }
}
