/**
 * 请求相关的类型定义
 */

// 用户登录信息
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  userInfo: UserInfo
  expiresIn: number
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

// 分页请求参数
export interface PaginationRequest {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 通用列表响应
export interface ListResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 文件上传响应
export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
  uploadTime: string
}

// 通用删除请求
export interface DeleteRequest {
  ids: number[]
}

// 通用状态更新请求
export interface StatusUpdateRequest {
  id: number
  status: 0 | 1  // 0-禁用, 1-启用
}

// 错误详情
export interface ErrorDetail {
  code: string
  message: string
  field?: string
  value?: any
}

// API响应错误扩展
export interface ApiError {
  code: number
  message: string
  details?: ErrorDetail[]
  timestamp: string
  path: string
}
