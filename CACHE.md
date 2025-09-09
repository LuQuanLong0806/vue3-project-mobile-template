# 📦 路由缓存系统使用指南

## 🎯 功能概述

本项目集成了完整的路由缓存系统，可以显著提升用户体验，减少页面重复渲染和数据重新加载的时间。

## ✨ 主要特性

- 🚀 **智能缓存管理** - 基于路由配置自动管理页面缓存
- ⏰ **时间控制** - 支持缓存过期时间设置
- 🔧 **可视化管理** - 内置缓存管理界面
- 💾 **多种缓存类型** - 页面缓存、数据缓存、表单缓存
- 🎛️ **灵活配置** - 支持动态启用/禁用缓存
- 📊 **缓存统计** - 实时监控缓存状态和性能

## 🛠️ 使用方法

### 1. 路由缓存配置

在 `src/router/index.ts` 中配置路由缓存：

```typescript
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/Example.vue'),
  meta: {
    title: '示例页面',
    keepAlive: true,        // 启用缓存
    cacheKey: 'example',    // 缓存键名
    hideLayout: false       // 是否隐藏布局
  }
}
```

### 2. 页面级缓存使用

在组件中使用缓存 Composable：

```vue
<script setup lang="ts">
import { useCache } from '@/composables/useCache'

const { isCached, refresh, enable, disable } = useCache({
  key: 'my-page',
  enabled: true,
  duration: 10, // 10分钟
  onActivated: () => {
    console.log('页面被激活')
  },
  onDeactivated: () => {
    console.log('页面被失活')
  }
})
</script>
```

### 3. 数据缓存使用

```typescript
import { useDataCache } from '@/composables/useCache'

const { fetchWithCache, get, set, remove } = useDataCache('user-list', {
  ttl: 5 * 60 * 1000, // 5分钟缓存
  fetcher: async () => {
    // 获取数据的函数
    return await api.getUserList()
  }
})

// 使用缓存的数据获取
const users = await fetchWithCache()
```

### 4. 表单缓存使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFormCache } from '@/composables/useCache'

const formData = ref({
  name: '',
  email: '',
  password: ''
})

const { save, restore, clear } = useFormCache(formData, 'user-form', {
  autoSave: true,
  saveInterval: 3000,
  excludeFields: ['password'] // 排除敏感字段
})

// 页面加载时恢复数据
onMounted(() => {
  restore()
})
</script>
```

## 🎛️ 缓存管理界面

访问 `/cache-manager` 路径可以打开缓存管理界面，支持：

- 📊 查看缓存统计信息
- 🔄 刷新单个页面缓存
- 🗑️ 清除过期或全部缓存
- ⚙️ 动态启用/禁用缓存规则
- 📈 查看导航历史记录

## 🔧 高级配置

### 缓存规则管理

```typescript
import { useCacheStore } from '@/stores/cache'

const cacheStore = useCacheStore()

// 添加自定义缓存规则
cacheStore.addCacheRule({
  name: 'DetailPage',
  condition: {
    from: ['ListPage'], // 从列表页进入时缓存
    to: ['DetailPage']
  },
  duration: 15, // 15分钟
  maxInstances: 3
})
```

### 手动缓存操作

```typescript
import { cacheManager } from '@/utils/cache'

// 刷新指定页面缓存
cacheManager.refresh('Home')

// 预加载页面
cacheManager.preload('Profile')

// 批量操作
cacheManager.batch('remove', ['Page1', 'Page2'])

// 获取缓存统计
const stats = cacheManager.getStats()
```

## 🎨 缓存装饰器

为组件方法添加缓存：

```typescript
import { cached } from '@/utils/cache'

class UserService {
  @cached(5 * 60 * 1000) // 缓存5分钟
  async getUserProfile(userId: string) {
    return await api.getUser(userId)
  }
}
```

## 📈 性能监控

系统会自动记录缓存命中率和性能指标：

```typescript
import { CacheUtils } from '@/utils/cache'

// 检查缓存健康状态
const health = CacheUtils.checkHealth()
console.log('缓存状态:', health.status) // healthy | warning | error
console.log('详细信息:', health.details)
```

## ⚠️ 注意事项

1. **缓存大小限制** - 避免缓存过多页面，建议不超过10个
2. **敏感数据** - 不要缓存包含敏感信息的页面
3. **内存使用** - 定期清理过期缓存以释放内存
4. **调试模式** - 开发时可以禁用缓存便于调试

## 🔍 故障排查

### 常见问题

1. **页面没有被缓存**
   - 检查路由配置中的 `keepAlive` 设置
   - 确认组件名称与缓存规则匹配

2. **缓存数据不更新**
   - 使用刷新功能清除缓存
   - 检查缓存过期时间设置

3. **内存占用过高**
   - 减少缓存页面数量
   - 设置合适的过期时间
   - 定期清理过期缓存

### 调试工具

- 打开缓存管理页面查看状态
- 检查浏览器开发者工具的控制台日志
- 使用 `cacheManager.exportConfig()` 导出配置进行分析

## 📚 最佳实践

1. **分层缓存** - 页面、组件、数据分别设置缓存策略
2. **智能更新** - 根据用户操作智能更新相关缓存
3. **优雅降级** - 缓存失败时应有备用方案
4. **用户体验** - 提供缓存状态的视觉反馈

---

💡 **提示**: 合理使用缓存可以显著提升应用性能，但过度缓存可能导致数据不一致问题。建议根据具体业务场景制定缓存策略。
