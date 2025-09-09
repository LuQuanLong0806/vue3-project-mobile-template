import { ref } from 'vue'
import { defineStore } from 'pinia'
import { storage } from '@/utils/db/index'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

/**
 * 用户状态管理 Store
 * 使用新的存储封装方法，支持数据过期、嵌套键名、内存降级等高级功能
 * 
 * 主要功能：
 * - 用户登录/登出管理
 * - 用户信息持久化存储（30天过期）
 * - 用户偏好设置管理（1年过期）
 * - 会话延长功能
 * - 存储统计和清理功能
 * - 旧数据自动迁移
 * 
 * 存储结构：
 * - user.profile: 用户基本信息
 * - user.preferences.*: 用户偏好设置
 * - user.settings.*: 用户应用设置
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  
  // 方法
  function login(userData: User) {
    user.value = userData
    isLoggedIn.value = true
    // 使用新的存储封装方法，支持过期时间等高级功能
    storage.set('user.profile', userData, {
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天过期
      tag: 'user-session',
      version: '1.0'
    })
  }
  
  function logout() {
    user.value = null
    isLoggedIn.value = false
    // 清除用户相关的所有存储数据
    storage.remove(['user.profile', 'user.settings', 'user.preferences'])
  }
  
  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      // 更新用户数据，保持原有的存储选项
      storage.set('user.profile', user.value, {
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天过期
        tag: 'user-session',
        version: '1.0'
      })
    }
  }
  
  // 初始化时检查本地存储
  function initializeUser() {
    try {
      // 使用新的存储方法获取用户数据
      const userData = storage.get<User>('user.profile') as User | null
      if (userData) {
        user.value = userData
        isLoggedIn.value = true
        console.log('用户数据已恢复:', userData)
      } else {
        // 尝试从旧的localStorage迁移数据
        migrateLegacyData()
      }
    } catch (error) {
      console.error('初始化用户数据失败:', error)
      // 清理可能损坏的数据
      storage.remove('user.profile')
    }
  }

  // 迁移旧的localStorage数据
  function migrateLegacyData() {
    try {
      const legacyData = localStorage.getItem('user')
      if (legacyData) {
        const userData = JSON.parse(legacyData) as User
        console.log('发现旧版用户数据，正在迁移...')
        
        // 使用新方法保存数据
        storage.set('user.profile', userData, {
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
          tag: 'user-session-migrated',
          version: '1.0'
        })
        
        // 更新状态
        user.value = userData
        isLoggedIn.value = true
        
        // 清理旧数据
        localStorage.removeItem('user')
        console.log('用户数据迁移完成')
      }
    } catch (error) {
      console.error('迁移用户数据失败:', error)
      localStorage.removeItem('user') // 清理损坏的旧数据
    }
  }

  // 用户设置相关方法
  function setUserPreference(key: string, value: any) {
    storage.set(`user.preferences.${key}`, value, {
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1年过期
      tag: 'user-preference',
      version: '1.0'
    })
  }

  function getUserPreference<T = any>(key: string): T | null {
    return storage.get<T>(`user.preferences.${key}`) as T | null
  }

  function removeUserPreference(key: string) {
    storage.remove(`user.preferences.${key}`)
  }

  // 用户会话管理
  function extendSession() {
    if (user.value) {
      // 延长会话时间
      storage.set('user.profile', user.value, {
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 重新设置30天过期
        tag: 'user-session-extended',
        version: '1.0'
      })
      console.log('用户会话已延长')
    }
  }

  // 获取用户存储统计
  function getUserStorageStats() {
    return storage.getStorageStats()
  }

  // 清理用户相关的过期数据
  function cleanupUserData() {
    const allKeys = storage.getAllKeys()
    const userKeys = allKeys.filter(key => key.startsWith('user.'))
    
    userKeys.forEach(key => {
      const item = storage.get(key, true) // 获取完整对象
      if (item && typeof item === 'object' && 'expires' in item) {
        if (item.expires && Date.now() > item.expires) {
          storage.remove(key)
          console.log(`已清理过期数据: ${key}`)
        }
      }
    })
  }

  // 获取用户完整信息（包括存储的元数据）
  function getUserFullInfo() {
    const profile = storage.get('user.profile', true) // 获取完整对象
    const allUserKeys = storage.getAllKeys().filter(key => key.startsWith('user.'))
    
    return {
      profile,
      userKeys: allUserKeys,
      storageStats: getUserStorageStats(),
      isUsingMemoryStorage: storage.isUsingMemoryStorage()
    }
  }

  return {
    // 基础状态
    user,
    isLoggedIn,
    
    // 基础方法
    login,
    logout,
    updateUser,
    initializeUser,
    
    // 偏好设置方法
    setUserPreference,
    getUserPreference,
    removeUserPreference,
    
    // 会话管理
    extendSession,
    
    // 存储管理
    getUserStorageStats,
    cleanupUserData,
    getUserFullInfo
  }
})
