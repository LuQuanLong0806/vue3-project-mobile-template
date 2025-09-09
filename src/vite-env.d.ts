/// <reference types="vite/client" />

// Vite 环境变量类型定义
interface ImportMetaEnv {
  // 基础变量
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_PACK_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  
  // API 配置
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  
  // 功能开关
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_LOG_LEVEL: string;
  
  // Vite 内置变量
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

// 全局变量类型定义
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_MODE__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
