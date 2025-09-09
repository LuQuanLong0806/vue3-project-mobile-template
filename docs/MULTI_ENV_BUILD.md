# Vue3 + Vite 多环境打包配置指南

## 🎯 概述

本指南详细介绍如何在 Vue3 + Vite 项目中配置多环境打包，支持开发、测试、预发布、生产等多个环境。

## 📁 环境文件结构

```
项目根目录/
├── .env                    # 所有环境通用配置
├── .env.development        # 开发环境配置
├── .env.test              # 测试环境配置
├── .env.staging           # 预发布环境配置
├── .env.production        # 生产环境配置
└── .env.local             # 本地环境配置（不提交到git）
```

## ⚙️ 环境配置详解

### 1. 基础配置 (`.env`)
```bash
# 所有环境通用的配置
VITE_APP_TITLE=南京场景服务平台
VITE_APP_PACK_NAME=scene-service-portal-mobile
VITE_APP_VERSION=1.0.0
```

### 2. 开发环境 (`.env.development`)
```bash
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK=true
VITE_APP_TITLE=南京场景服务平台(开发)
VITE_LOG_LEVEL=debug
```

### 3. 测试环境 (`.env.test`)
```bash
VITE_APP_ENV=test
VITE_API_BASE_URL=https://test-api.example.com/api
VITE_API_TIMEOUT=15000
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK=false
VITE_APP_TITLE=南京场景服务平台(测试)
VITE_LOG_LEVEL=info
```

### 4. 预发布环境 (`.env.staging`)
```bash
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.example.com/api
VITE_API_TIMEOUT=20000
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK=false
VITE_APP_TITLE=南京场景服务平台(预发布)
VITE_LOG_LEVEL=warn
```

### 5. 生产环境 (`.env.production`)
```bash
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK=false
VITE_APP_TITLE=南京场景服务平台
VITE_LOG_LEVEL=error
```

## 📦 打包脚本配置

在 `package.json` 中配置不同环境的打包命令：

```json
{
  "scripts": {
    // 开发服务
    "dev": "vite --mode development",
    "dev:test": "vite --mode test",
    "dev:staging": "vite --mode staging",
    
    // 构建打包
    "build": "vue-tsc && vite build --mode production",
    "build:dev": "vue-tsc && vite build --mode development",
    "build:test": "vue-tsc && vite build --mode test",
    "build:staging": "vue-tsc && vite build --mode staging",
    "build:prod": "vue-tsc && vite build --mode production",
    
    // 预览服务
    "preview": "vite preview",
    "preview:test": "vite preview --mode test",
    "preview:staging": "vite preview --mode staging",
    
    // 构建分析
    "build:analyze": "vue-tsc && vite build --mode production && npx vite-bundle-analyzer dist"
  }
}
```

## 🛠️ Vite 配置

在 `vite.config.ts` 中配置多环境支持：

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log(`🚀 构建模式: ${mode}`)
  console.log(`📦 构建命令: ${command}`)
  console.log(`🌍 API地址: ${env.VITE_API_BASE_URL}`)

  return {
    // ... 其他配置
    
    // 根据环境配置不同的构建选项
    build: {
      outDir: `dist-${mode}`, // 不同环境输出到不同目录
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
    },
    
    // 开发服务器配置
    server: {
      port: mode === 'test' ? 3001 : mode === 'staging' ? 3002 : 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        }
      }
    },
    
    // 环境变量配置
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_MODE__: JSON.stringify(mode)
    }
  }
})
```

## 💻 代码中使用环境配置

### 1. 创建环境配置工具类

```typescript
// src/utils/env.ts
export class EnvConfig {
  static get env() {
    return import.meta.env.VITE_APP_ENV;
  }
  
  static get apiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  static get isDebugEnabled() {
    return import.meta.env.VITE_ENABLE_DEBUG === 'true';
  }
  
  static get isDevelopment() {
    return this.env === 'development';
  }
  
  static get isProduction() {
    return this.env === 'production';
  }
}
```

### 2. 在组件中使用

```vue
<script setup lang="ts">
import EnvConfig from '@/utils/env';

// 根据环境显示不同信息
const title = computed(() => {
  return EnvConfig.isDevelopment 
    ? `${import.meta.env.VITE_APP_TITLE} (开发版)`
    : import.meta.env.VITE_APP_TITLE;
});

// 根据环境配置API请求
const apiClient = axios.create({
  baseURL: EnvConfig.apiBaseUrl,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT)
});
</script>
```

## 🚀 使用方法

### 1. 开发环境

```bash
# 启动开发服务器（默认开发环境）
npm run dev

# 启动测试环境开发服务器
npm run dev:test

# 启动预发布环境开发服务器
npm run dev:staging
```

### 2. 构建打包

```bash
# 构建生产环境（默认）
npm run build

# 构建开发环境包
npm run build:dev

# 构建测试环境包
npm run build:test

# 构建预发布环境包
npm run build:staging

# 构建生产环境包
npm run build:prod
```

### 3. 预览构建结果

```bash
# 预览生产环境构建
npm run preview

# 预览测试环境构建
npm run preview:test

# 预览预发布环境构建
npm run preview:staging
```

## 📊 构建结果

不同环境构建后会生成不同的目录：

```
项目根目录/
├── dist-development/     # 开发环境构建
├── dist-test/           # 测试环境构建
├── dist-staging/        # 预发布环境构建
└── dist-production/     # 生产环境构建
```

## 🎯 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches:
      - develop    # 触发测试环境部署
      - staging    # 触发预发布环境部署
      - main       # 触发生产环境部署

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build for Test
        if: github.ref == 'refs/heads/develop'
        run: npm run build:test
        
      - name: Build for Staging
        if: github.ref == 'refs/heads/staging'
        run: npm run build:staging
        
      - name: Build for Production
        if: github.ref == 'refs/heads/main'
        run: npm run build:prod
```

## ⚡ 优化建议

### 1. 环境变量验证

```typescript
// src/utils/env-validator.ts
export function validateEnvVars() {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_APP_TITLE'
  ];
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      throw new Error(`缺少必需的环境变量: ${varName}`);
    }
  }
}
```

### 2. 环境特定的优化

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  return {
    build: {
      // 生产环境启用更多优化
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : {},
      
      // 测试环境保留更多信息用于调试
      minify: mode === 'test' ? false : 'esbuild'
    }
  }
})
```

## 🔒 安全注意事项

1. **敏感信息**：不要在环境变量中存储密钥、密码等敏感信息
2. **环境隔离**：确保不同环境使用不同的API地址和数据库
3. **权限控制**：生产环境应禁用调试功能和Mock数据
4. **版本控制**：`.env.local` 不应提交到版本控制系统

## 📋 环境对比表

| 环境 | 用途 | 调试 | Mock | 日志级别 | API地址 |
|------|------|------|------|----------|---------|
| Development | 本地开发 | ✅ | ✅ | debug | localhost |
| Test | 功能测试 | ✅ | ❌ | info | test-api |
| Staging | 预发布测试 | ❌ | ❌ | warn | staging-api |
| Production | 生产环境 | ❌ | ❌ | error | api |

这样的多环境配置可以确保在不同的开发阶段使用合适的配置，提高开发效率和部署安全性。
