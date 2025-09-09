# 动态打包目录名称配置说明

## 概述
项目已升级为支持动态生成打包目录名称，可以根据不同环境、项目信息和时间戳自动生成有意义的目录名称。

## 配置方案

### 方案1: 环境变量控制（优先级最高）
创建 `.env` 文件或在构建命令中设置环境变量：
```bash
# .env 文件
VITE_BUILD_DIR=my-custom-dist-folder

# 或者在命令行中设置
VITE_BUILD_DIR=production-v1.0.0 npm run build
```

### 方案2: 自动生成（默认行为）
如果未设置环境变量，系统会根据构建模式自动生成目录名：

#### Production模式
```bash
npm run build
# 生成目录: dist-vue3-project-mobile-template-v0.0.0-2024-12-19T10-30-45
```

#### Staging模式
```bash
npm run build -- --mode staging
# 生成目录: dist-staging-vue3-project-mobile-template-2024-12-19T10-30-45
```

#### Development模式
```bash
npm run build -- --mode development
# 生成目录: dist-dev-2024-12-19T10-30-45
```

## 目录命名规则

### 命名组成
- **项目名称**: 来自 package.json 的 name 字段
- **版本号**: 来自 package.json 的 version 字段
- **时间戳**: 当前构建时间（ISO格式，特殊字符替换为连字符）
- **环境标识**: 根据 --mode 参数确定

### 命名格式
```
生产环境: dist-{项目名称}-v{版本号}-{时间戳}
预发布环境: dist-staging-{项目名称}-{时间戳}
开发环境: dist-dev-{时间戳}
自定义环境: dist-{mode}-{时间戳}
```

## 实际使用示例

### 标准构建
```bash
# 生产构建
npm run build
# 输出: dist-vue3-project-mobile-template-v0.0.0-2024-12-19T10-30-45/

# 预发布构建
npm run build -- --mode staging
# 输出: dist-staging-vue3-project-mobile-template-2024-12-19T10-30-45/
```

### 自定义目录名
```bash
# 方法1: 通过环境变量
VITE_BUILD_DIR=release-v2.1.0 npm run build

# 方法2: 创建 .env 文件
echo "VITE_BUILD_DIR=mobile-app-dist" > .env
npm run build
```

### CI/CD集成示例
```yaml
# GitHub Actions 示例
- name: Build for Production
  env:
    VITE_BUILD_DIR: "dist-${{ github.ref_name }}-${{ github.sha }}"
  run: npm run build

# 输出: dist-main-abc1234/
```

## 配置文件说明

### vite.config.ts 主要变更
1. **导入新模块**: 添加了 `readFileSync` 用于读取 package.json
2. **函数式配置**: 改为函数式配置以支持动态参数
3. **动态目录生成**: `getBuildDirName()` 函数负责生成目录名
4. **环境变量支持**: 通过 `loadEnv()` 加载环境变量

### 核心逻辑
```typescript
const getBuildDirName = () => {
  // 1. 优先使用环境变量
  if (env.VITE_BUILD_DIR) {
    return env.VITE_BUILD_DIR
  }
  
  // 2. 根据模式自动生成
  switch (mode) {
    case 'production':
      return `dist-${projectName}-v${version}-${timestamp}`
    case 'staging':
      return `dist-staging-${projectName}-${timestamp}`
    // ... 其他模式
  }
}
```

## 优势

### 1. 版本追踪
- 每个构建都有唯一的目录名
- 包含版本信息便于版本管理
- 时间戳帮助追踪构建历史

### 2. 环境区分
- 不同环境生成不同格式的目录名
- 避免环境间文件混淆
- 便于自动化部署识别

### 3. 灵活配置
- 支持环境变量完全自定义
- 支持多种命名策略
- 适应不同项目需求

### 4. CI/CD友好
- 支持Git分支、提交哈希等信息
- 便于自动化脚本处理
- 支持构建产物归档

## 注意事项

1. **目录名长度**: 自动生成的目录名可能较长，注意文件系统限制
2. **特殊字符**: 项目名中的特殊字符会被替换为连字符
3. **时区问题**: 时间戳使用UTC时间，注意时区转换
4. **环境变量优先级**: 环境变量设置会覆盖所有自动生成规则

## 回滚方案

如需回滚到固定目录名，修改 vite.config.ts:
```typescript
build: {
  outDir: "dist", // 固定目录名
  // 其他配置...
}
```
