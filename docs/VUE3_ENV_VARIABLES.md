# Vue3 + Vite 环境变量使用指南

## 🚨 重要说明

在 Vue3 + Vite 项目中，**不要使用 `process.env`**，应该使用 `import.meta.env`。

## ❌ 错误用法

```typescript
// 这在 Vite 项目中会报错！
const env = process.env;
const isDev = process.env.NODE_ENV === 'development';
```

## ✅ 正确用法

```typescript
// 在 Vite 项目中使用 import.meta.env
const env = import.meta.env;
const isDev = import.meta.env.DEV;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

## 🔧 环境变量配置

### 1. 环境变量文件

在项目根目录创建环境变量文件：

```bash
# .env                # 所有环境通用
# .env.local          # 所有环境通用，被 git 忽略
# .env.development    # 开发环境
# .env.production     # 生产环境
```

### 2. 环境变量命名规则

```bash
# .env
VITE_APP_TITLE=Vue3移动端应用
VITE_APP_PACK_NAME=scene-portal-mobile
VITE_API_BASE_URL=https://api.example.com
```

**注意**：只有以 `VITE_` 开头的环境变量才会暴露给客户端代码！

### 3. TypeScript 类型定义

在 `src/vite-env.d.ts` 中定义类型：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_PACK_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 📋 内置环境变量

Vite 提供以下内置环境变量：

| 变量名 | 类型 | 描述 |
|--------|------|------|
| `import.meta.env.MODE` | string | 应用运行模式 |
| `import.meta.env.BASE_URL` | string | 应用的基础 URL |
| `import.meta.env.PROD` | boolean | 是否为生产环境 |
| `import.meta.env.DEV` | boolean | 是否为开发环境 |
| `import.meta.env.SSR` | boolean | 是否为服务端渲染 |

## 💻 使用示例

### 基础用法

```typescript
// 获取环境信息
console.log('当前模式:', import.meta.env.MODE);
console.log('是否开发环境:', import.meta.env.DEV);
console.log('应用标题:', import.meta.env.VITE_APP_TITLE);

// 条件代码
if (import.meta.env.DEV) {
  console.log('开发环境调试信息');
}

// API 地址配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

### 工具类中使用

```typescript
// utils/config.ts
class Config {
  static get isDev(): boolean {
    return import.meta.env.DEV;
  }
  
  static get appName(): string {
    return import.meta.env.VITE_APP_PACK_NAME || 'app';
  }
  
  static get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || '/api';
  }
}

export default Config;
```

### 存储类中使用

```typescript
// utils/storage.ts
import { MyLocalStorage } from './db';

const storage = new MyLocalStorage({
  db_name: `${import.meta.env.VITE_APP_PACK_NAME}_STORAGE`,
  storage: window.localStorage,
  debug: import.meta.env.DEV
});

export { storage };
```

## 🔍 调试环境变量

```typescript
// 在开发环境打印所有环境变量
if (import.meta.env.DEV) {
  console.log('所有环境变量:', import.meta.env);
}
```

## ⚠️ 安全注意事项

1. **不要在环境变量中存储敏感信息**（如 API 密钥、数据库密码等）
2. **以 `VITE_` 开头的变量会打包到客户端代码中**，任何人都可以看到
3. **敏感配置应该在服务端处理**

## 🔧 Vite 配置

如果需要自定义环境变量处理，可以在 `vite.config.ts` 中配置：

```typescript
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
    },
    // 其他配置...
  };
});
```

## 📚 对比表格

| 方面 | Node.js (`process.env`) | Vite (`import.meta.env`) |
|------|-------------------------|--------------------------|
| **运行环境** | 服务端 | 客户端（浏览器） |
| **变量前缀** | 无限制 | 必须以 `VITE_` 开头 |
| **开发环境判断** | `NODE_ENV === 'development'` | `import.meta.env.DEV` |
| **生产环境判断** | `NODE_ENV === 'production'` | `import.meta.env.PROD` |
| **类型安全** | 需要手动定义 | TypeScript 原生支持 |
| **运行时可用性** | ❌ 浏览器中不可用 | ✅ 浏览器中可用 |

## 🚀 迁移指南

如果你的项目中有使用 `process.env` 的代码，需要进行以下迁移：

### 1. 替换环境变量访问

```typescript
// 之前
const isDev = process.env.NODE_ENV === 'development';
const appName = process.env.VUE_APP_NAME;

// 之后
const isDev = import.meta.env.DEV;
const appName = import.meta.env.VITE_APP_NAME;
```

### 2. 更新环境变量名

```bash
# .env 文件中
# 之前
VUE_APP_TITLE=应用标题
VUE_APP_API_URL=https://api.example.com

# 之后
VITE_APP_TITLE=应用标题
VITE_API_URL=https://api.example.com
```

### 3. 更新类型定义

在 `src/vite-env.d.ts` 中添加新的环境变量类型定义。

## 💡 最佳实践

1. **统一管理**：创建一个配置文件统一管理所有环境变量
2. **类型安全**：在 TypeScript 中定义环境变量的类型
3. **默认值**：为环境变量提供合理的默认值
4. **文档化**：在项目文档中说明所有可用的环境变量
5. **验证**：在应用启动时验证必需的环境变量是否存在

记住：在 Vue3 + Vite 项目中，**总是使用 `import.meta.env` 而不是 `process.env`**！
