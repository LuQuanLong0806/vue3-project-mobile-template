# Axios 请求工具封装

这是一个基于 axios 的完善请求工具封装，集成了项目的用户管理、日志系统、环境配置和 Vant 组件库等功能。

## 🚀 特性

- ✅ **统一配置管理** - 集成项目的环境配置系统
- ✅ **用户认证** - 自动处理token、用户状态等
- ✅ **智能Loading** - 自动显示/隐藏加载状态
- ✅ **错误处理** - 统一的错误处理和用户提示
- ✅ **请求日志** - 完整的请求/响应日志记录
- ✅ **防重复请求** - 自动防止短时间内的重复请求
- ✅ **类型安全** - 完整的 TypeScript 类型定义
- ✅ **请求缓存** - 支持请求结果缓存
- ✅ **文件上传/下载** - 便捷的文件操作
- ✅ **批量请求** - 支持并发请求处理
- ✅ **分页请求** - 内置分页请求支持

## 📁 文件结构

```
src/utils/request/
├── index.ts        # 核心axios配置和拦截器
├── api.ts          # 请求方法封装（get, post, put等）
├── types.ts        # 类型定义
├── examples.ts     # 使用示例
└── README.md       # 文档说明
```

## 🔧 配置选项

### CustomRequestConfig

扩展了 axios 的配置，支持以下自定义选项：

```typescript
interface CustomRequestConfig {
  skipAuth?: boolean        // 跳过认证（默认false）
  skipLoading?: boolean     // 跳过loading提示（默认false）
  skipErrorToast?: boolean  // 跳过错误提示（默认false）
  retryCount?: number       // 重试次数（默认3）
  retryDelay?: number       // 重试延迟时间（默认1000ms）
}
```

## 📖 使用方法

### 基本请求

```typescript
import { get, post, put, del } from '@/utils/request/api'

// GET 请求
const users = await get<User[]>('/api/users')

// POST 请求
const newUser = await post<User>('/api/users', userData)

// PUT 请求  
const updatedUser = await put<User>(`/api/users/${id}`, userData)

// DELETE 请求
await del(`/api/users/${id}`)
```

### 自定义配置

```typescript
import { get } from '@/utils/request/api'
import type { CustomRequestConfig } from '@/utils/request'

// 跳过loading和错误提示的静默请求
const config: CustomRequestConfig = {
  skipLoading: true,
  skipErrorToast: true
}
const data = await get('/api/config', {}, config)

// 公开API请求（跳过认证）
const publicData = await get('/api/public/data', {}, { 
  skipAuth: true 
})
```

### 文件操作

```typescript
import { upload, download } from '@/utils/request/api'

// 文件上传
const result = await upload('/api/upload', file, {
  onUploadProgress: (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    console.log(`上传进度: ${progress}%`)
  }
})

// 文件下载
await download('/api/files/report.pdf', 'my-report.pdf')
```

### 分页请求

```typescript
import { getPagination } from '@/utils/request/api'

const result = await getPagination<User>('/api/users', {
  page: 1,
  pageSize: 20,
  keyword: 'search'
})

console.log(result.data.list)     // 用户列表
console.log(result.data.total)    // 总数
```

### 批量请求

```typescript
import { batchRequest } from '@/utils/request/api'

const requests = [
  { method: 'get', url: '/api/users' },
  { method: 'get', url: '/api/posts' },
  { method: 'post', url: '/api/analytics', data: { event: 'page_view' } }
]

const [users, posts, analytics] = await batchRequest(requests)
```

### 请求缓存

```typescript
import { withCache, clearCache } from '@/utils/request/api'

// 缓存请求（缓存5分钟）
const config = await withCache(
  () => get('/api/app/config'),
  'app_config',
  5 * 60 * 1000
)

// 清除缓存
clearCache('app_config')
```

## 🔐 认证处理

工具会自动处理用户认证：

- 自动在请求头添加 Authorization token
- 401错误时自动清除用户登录状态  
- 支持跳过认证的公开API请求

```typescript
// 需要认证的请求（默认）
const userProfile = await get('/api/user/profile')

// 跳过认证的公开请求
const publicData = await get('/api/public/news', {}, { 
  skipAuth: true 
})
```

## 📱 UI 交互

集成了 Vant 组件库的用户提示：

- 自动显示/隐藏 Loading 状态
- 网络错误和业务错误的 Toast 提示
- 支持跳过默认的UI提示

```typescript
// 静默请求（跳过loading和错误提示）
const data = await get('/api/data', {}, {
  skipLoading: true,
  skipErrorToast: true
})
```

## 📝 日志记录

所有请求都会自动记录日志（基于项目的 Logger 工具）：

- 请求发送时记录请求信息
- 响应成功时记录响应数据  
- 错误时记录错误详情
- 根据环境配置控制日志级别

## ⚠️ 错误处理

工具提供了完善的错误处理机制：

- 网络错误自动提示用户检查网络
- HTTP状态码错误有相应的中文提示
- 业务逻辑错误显示服务器返回的错误信息
- 支持自定义错误处理逻辑

```typescript
try {
  const data = await get('/api/data')
} catch (error) {
  // 错误已经被拦截器处理并显示提示
  // 这里可以添加额外的错误处理逻辑
  console.error('请求失败:', error)
}
```

## 🎯 Vue 组合式 API 使用

```typescript
import { ref, readonly } from 'vue'
import { get, post } from '@/utils/request/api'

export function useUserApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const fetchUser = async (userId: number) => {
    try {
      loading.value = true
      error.value = null
      const response = await get<User>(`/api/users/${userId}`)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchUser
  }
}
```

## 🔧 环境配置

工具自动读取项目的环境配置：

- `VITE_API_BASE_URL` - API基础地址
- `VITE_API_TIMEOUT` - 请求超时时间  
- `VITE_LOG_LEVEL` - 日志级别
- `VITE_ENABLE_DEBUG` - 调试模式开关

## 📚 更多示例

查看 `examples.ts` 文件获取更多详细的使用示例，包括：

- 各种请求方法的使用
- 自定义配置的应用
- 文件上传下载
- 错误处理策略
- Vue组件中的集成使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个工具封装。
