# User Store 存储升级指南

## 概述
用户状态管理已从原生 localStorage 升级为使用 `@/utils/db/index.ts` 的高级存储封装，提供了更丰富的功能和更好的数据管理能力。

## 主要改进

### ✨ 新增功能
1. **数据过期管理** - 自动清理过期数据
2. **嵌套键名支持** - 更好的数据组织结构
3. **内存存储降级** - 存储不可用时的备选方案
4. **Cookie备份** - 小数据的备份存储
5. **数据版本控制** - 支持数据结构升级
6. **存储统计** - 监控存储使用情况
7. **自动迁移** - 从旧版本数据无缝升级

### 🔄 升级内容

#### 存储结构变化
```typescript
// 旧版本
localStorage: {
  "user": "{id: 1, name: 'John', email: 'john@example.com'}"
}

// 新版本
storage: {
  "user.profile": {
    value: {id: 1, name: 'John', email: 'john@example.com'},
    created: 1703123456789,
    expires: 1705715456789,
    tag: 'user-session',
    version: '1.0'
  },
  "user.preferences.theme": {
    value: 'dark',
    created: 1703123456789,
    expires: 1734659456789,
    tag: 'user-preference',
    version: '1.0'
  }
}
```

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <div v-if="userStore.isLoggedIn">
      欢迎，{{ userStore.user?.name }}
    </div>
    <button @click="handleLogin">登录</button>
    <button @click="handleLogout">退出</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 初始化时恢复用户状态
userStore.initializeUser()

function handleLogin() {
  userStore.login({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  })
}

function handleLogout() {
  userStore.logout()
}
</script>
```

### 用户偏好设置

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 设置用户偏好（1年过期）
userStore.setUserPreference('theme', 'dark')
userStore.setUserPreference('language', 'zh-CN')
userStore.setUserPreference('notifications', true)

// 获取用户偏好
const theme = userStore.getUserPreference<string>('theme')
const language = userStore.getUserPreference<string>('language')
const notifications = userStore.getUserPreference<boolean>('notifications')

// 删除用户偏好
userStore.removeUserPreference('theme')
```

### 会话管理

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 延长用户会话（重新设置30天过期时间）
userStore.extendSession()

// 在用户活跃时自动延长会话
document.addEventListener('click', () => {
  if (userStore.isLoggedIn) {
    userStore.extendSession()
  }
})
```

### 存储管理和监控

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 获取存储统计信息
const stats = userStore.getUserStorageStats()
console.log('存储大小:', stats.size)
console.log('存储项数:', stats.count)
console.log('是否使用内存存储:', stats.usingMemory)

// 清理过期的用户数据
userStore.cleanupUserData()

// 获取用户完整信息（包括元数据）
const fullInfo = userStore.getUserFullInfo()
console.log('用户资料:', fullInfo.profile)
console.log('所有用户相关键:', fullInfo.userKeys)
console.log('存储统计:', fullInfo.storageStats)
console.log('是否使用内存存储:', fullInfo.isUsingMemoryStorage)
```

### 组合式应用示例

```vue
<template>
  <div class="user-dashboard">
    <!-- 用户信息 -->
    <div v-if="userStore.isLoggedIn" class="user-info">
      <img :src="userStore.user?.avatar" :alt="userStore.user?.name">
      <h3>{{ userStore.user?.name }}</h3>
      <p>{{ userStore.user?.email }}</p>
      
      <!-- 会话状态 -->
      <div class="session-info">
        <p>存储状态: {{ storageStats.usingMemory ? '内存模式' : '持久化模式' }}</p>
        <p>存储大小: {{ formatBytes(storageStats.size) }}</p>
        <p>存储项目: {{ storageStats.count }}</p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="actions">
        <button @click="userStore.extendSession()">延长会话</button>
        <button @click="userStore.cleanupUserData()">清理数据</button>
        <button @click="userStore.logout()">退出登录</button>
      </div>
    </div>

    <!-- 偏好设置 -->
    <div class="preferences">
      <h4>用户偏好</h4>
      <div>
        <label>
          主题:
          <select v-model="theme" @change="updateTheme">
            <option value="light">明亮</option>
            <option value="dark">深色</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <input 
            type="checkbox" 
            v-model="notifications" 
            @change="updateNotifications"
          >
          启用通知
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 响应式偏好设置
const theme = ref(userStore.getUserPreference<string>('theme') || 'light')
const notifications = ref(userStore.getUserPreference<boolean>('notifications') || true)

// 存储统计
const storageStats = computed(() => userStore.getUserStorageStats())

onMounted(() => {
  // 初始化用户状态
  userStore.initializeUser()
  
  // 定期清理过期数据（可选）
  setInterval(() => {
    userStore.cleanupUserData()
  }, 60 * 60 * 1000) // 每小时清理一次
})

function updateTheme() {
  userStore.setUserPreference('theme', theme.value)
}

function updateNotifications() {
  userStore.setUserPreference('notifications', notifications.value)
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
```

## 迁移指南

### 自动迁移
升级后的 Store 会自动检测并迁移旧版本的 localStorage 数据，无需手动处理。

### 手动检查
如果需要验证迁移是否成功：

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 检查是否有旧数据
const hasLegacyData = localStorage.getItem('user') !== null

if (hasLegacyData) {
  console.log('检测到旧版本数据，将在初始化时自动迁移')
}

// 初始化并迁移
userStore.initializeUser()

// 验证迁移结果
const fullInfo = userStore.getUserFullInfo()
console.log('迁移后的用户信息:', fullInfo)
```

## 最佳实践

### 1. 初始化时机
```typescript
// 在应用启动时初始化
// main.ts 或 App.vue
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.initializeUser()
```

### 2. 会话管理
```typescript
// 在路由守卫中检查会话状态
import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    // 延长活跃用户的会话
    if (userStore.isLoggedIn) {
      userStore.extendSession()
    }
    next()
  }
})
```

### 3. 定期清理
```typescript
// 应用启动时设置定期清理
setInterval(() => {
  const userStore = useUserStore()
  userStore.cleanupUserData()
}, 24 * 60 * 60 * 1000) // 每天清理一次
```

### 4. 错误处理
```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

try {
  userStore.login(userData)
} catch (error) {
  console.error('登录失败:', error)
  // 处理错误逻辑
}
```

## API 参考

### 基础方法
- `login(userData: User)` - 用户登录
- `logout()` - 用户登出
- `updateUser(userData: Partial<User>)` - 更新用户信息
- `initializeUser()` - 初始化用户状态

### 偏好设置
- `setUserPreference(key: string, value: any)` - 设置用户偏好
- `getUserPreference<T>(key: string): T | null` - 获取用户偏好
- `removeUserPreference(key: string)` - 删除用户偏好

### 会话管理
- `extendSession()` - 延长用户会话

### 存储管理
- `getUserStorageStats()` - 获取存储统计
- `cleanupUserData()` - 清理过期数据
- `getUserFullInfo()` - 获取完整用户信息

### 响应式状态
- `user` - 当前用户信息
- `isLoggedIn` - 登录状态

## 注意事项

1. **数据过期**: 用户资料30天过期，偏好设置1年过期
2. **内存模式**: 存储不可用时自动切换到内存模式，数据将在页面刷新时丢失
3. **Cookie备份**: 小数据会备份到Cookie中，但有大小限制
4. **版本控制**: 数据包含版本信息，便于将来升级
5. **性能考虑**: 定期清理过期数据，避免存储空间浪费

## 故障排除

### 问题1: 数据丢失
```typescript
// 检查是否使用内存存储
const userStore = useUserStore()
const fullInfo = userStore.getUserFullInfo()

if (fullInfo.isUsingMemoryStorage) {
  console.warn('当前使用内存存储，数据将在页面刷新时丢失')
}
```

### 问题2: 存储空间不足
```typescript
// 清理过期数据释放空间
const userStore = useUserStore()
userStore.cleanupUserData()

// 检查存储使用情况
const stats = userStore.getUserStorageStats()
console.log('存储使用:', stats)
```

### 问题3: 旧数据兼容
升级后会自动迁移旧数据，如有问题可手动清理：
```typescript
// 清理旧版本数据
localStorage.removeItem('user')

// 重新初始化
const userStore = useUserStore()
userStore.initializeUser()
```
