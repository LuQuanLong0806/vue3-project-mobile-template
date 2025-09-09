import { useCacheStore } from '@/stores/cache'

/**
 * 缓存管理工具类
 */
export class CacheManager {
  private cacheStore = useCacheStore()

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return this.cacheStore.cacheStats
  }

  /**
   * 刷新指定页面缓存
   * @param routeName 路由名称
   */
  refresh(routeName: string) {
    this.cacheStore.removeCachedView(routeName)
    console.log(`🔄 已刷新 ${routeName} 页面缓存`)
  }

  /**
   * 预加载页面
   * @param routeName 路由名称
   */
  preload(routeName: string) {
    this.cacheStore.addCachedView(routeName)
    console.log(`⚡ 已预加载 ${routeName} 页面`)
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    this.cacheStore.clearAllCache()
    console.log('🗑️ 已清除所有缓存')
  }

  /**
   * 清除过期缓存
   */
  clearExpired() {
    this.cacheStore.clearExpiredCache()
    console.log('⏰ 已清除过期缓存')
  }

  /**
   * 检查页面是否被缓存
   * @param routeName 路由名称
   */
  isCached(routeName: string): boolean {
    return this.cacheStore.cachedViews.includes(routeName)
  }

  /**
   * 批量操作缓存
   * @param operation 操作类型
   * @param routeNames 路由名称数组
   */
  batch(operation: 'add' | 'remove', routeNames: string[]) {
    routeNames.forEach(name => {
      if (operation === 'add') {
        this.cacheStore.addCachedView(name)
      } else {
        this.cacheStore.removeCachedView(name)
      }
    })
    console.log(`📦 批量${operation === 'add' ? '添加' : '移除'}缓存:`, routeNames)
  }

  /**
   * 导出缓存配置
   */
  exportConfig() {
    return {
      cachedViews: this.cacheStore.cachedViews,
      cacheRules: this.cacheStore.cacheRules,
      navigationHistory: this.cacheStore.navigationHistory,
      timestamp: Date.now()
    }
  }

  /**
   * 导入缓存配置
   * @param config 缓存配置
   */
  importConfig(config: any) {
    // 验证配置有效性
    if (!config || !config.cachedViews || !config.cacheRules) {
      console.error('❌ 无效的缓存配置')
      return false
    }

    try {
      // 重置当前缓存
      this.cacheStore.clearAllCache()
      
      // 应用新配置
      config.cachedViews.forEach((name: string) => {
        this.cacheStore.addCachedView(name)
      })
      
      console.log('✅ 缓存配置导入成功')
      return true
    } catch (error) {
      console.error('❌ 缓存配置导入失败:', error)
      return false
    }
  }
}

/**
 * 缓存装饰器 - 用于组件方法缓存
 * @param duration 缓存持续时间（毫秒）
 */
export function cached(duration: number = 5 * 60 * 1000) {
  return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = new Map<string, { value: any, timestamp: number }>()

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args)
      const now = Date.now()
      const cached = cache.get(key)

      if (cached && (now - cached.timestamp) < duration) {
        console.log(`📋 使用缓存结果: ${propertyKey}`)
        return cached.value
      }

      const result = originalMethod.apply(this, args)
      cache.set(key, { value: result, timestamp: now })
      console.log(`💾 缓存方法结果: ${propertyKey}`)
      
      return result
    }

    return descriptor
  }
}

/**
 * 内存缓存工具
 */
export class MemoryCache {
  private cache = new Map<string, { value: any, timestamp: number, duration: number }>()

  /**
   * 设置缓存
   * @param key 键
   * @param value 值
   * @param duration 持续时间（毫秒）
   */
  set(key: string, value: any, duration: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      duration
    })
  }

  /**
   * 获取缓存
   * @param key 键
   */
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.duration) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  /**
   * 删除缓存
   * @param key 键
   */
  delete(key: string) {
    return this.cache.delete(key)
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.cache.clear()
  }

  /**
   * 清除过期缓存
   */
  clearExpired() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.duration) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存大小
   */
  size() {
    return this.cache.size
  }

  /**
   * 获取所有键
   */
  keys() {
    return Array.from(this.cache.keys())
  }
}

// 全局缓存实例
export const memoryCache = new MemoryCache()
export const cacheManager = new CacheManager()

// 缓存相关的工具函数
export const CacheUtils = {
  /**
   * 格式化缓存大小
   * @param bytes 字节数
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * 格式化缓存时间
   * @param timestamp 时间戳
   */
  formatCacheTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  },

  /**
   * 检查缓存健康状态
   */
  checkHealth(): {
    status: 'healthy' | 'warning' | 'error'
    message: string
    details: any
  } {
    const stats = cacheManager.getStats()
    const total = stats.totalCached
    const expired = stats.cacheInfo.filter((item: any) => item.isExpired).length

    if (total === 0) {
      return {
        status: 'warning',
        message: '暂无缓存数据',
        details: stats
      }
    }

    if (expired > total * 0.5) {
      return {
        status: 'warning',
        message: `发现 ${expired} 个过期缓存，建议清理`,
        details: stats
      }
    }

    return {
      status: 'healthy',
      message: `缓存运行正常，共 ${total} 个活跃缓存`,
      details: stats
    }
  }
}
