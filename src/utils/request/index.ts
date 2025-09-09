import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import Logger from '@/utils/logger'
import EnvConfig from '@/utils/env'

// 响应接口类型定义
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// 扩展AxiosRequestConfig
export interface CustomRequestConfig extends Partial<InternalAxiosRequestConfig> {
  skipAuth?: boolean        // 跳过认证
  skipLoading?: boolean     // 跳过loading提示
  skipErrorToast?: boolean  // 跳过错误提示
  retryCount?: number       // 重试次数
  retryDelay?: number       // 重试延迟时间(ms)
}

// 创建axios实例
const request = axios.create({
  baseURL: EnvConfig.apiBaseUrl,
  timeout: EnvConfig.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求队列管理
let loadingCount = 0
const requestQueue = new Set<string>()

// 显示loading
function showLoading(config: CustomRequestConfig) {
  if (!config.skipLoading && loadingCount === 0) {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
  }
  loadingCount++
}

// 隐藏loading
function hideLoading() {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    closeToast()
  }
}

// 生成请求唯一标识
function generateRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 请求拦截器
request.interceptors.request.use(
  (config: any) => {
    const userStore = useUserStore()
    const { isLoggedIn, user } = storeToRefs(userStore)
    
    // 生成请求标识，防止重复请求
    const requestKey = generateRequestKey(config)
    if (requestQueue.has(requestKey)) {
      Logger.warn('重复请求被拦截:', config.url)
      return Promise.reject(new Error('重复请求'))
    }
    requestQueue.add(requestKey)
    
    // 显示loading
    showLoading(config)
    
    // 添加认证token
    if (!config.skipAuth && isLoggedIn.value && user.value) {
      if (!config.headers) {
        config.headers = {}
      }
      // 这里根据实际项目的token存储方式调整
      config.headers.Authorization = `Bearer ${user.value.id}` // 示例，实际应该是真实的token
    }
    
    // 添加请求时间戳
    if (!config.headers) {
      config.headers = {}
    }
    config.headers['X-Request-Time'] = Date.now().toString()
    
    // 记录请求日志
    Logger.info('发起API请求:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      params: config.params,
      data: config.data
    })
    
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    Logger.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const config = response.config as any
    const requestKey = generateRequestKey(config)
    requestQueue.delete(requestKey)
    
    hideLoading()
    
    const { data } = response
    
    // 记录响应日志
    Logger.info('API响应成功:', {
      url: config.url,
      status: response.status,
      data: data
    })
    
    // 统一处理业务逻辑
    if (data && typeof data === 'object') {
      // 根据项目实际的响应结构调整
      if (data.code === 200 || data.success === true) {
        return response
      }
      
      // 处理业务错误
      const errorMessage = data.message || '请求失败'
      
      if (!config.skipErrorToast) {
        showToast({
          type: 'fail',
          message: errorMessage
        })
      }
      
      Logger.warn('业务逻辑错误:', {
        url: config.url,
        code: data.code,
        message: errorMessage
      })
      
      return Promise.reject(new Error(errorMessage))
    }
    
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as any
    if (config) {
      const requestKey = generateRequestKey(config)
      requestQueue.delete(requestKey)
    }
    
    hideLoading()
    
    Logger.error('API请求失败:', {
      url: config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    })
    
    // 处理不同类型的错误
    await handleApiError(error, config)
    
    return Promise.reject(error)
  }
)

// 错误处理函数
async function handleApiError(error: AxiosError, config?: CustomRequestConfig) {
  const userStore = useUserStore()
  
  if (!error.response) {
    // 网络错误或请求超时
    if (!config?.skipErrorToast) {
      showToast({
        type: 'fail',
        message: '网络连接失败，请检查您的网络设置'
      })
    }
    return
  }
  
  const { status, data } = error.response
  let errorMessage = '请求失败'
  
  switch (status) {
    case 400:
      errorMessage = (data as any)?.message || '请求参数错误'
      break
    case 401:
      errorMessage = '登录已过期，请重新登录'
      // 清除用户登录状态
      userStore.logout()
      // 可以在这里添加跳转到登录页的逻辑
      break
    case 403:
      errorMessage = '没有权限访问该资源'
      break
    case 404:
      errorMessage = '请求的资源不存在'
      break
    case 500:
      errorMessage = '服务器内部错误'
      break
    case 502:
      errorMessage = '网关错误'
      break
    case 503:
      errorMessage = '服务不可用'
      break
    case 504:
      errorMessage = '请求超时'
      break
    default:
      errorMessage = (data as any)?.message || `请求失败(${status})`
  }
  
  if (!config?.skipErrorToast) {
    showToast({
      type: 'fail',
      message: errorMessage
    })
  }
}

// 请求重试机制 (暂时保留，可根据需要使用)
export function retryRequest(config: CustomRequestConfig): Promise<any> {
  return new Promise((resolve) => {
    const retryCount = config.retryCount || 3
    const retryDelay = config.retryDelay || 1000
    
    setTimeout(() => {
      config.retryCount = retryCount - 1
      resolve(request(config))
    }, retryDelay)
  })
}

// 导出实例和工具函数
export { showLoading, hideLoading }
export default request
