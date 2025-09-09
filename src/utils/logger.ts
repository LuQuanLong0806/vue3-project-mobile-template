/**
 * 日志工具类 - 根据环境配置不同的日志级别
 */
import EnvConfig, { type LogLevel } from './env';

// 日志级别优先级
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * 日志记录器
 */
export class Logger {
  private static currentLevel: LogLevel = EnvConfig.logLevel;
  
  /**
   * 检查是否应该输出日志
   */
  private static shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
  }
  
  /**
   * 格式化日志消息
   */
  private static formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
    const timestamp = new Date().toISOString();
    const env = EnvConfig.env.toUpperCase();
    const prefix = `[${timestamp}] [${env}] [${level.toUpperCase()}]`;
    
    return [prefix, message, ...args];
  }
  
  /**
   * 调试日志
   */
  static debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.formatMessage('debug', message, ...args));
    }
  }
  
  /**
   * 信息日志
   */
  static info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', message, ...args));
    }
  }
  
  /**
   * 警告日志
   */
  static warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', message, ...args));
    }
  }
  
  /**
   * 错误日志
   */
  static error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', message, ...args));
    }
  }
  
  /**
   * 设置日志级别
   */
  static setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }
}

export default Logger;
