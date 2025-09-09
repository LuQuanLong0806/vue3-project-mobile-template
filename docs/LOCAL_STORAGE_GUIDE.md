# 本地存储工具类 TypeScript 重构文档

## 📋 概述

`MyLocalStorage` 是一个功能强大的 TypeScript 本地存储工具类，提供了统一的 API 来操作 localStorage、sessionStorage，并在存储不可用时自动降级到内存存储。

## 🔄 TypeScript 重构内容

### 主要改进

1. **完整的类型定义**：添加了所有接口和类型声明
2. **类型安全**：使用泛型确保数据类型安全
3. **现代化语法**：采用 ES6+ 特性和 TypeScript 最佳实践
4. **增强的错误处理**：更完善的异常处理机制
5. **调试支持**：可选的调试模式
6. **扩展功能**：新增统计、键名获取等实用方法

## 📝 接口定义

### 存储选项接口
```typescript
interface StorageOptions {
  /** 过期时间戳 */
  expires?: number;
  /** 是否跳过警告 */
  skipWarning?: boolean;
  /** 自定义标签 */
  tag?: string;
  /** 数据版本 */
  version?: string;
}
```

### 存储数据结构
```typescript
interface StorageItem<T = any> {
  /** 存储的值 */
  value: T;
  /** 创建时间戳 */
  created: number;
  /** 过期时间戳 */
  expires?: number;
  /** 标签 */
  tag?: string;
  /** 版本 */
  version?: string;
}
```

### 配置选项
```typescript
interface LocalStorageConfig {
  /** 数据库名称 */
  db_name?: string;
  /** 存储实例 */
  storage?: Storage;
  /** 是否启用调试模式 */
  debug?: boolean;
}
```

## 🚀 使用方法

### 基础用法

```typescript
import { storage } from '@/utils/db';

// 存储数据
storage.set('username', 'john_doe');
storage.set('user', { name: '张三', age: 25 });

// 获取数据
const username = storage.get<string>('username');
const user = storage.get<{ name: string; age: number }>('user');

// 删除数据
storage.remove('username');
```

### 嵌套路径支持

```typescript
// 设置嵌套数据
storage.set('user.profile.name', '李四');
storage.set('user.profile.avatar', '/avatar.jpg');

// 获取嵌套数据
const name = storage.get<string>('user.profile.name');
const avatar = storage.get<string>('user.profile.avatar');

// 删除嵌套数据
storage.remove('user.profile.avatar');
```

### 过期时间设置

```typescript
// 设置1小时后过期
const oneHour = Date.now() + 60 * 60 * 1000;
storage.set('token', 'abc123', { expires: oneHour });

// 获取时会自动检查过期（过期数据会被自动删除）
const token = storage.get<string>('token');
```

### 获取完整存储对象

```typescript
// 获取完整的存储对象（包含元数据）
const fullData = storage.get<string>('token', true);
console.log(fullData);
// {
//   value: 'abc123',
//   created: 1640995200000,
//   expires: 1641081600000,
//   tag: 'auth',
//   version: '1.0'
// }
```

### 批量操作

```typescript
// 批量删除
storage.remove(['temp1', 'temp2', 'temp3']);

// 获取所有键名
const allKeys = storage.getAllKeys();
console.log(allKeys); // ['user.profile.name', 'user.profile.avatar', ...]
```

### 存储统计

```typescript
// 获取存储使用情况
const stats = storage.getStorageStats();
console.log(stats);
// {
//   size: 1024,        // 数据大小（字节）
//   count: 15,         // 数据条目数量
//   usingMemory: false // 是否使用内存存储
// }
```

## 🏗️ 类结构

### 公开方法

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| `set<T>(key, value, options?)` | 存储数据 | key: string, value: T, options?: StorageOptions | boolean |
| `get<T>(key, all?)` | 获取数据 | key: string, all?: boolean | T \| StorageItem<T> \| null |
| `remove(key)` | 删除数据 | key: string \| string[] | boolean |
| `clear()` | 清空所有数据 | - | boolean |
| `getAllKeys()` | 获取所有键名 | - | string[] |
| `getStorageStats()` | 获取存储统计 | - | { size: number; count: number; usingMemory: boolean } |
| `isUsingMemoryStorage()` | 检查是否使用内存存储 | - | boolean |

### 私有方法

| 方法 | 描述 |
|------|------|
| `isStorageAvailable()` | 检查存储是否可用 |
| `createMemoryStorage()` | 创建内存存储实例 |
| `trySetCookie()` / `tryGetCookie()` / `tryRemoveCookie()` | Cookie 备份操作 |
| `getDBData()` / `setDBData()` | 数据库数据操作 |
| `setValue()` / `getValue()` / `removeValue()` | 嵌套路径数据操作 |
| `isObject()` / `getKeys()` | 工具方法 |

## 🎯 高级特性

### 1. 自动降级机制

```typescript
// 当 localStorage 不可用时，自动使用内存存储
const storage = new MyLocalStorage({
  storage: window.localStorage // 如果不可用会自动降级
});

console.log(storage.isUsingMemoryStorage()); // true/false
```

### 2. 调试模式

```typescript
// 开发环境启用调试模式
const storage = new MyLocalStorage({
  debug: true
});

// 会在控制台输出详细的操作日志
storage.set('test', 'value'); // 控制台: "已存储数据: test"
```

### 3. Cookie 备份

```typescript
// 内存存储模式下，小于2KB的数据会自动备份到Cookie
// 确保重要数据在页面刷新后仍然可用
```

### 4. 过期检查

```typescript
// 每次获取数据时自动检查过期时间
const data = storage.get('expiredData'); // 过期数据返回 null 并自动删除
```

## 📦 预定义实例

```typescript
import { storage, sessionStorage } from '@/utils/db';

// 持久化存储实例（localStorage）
storage.set('persistent', 'data');

// 会话存储实例（sessionStorage）
sessionStorage.set('temporary', 'data');
```

## 🔧 UUID 工具

### 新增的 UUID 生成器

```typescript
import { generateUUID, uuid } from '@/utils/db';

// 新的标准方法
const id1 = generateUUID(); // 标准RFC4122格式
const id2 = generateUUID({ length: 16 }); // 指定长度
const id3 = generateUUID({ length: 8, radix: 16 }); // 16进制

// 兼容旧版本（已废弃）
const id4 = uuid(12, 36);
```

## ⚠️ 重构注意事项

### 破坏性变更

1. **类构造函数参数变化**
   ```typescript
   // 旧版本
   new MyLocalStorage({ db_name: 'test', storage: localStorage });
   
   // 新版本（兼容，但推荐使用对象参数）
   new MyLocalStorage({ db_name: 'test', storage: localStorage, debug: false });
   ```

2. **方法返回值类型**
   ```typescript
   // 现在所有方法都有明确的返回类型
   const success: boolean = storage.set('key', 'value');
   const data: string | null = storage.get<string>('key');
   ```

### 兼容性保障

1. **向后兼容**：保持了所有原有 API
2. **渐进式升级**：可以逐步采用新的类型定义
3. **错误处理**：更完善的异常处理，不会破坏现有功能

## 🧪 测试建议

```typescript
// 测试基础功能
describe('MyLocalStorage', () => {
  let storage: MyLocalStorage;
  
  beforeEach(() => {
    storage = new MyLocalStorage({ debug: true });
  });
  
  afterEach(() => {
    storage.clear();
  });
  
  test('should store and retrieve data', () => {
    storage.set('test', 'value');
    expect(storage.get('test')).toBe('value');
  });
  
  test('should handle nested paths', () => {
    storage.set('user.name', 'John');
    expect(storage.get('user.name')).toBe('John');
  });
  
  test('should handle expiration', (done) => {
    storage.set('temp', 'value', { expires: Date.now() + 100 });
    setTimeout(() => {
      expect(storage.get('temp')).toBeNull();
      done();
    }, 150);
  });
});
```

## 📊 性能优化

1. **延迟解析**：只在需要时解析 JSON 数据
2. **缓存机制**：避免重复的序列化/反序列化
3. **内存管理**：及时清理过期数据
4. **类型检查**：编译时类型检查，运行时性能更好

## 🔮 未来规划

1. **加密存储**：敏感数据自动加密
2. **数据压缩**：大数据自动压缩存储
3. **同步机制**：多 Tab 页数据同步
4. **存储配额管理**：智能清理机制
5. **数据迁移**：版本升级数据迁移工具

## 💡 最佳实践

1. **使用泛型**：明确指定数据类型
2. **设置过期时间**：避免数据无限增长
3. **启用调试模式**：开发环境便于调试
4. **异常处理**：检查方法返回值
5. **嵌套路径**：合理组织数据结构

这个 TypeScript 重构版本提供了更好的类型安全、更强的功能和更好的开发体验，同时保持了与原版本的兼容性。
