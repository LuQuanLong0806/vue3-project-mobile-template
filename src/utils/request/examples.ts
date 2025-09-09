/**
 * axios 工具使用示例
 * 展示如何在项目中使用封装好的请求工具
 */
import { ref, readonly } from 'vue'
import { 
  get, post, put, del, upload, download, 
  getPagination, batchRequest, withCache, clearCache 
} from './api'
import { type CustomRequestConfig } from './index'
import { type LoginRequest, type LoginResponse, type UserInfo } from './types'

// ===========================================
// 基本请求示例
// ===========================================

/**
 * 示例1: 基本GET请求
 */
export async function getUserList() {
  try {
    const response = await get<UserInfo[]>('/api/users')
    console.log('用户列表:', response.data)
    return response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

/**
 * 示例2: 带参数的GET请求
 */
export async function searchUsers(keyword: string, page: number = 1) {
  return await get<UserInfo[]>('/api/users/search', {
    keyword,
    page,
    pageSize: 20
  })
}

/**
 * 示例3: POST请求 - 用户登录
 */
export async function login(loginData: LoginRequest) {
  return await post<LoginResponse>('/api/auth/login', loginData)
}

/**
 * 示例4: PUT请求 - 更新用户信息
 */
export async function updateUser(userId: number, userData: Partial<UserInfo>) {
  return await put<UserInfo>(`/api/users/${userId}`, userData)
}

/**
 * 示例5: DELETE请求
 */
export async function deleteUser(userId: number) {
  return await del(`/api/users/${userId}`)
}

// ===========================================
// 自定义配置示例
// ===========================================

/**
 * 示例6: 跳过loading提示的请求
 */
export async function getConfigData() {
  const config: CustomRequestConfig = {
    skipLoading: true,
    skipErrorToast: true
  }
  
  return await get('/api/config', {}, config)
}

/**
 * 示例7: 跳过认证的公开API请求
 */
export async function getPublicData() {
  const config: CustomRequestConfig = {
    skipAuth: true
  }
  
  return await get('/api/public/data', {}, config)
}

/**
 * 示例8: 自定义超时时间
 */
export async function getLargeData() {
  const config: CustomRequestConfig = {
    timeout: 30000, // 30秒超时
    skipLoading: false
  }
  
  return await get('/api/large-data', {}, config)
}

// ===========================================
// 文件操作示例
// ===========================================

/**
 * 示例9: 文件上传
 */
export async function uploadAvatar(file: File) {
  return await upload('/api/upload/avatar', file, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      console.log(`上传进度: ${percentCompleted}%`)
    }
  })
}

/**
 * 示例10: 文件下载
 */
export async function downloadReport(reportId: string) {
  await download(`/api/reports/${reportId}/download`, `report_${reportId}.pdf`)
}

// ===========================================
// 分页请求示例
// ===========================================

/**
 * 示例11: 分页获取数据
 */
export async function getUsersPaginated(page: number = 1, pageSize: number = 20) {
  return await getPagination<UserInfo>('/api/users', {
    page,
    pageSize,
    sortBy: 'createTime',
    sortOrder: 'desc'
  })
}

// ===========================================
// 批量请求示例
// ===========================================

/**
 * 示例12: 批量请求
 */
export async function loadDashboardData() {
  const requests = [
    {
      method: 'get' as const,
      url: '/api/dashboard/stats',
      config: { skipLoading: true }
    },
    {
      method: 'get' as const,
      url: '/api/dashboard/recent-activities',
      config: { skipLoading: true }
    },
    {
      method: 'get' as const,
      url: '/api/dashboard/notifications',
      config: { skipLoading: true }
    }
  ]
  
  try {
    const [stats, activities, notifications] = await batchRequest(requests)
    return {
      stats: stats.data,
      activities: activities.data,
      notifications: notifications.data
    }
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    throw error
  }
}

// ===========================================
// 缓存请求示例
// ===========================================

/**
 * 示例13: 使用缓存的请求
 */
export async function getAppConfig() {
  return withCache(
    () => get('/api/app/config'),
    'app_config',
    10 * 60 * 1000 // 缓存10分钟
  )
}

/**
 * 示例14: 清除缓存
 */
export function clearAppConfigCache() {
  clearCache('app_config')
}

// ===========================================
// Vue Composition API 使用示例
// ===========================================

/**
 * 示例15: 在 Vue 组件中使用
 */
export function useUserApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const fetchUser = async (userId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await get<UserInfo>(`/api/users/${userId}`)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const createUser = async (userData: Omit<UserInfo, 'id'>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await post<UserInfo>('/api/users', userData)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchUser,
    createUser
  }
}

// ===========================================
// 错误处理示例
// ===========================================

/**
 * 示例16: 自定义错误处理
 */
export async function getUserWithCustomErrorHandling(userId: number) {
  try {
    const response = await get<UserInfo>(`/api/users/${userId}`, {}, {
      skipErrorToast: true // 跳过默认的错误提示
    })
    return response.data
  } catch (error) {
    // 自定义错误处理逻辑
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.warn('用户不存在')
        // 可以显示自定义的错误提示或执行其他逻辑
      } else if (error.message.includes('403')) {
        console.warn('没有权限访问该用户信息')
      } else {
        console.error('获取用户信息失败:', error.message)
      }
    }
    throw error
  }
}
