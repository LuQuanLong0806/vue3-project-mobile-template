# Vue3 移动端应用

这是一个现代化的 Vue3 移动端应用模板，集成了最新的开发工具和最佳实践，使用**Vant UI组件库**和**PostCSS移动端适配方案**。

## 🚀 主要特性

- ⚡ **Vue 3** - 最新的 Vue.js 框架
- 🔥 **Vite** - 极速的构建工具
- 💪 **TypeScript** - 强类型支持
- 📱 **Vant UI** - 轻量、可靠的移动端组件库
- 🛣️ **Vue Router 4** - 官方路由管理器
- 📦 **Pinia** - 新一代状态管理
- 🎯 **Auto Import** - 自动导入组件和 API
- 📱 **移动端优先** - 专为移动设备优化设计
- 🎨 **移动端适配** - PostCSS px-to-viewport 移动端适配方案
- 🎨 **Less预处理器** - 强大的CSS预处理器支持
- 🤝 **触摸友好** - 优化的移动端交互体验

## 📦 技术栈

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vant](https://vant-ui.github.io/vant/) - 轻量、可靠的移动端 Vue 组件库
- [Vue Router](https://router.vuejs.org/) - Vue.js 官方路由
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [VueUse](https://vueuse.org/) - Vue 组合式函数集合
- [PostCSS](https://postcss.org/) - CSS 处理工具
- [Less](https://lesscss.org/) - CSS 预处理器
- [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) - px 转 vw 单位

## 🛠️ 开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 (推荐使用 pnpm)

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

开发服务器将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

### 预览生产构建

```bash
npm run preview
# 或
pnpm preview
```

### 类型检查

```bash
npm run type-check
# 或
pnpm type-check
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
├── views/              # 页面组件
├── stores/             # Pinia 状态管理
├── router/             # 路由配置
├── utils/              # 工具函数
│   └── screen.ts       # 屏幕适配工具
├── styles/             # 样式文件
│   ├── variables.less  # Less 变量
│   ├── mixins.less     # Less 混合器
│   └── index.less      # 样式主入口
├── App.vue             # 根组件
├── main.ts             # 应用入口
└── style.css           # 全局样式(已迁移到Less)
```

## ✨ 功能特性

### 自动导入

项目配置了自动导入功能，无需手动导入常用的 Vue API 和组件：

```typescript
// 无需导入，直接使用
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

### 状态管理

使用 Pinia 进行状态管理，支持 TypeScript：

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
})
```

### 路由配置

基于文件的路由系统，支持路由守卫和动态导入：

```typescript
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  }
]
```

## 🎨 Less 预处理器

项目集成了 Less 预处理器，提供强大的 CSS 编写体验：

### Less 配置

Vite 配置自动支持 Less 文件处理：

```typescript
// vite.config.ts
css: {
  preprocessorOptions: {
    less: {
      additionalData: '@import "@/styles/variables.less";',
      javascriptEnabled: true
    }
  }
}
```

### 变量系统

```less
// src/styles/variables.less
@primary-color: #1989fa;
@success-color: #07c160;
@font-size-base: 14px;
@spacing-md: 16px;
```

### 混合器(Mixins)

```less
// src/styles/mixins.less
.flex(@direction: row, @justify: flex-start, @align: stretch) {
  display: flex;
  flex-direction: @direction;
  justify-content: @justify;
  align-items: @align;
}

.text(@size: @font-size-base, @color: @text-color-primary) {
  font-size: @size;
  color: @color;
}
```

### 在组件中使用

```vue
<style lang="less" scoped>
@import '@/styles/variables.less';
@import '@/styles/mixins.less';

.my-component {
  .flex(column, center, center);
  .text(@font-size-large, @primary-color);
  
  .nested-element {
    background: @primary-color;
    
    &:hover {
      background: darken(@primary-color, 10%);
    }
  }
}
</style>
```

### Less 特性

- **变量**: 使用 `@` 符号定义可复用的值
- **嵌套**: 支持 CSS 规则嵌套，提高代码可读性
- **混合器**: 创建可重用的样式组合
- **函数**: 内置颜色、数学、字符串处理函数
- **运算**: 支持数学运算和颜色运算
- **导入**: 模块化管理样式文件

## 📱 移动端适配方案

项目集成了基于 PostCSS 的移动端适配解决方案：

### PostCSS 配置

通过 `postcss-px-to-viewport` 插件，自动将 px 单位转换为 vw 单位：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,     // 移动端设计稿宽度 (iPhone 6/7/8)
      viewportHeight: 667,    // 移动端设计稿高度
      unitPrecision: 5,       // 转换后保留的小数位数
      propList: ['*'],        // 指定转换的CSS属性
      selectorBlackList: ['.ignore-vw', '.van-'], // 忽略转换的类名
      minPixelValue: 1,       // 小于等于1px不转换
      mediaQuery: true,       // 是否在媒体查询中转换
      landscape: false,       // 处理横屏情况
      landscapeWidth: 667     // 横屏时的宽度
    }
  }
}
```

### 移动端视口配置

在 `index.html` 中配置了移动端优化的视口设置：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

### 移动端特性

- **禁用缩放**: 防止用户意外缩放影响布局
- **电话号码识别**: 禁用自动电话号码检测
- **Web App模式**: 支持添加到主屏幕
- **状态栏样式**: 优化iOS状态栏显示

## 🎨 UI 组件

项目集成了 Vant 移动端组件库，提供了丰富的移动端 UI 组件：

### Vant 特性

- **轻量级**: 组件库体积小，加载速度快
- **移动端优化**: 专为移动设备设计的组件
- **触摸友好**: 支持手势操作和触摸反馈
- **自动按需导入**: 只打包使用的组件
- **完整的 TypeScript 支持**: 提供完整的类型定义
- **主题定制**: 支持 CSS 变量定制主题

### 常用组件

- **导航组件**: NavBar（导航栏）、Tabbar（标签栏）
- **展示组件**: Cell（单元格）、Card（卡片）、Tag（标签）
- **反馈组件**: Toast（轻提示）、Dialog（弹窗）、Loading（加载）
- **表单组件**: Button（按钮）、Field（输入框）、Slider（滑块）
- **基础组件**: Grid（宫格）、Icon（图标）、Image（图片）

## 📱 移动端设计

项目采用移动端优先的设计理念，专为移动设备优化：

### 设备适配

- **手机设备** (< 768px) - 主要适配目标
- **小屏手机** (< 375px) - iPhone SE 等小屏设备
- **大屏手机** (375px - 414px) - iPhone 6/7/8/X 系列
- **平板设备** (> 768px) - 居中显示，限制最大宽度

### 移动端特性

- **底部标签栏导航**: 符合移动端操作习惯
- **顶部导航栏**: 支持返回和标题显示
- **触摸优化**: 适配手指点击的按钮尺寸
- **手势支持**: 支持滑动、点击等手势操作
- **loading状态**: 优化的加载和反馈机制

## 🎯 示例页面

项目包含多个功能演示页面：

- **首页** (`/`) - 移动端项目介绍和功能特性展示
- **关于页** (`/about`) - 技术栈和项目信息（折叠面板展示）
- **计数器** (`/counter`) - Pinia 状态管理示例（移动端交互）
- **数据可视化** (`/bigscreen`) - 移动端数据展示和图表演示
- **Less演示** (`/less`) - Less 预处理器功能展示

### 移动端页面特性

- **首页**: 使用卡片网格布局，展示主要功能入口
- **关于页**: 单元格列表和折叠面板，适合移动端浏览
- **计数器**: 移动端优化的按钮和交互设计
- **数据可视化**: 移动端数据卡片和圆形进度指示器
- **404页面**: 移动端友好的空状态页面设计

## 🚀 部署

项目构建后的文件在 `dist` 目录中，可以部署到任何静态文件服务器。

推荐部署平台：
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## 🔧 自定义配置

### Vite 配置

在 `vite.config.ts` 中可以自定义构建配置：

```typescript
export default defineConfig({
  // 插件配置
  plugins: [...],
  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/styles/variables.less";'
      }
    }
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### PostCSS 配置

在 `postcss.config.js` 中可以调整移动端适配参数：

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,   // 根据设计稿调整 (常用: 375, 414)
      selectorBlackList: ['.ignore-vw', '.van-'], // 排除Vant组件
      // ... 其他配置
    }
  }
}
```

### Vant 主题定制

可以通过 CSS 变量自定义 Vant 组件主题：

```css
:root {
  --van-primary-color: #1989fa;
  --van-success-color: #07c160;
  --van-danger-color: #ee0a24;
  --van-warning-color: #ff976a;
  --van-text-color: #323233;
  --van-background-color: #f7f8fa;
}
```

### Less 配置

可以根据项目需求调整 Less 变量和混合器：

```less
// src/styles/variables.less
@primary-color: #1989fa;      // 移动端主题色
@font-size-base: 14px;        // 移动端基础字体大小
@border-radius-base: 8px;     // 移动端圆角大小
```

## 📄 许可证

MIT License