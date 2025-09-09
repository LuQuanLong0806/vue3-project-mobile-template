/**
 * 环境配置工具类
 * 统一管理所有环境相关的配置和判断
 */

// 环境类型
export type EnvType = 'development' | 'test' | 'staging' | 'production';

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 环境配置类
 */
export class EnvConfig {
  
  /**
   * 当前环境
   */
  static get env(): EnvType {
    return import.meta.env.VITE_APP_ENV as EnvType || 'development';
  }
  
  /**
   * 应用标题
   */
  static get appTitle(): string {
    return import.meta.env.VITE_APP_TITLE;
  }
  
  /**
   * 应用包名
   */
  static get appPackName(): string {
    return import.meta.env.VITE_APP_PACK_NAME;
  }
  
  /**
   * 应用版本
   */
  static get appVersion(): string {
    return import.meta.env.VITE_APP_VERSION;
  }
  
  /**
   * API 基础地址
   */
  static get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  /**
   * API 超时时间
   */
  static get apiTimeout(): number {
    return Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
  }
  
  /**
   * 是否启用调试
   */
  static get isDebugEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_DEBUG === 'true';
  }
  
  /**
   * 是否启用Mock
   */
  static get isMockEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_MOCK === 'true';
  }
  
  /**
   * 日志级别
   */
  static get logLevel(): LogLevel {
    return import.meta.env.VITE_LOG_LEVEL as LogLevel || 'info';
  }
  
  /**
   * 构建时间
   */
  static get buildTime(): string {
    return __BUILD_TIME__;
  }
  
  /**
   * 构建模式
   */
  static get buildMode(): string {
    return __BUILD_MODE__;
  }
  
  // 环境判断方法
  
  /**
   * 是否为开发环境
   */
  static get isDevelopment(): boolean {
    return this.env === 'development' || import.meta.env.DEV;
  }
  
  /**
   * 是否为测试环境
   */
  static get isTest(): boolean {
    return this.env === 'test';
  }
  
  /**
   * 是否为预发布环境
   */
  static get isStaging(): boolean {
    return this.env === 'staging';
  }
  
  /**
   * 是否为生产环境
   */
  static get isProduction(): boolean {
    return this.env === 'production' || import.meta.env.PROD;
  }
  
  /**
   * 打印所有环境信息
   */
  static printEnvInfo(): void {
    console.group(`🌍 应用环境信息 [${this.env.toUpperCase()}]`);
    console.log(`📱 应用标题: ${this.appTitle}`);
    console.log(`📦 应用版本: ${this.appVersion}`);
    console.log(`🌐 API地址: ${this.apiBaseUrl}`);
    console.log(`⏱️ API超时: ${this.apiTimeout}ms`);
    console.log(`🐛 调试模式: ${this.isDebugEnabled ? '开启' : '关闭'}`);
    console.log(`🎭 Mock模式: ${this.isMockEnabled ? '开启' : '关闭'}`);
    console.log(`📝 日志级别: ${this.logLevel}`);
    console.log(`🏗️ 构建时间: ${this.buildTime}`);
    console.log(`🛠️ 构建模式: ${this.buildMode}`);
    console.groupEnd();
  }
  
  /**
   * 根据环境获取不同的配置
   */
  static getConfig<T>(configs: Record<EnvType, T>): T {
    return configs[this.env] || configs.development;
  }
}

// 导出默认配置
export default EnvConfig;
