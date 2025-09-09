/**
 * API 请求方法封装
 * 提供常用的 HTTP 请求方法，支持泛型和自定义配置
 */
import request, { type CustomRequestConfig, type ApiResponse } from './index'

/**
 * GET 请求
 */
export function get<T = any>(
  url: string, 
  params?: Record<string, any>, 
  config?: CustomRequestConfig
): Promise<ApiResponse<T>> {
  return request.get(url, {
    params,
    ...config
  })
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string, 
  data?: any, 
  config?: CustomRequestConfig
): Promise<ApiResponse<T>> {
  return request.post(url, data, config)
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string, 
  data?: any, 
  config?: CustomRequestConfig
): Promise<ApiResponse<T>> {
  return request.put(url, data, config)
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  url: string, 
  config?: CustomRequestConfig
): Promise<ApiResponse<T>> {
  return request.delete(url, config)
}

/**
 * PATCH 请求
 */
export function patch<T = any>(
  url: string, 
  data?: any, 
  config?: CustomRequestConfig
): Promise<ApiResponse<T>> {
  return request.patch(url, data, config)
}

/**
 * 文件上传
 */
export function upload<T = any>(
  url: string,
  file: File | Blob,
  config?: CustomRequestConfig & {
    onUploadProgress?: (progressEvent: any) => void
  }
): Promise<ApiResponse<T>> {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

/**
 * 多文件上传
 */
export function uploadMultiple<T = any>(
  url: string,
  files: (File | Blob)[],
  config?: CustomRequestConfig & {
    onUploadProgress?: (progressEvent: any) => void
  }
): Promise<ApiResponse<T>> {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })
  
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

/**
 * 下载文件
 */
export function download(
  url: string,
  filename?: string,
  params?: Record<string, any>,
  config?: CustomRequestConfig
): Promise<void> {
  return request.get(url, {
    params,
    responseType: 'blob',
    ...config
  }).then((response: any) => {
    const blob = new Blob([response])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

/**
 * 分页请求
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getPagination<T = any>(
  url: string,
  params?: PaginationParams,
  config?: CustomRequestConfig
): Promise<ApiResponse<PaginationResponse<T>>> {
  const defaultParams: PaginationParams = {
    page: 1,
    pageSize: 20,
    ...params
  }
  
  return get(url, defaultParams, config)
}

/**
 * 批量请求
 */
export function batchRequest(
  requests: Array<{
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    url: string
    data?: any
    params?: any
    config?: CustomRequestConfig
  }>
): Promise<ApiResponse<any>[]> {
  const promises = requests.map(req => {
    switch (req.method) {
      case 'get':
        return get(req.url, req.params, req.config)
      case 'post':
        return post(req.url, req.data, req.config)
      case 'put':
        return put(req.url, req.data, req.config)
      case 'delete':
        return del(req.url, req.config)
      case 'patch':
        return patch(req.url, req.data, req.config)
      default:
        return Promise.reject(new Error(`不支持的请求方法: ${req.method}`))
    }
  })
  
  return Promise.all(promises)
}

/**
 * 请求缓存装饰器
 */
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

export function withCache<T = any>(
  requestFn: () => Promise<T>,
  cacheKey: string,
  cacheDuration: number = CACHE_DURATION
): Promise<T> {
  const cached = requestCache.get(cacheKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < cacheDuration) {
    return Promise.resolve(cached.data)
  }
  
  return requestFn().then(data => {
    requestCache.set(cacheKey, {
      data,
      timestamp: now
    })
    return data
  })
}

/**
 * 清除请求缓存
 */
export function clearCache(cacheKey?: string): void {
  if (cacheKey) {
    requestCache.delete(cacheKey)
  } else {
    requestCache.clear()
  }
}

// 导出所有方法
export {
  get as apiGet,
  post as apiPost,
  put as apiPut,
  del as apiDelete,
  patch as apiPatch,
  upload as apiUpload,
  uploadMultiple as apiUploadMultiple,
  download as apiDownload,
  getPagination as apiGetPagination,
  batchRequest as apiBatchRequest
}
