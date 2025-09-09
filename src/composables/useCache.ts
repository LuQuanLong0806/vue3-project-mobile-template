import { onActivated, onDeactivated, onUnmounted } from 'vue'
import { useCacheStore } from '@/stores/cache'
import { useRoute } from 'vue-router'
import type { Ref } from 'vue'

/**
 * 页面缓存 Composable
 * 提供页面级别的缓存管理功能
 */
export function useCache(options?: {
  /** 缓存键名 */
  key?: string
  /** 是否启用缓存 */
  enabled?: boolean
  /** 缓存持续时间（分钟） */
  duration?: number
  /** 页面激活时的回调 */
  onActivated?: () => void
  /** 页面失活时的回调 */
  onDeactivated?: () => void
}) {
  const cacheStore = useCacheStore()
  const route = useRoute()
  
  const cacheKey = options?.key || route.name as string
  const enabled = options?.enabled ?? true
  
  // 页面激活时
  onActivated(() => {
    console.log(`🔄 页面激活: ${cacheKey}`)
    options?.onActivated?.()
  })
  
  // 页面失活时
  onDeactivated(() => {
    console.log(`💤 页面失活: ${cacheKey}`)
    options?.onDeactivated?.()
  })
  
  // 组件卸载时
  onUnmounted(() => {
    // 可选择是否在组件卸载时移除缓存
    // cacheStore.removeCachedView(cacheKey)
  })
  
  return {
    /** 当前页面是否被缓存 */
    isCached: () => cacheStore.cachedViews.includes(cacheKey),
    
    /** 刷新当前页面缓存 */
    refresh: () => {
      cacheStore.removeCachedView(cacheKey)
      console.log(`🔄 刷新缓存: ${cacheKey}`)
    },
    
    /** 启用当前页面缓存 */
    enable: () => {
      if (enabled) {
        cacheStore.addCachedView(cacheKey)
      }
    },
    
    /** 禁用当前页面缓存 */
    disable: () => {
      cacheStore.removeCachedView(cacheKey)
    }
  }
}

/**
 * 数据缓存 Composable
 * 用于缓存API请求等数据
 */
export function useDataCache<T = any>(key: string, options?: {
  /** 缓存时间（毫秒） */
  ttl?: number
  /** 获取数据的函数 */
  fetcher?: () => Promise<T>
}) {
  const cacheMap = new Map<string, { data: T; timestamp: number; ttl: number }>()
  
  const get = (): T | null => {
    const cached = cacheMap.get(key)
    if (!cached) return null
    
    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      cacheMap.delete(key)
      return null
    }
    
    return cached.data
  }
  
  const set = (data: T, ttl = options?.ttl || 5 * 60 * 1000) => {
    cacheMap.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  const remove = () => {
    return cacheMap.delete(key)
  }
  
  const clear = () => {
    cacheMap.clear()
  }
  
  // 带缓存的数据获取
  const fetchWithCache = async (): Promise<T> => {
    const cached = get()
    if (cached) {
      console.log(`📋 使用缓存数据: ${key}`)
      return cached
    }
    
    if (!options?.fetcher) {
      throw new Error('No fetcher provided')
    }
    
    console.log(`🌐 获取新数据: ${key}`)
    const data = await options.fetcher()
    set(data)
    return data
  }
  
  return {
    get,
    set,
    remove,
    clear,
    fetchWithCache
  }
}

/**
 * 表单缓存 Composable
 * 自动缓存表单数据，防止意外丢失
 */
export function useFormCache<T extends Record<string, any>>(
  formData: Ref<T>,
  key: string,
  options?: {
    /** 是否启用自动保存 */
    autoSave?: boolean
    /** 自动保存间隔（毫秒） */
    saveInterval?: number
    /** 排除的字段 */
    excludeFields?: string[]
  }
) {
  const storageKey = `form_cache_${key}`
  const autoSave = options?.autoSave ?? true
  const saveInterval = options?.saveInterval ?? 3000
  
  // 保存表单数据到本地存储
  const save = () => {
    try {
      const dataToSave = { ...formData.value }
      
      // 排除指定字段
      if (options?.excludeFields) {
        options.excludeFields.forEach(field => {
          delete dataToSave[field]
        })
      }
      
      localStorage.setItem(storageKey, JSON.stringify({
        data: dataToSave,
        timestamp: Date.now()
      }))
      
      console.log(`💾 表单数据已缓存: ${key}`)
    } catch (error) {
      console.error('表单缓存保存失败:', error)
    }
  }
  
  // 从本地存储恢复表单数据
  const restore = (): boolean => {
    try {
      const cached = localStorage.getItem(storageKey)
      if (!cached) return false
      
      const { data, timestamp } = JSON.parse(cached)
      
      // 检查缓存是否过期（24小时）
      const now = Date.now()
      if (now - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(storageKey)
        return false
      }
      
      // 恢复数据
      Object.assign(formData.value, data)
      console.log(`📋 表单数据已恢复: ${key}`)
      return true
    } catch (error) {
      console.error('表单缓存恢复失败:', error)
      return false
    }
  }
  
  // 清除表单缓存
  const clear = () => {
    localStorage.removeItem(storageKey)
    console.log(`🗑️ 表单缓存已清除: ${key}`)
  }
  
  // 自动保存定时器
  let autoSaveTimer: NodeJS.Timeout | null = null
  
  if (autoSave) {
    autoSaveTimer = setInterval(save, saveInterval)
  }
  
  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
    }
  })
  
  return {
    save,
    restore,
    clear,
    /** 手动开启自动保存 */
    startAutoSave: () => {
      if (!autoSaveTimer) {
        autoSaveTimer = setInterval(save, saveInterval)
      }
    },
    /** 手动停止自动保存 */
    stopAutoSave: () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer)
        autoSaveTimer = null
      }
    }
  }
}
