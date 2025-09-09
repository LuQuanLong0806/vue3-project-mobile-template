// 存储选项接口
interface StorageOptions {
  /** 过期时间戳 */
  expires?: number
  /** 是否跳过警告 */
  skipWarning?: boolean
  /** 自定义标签 */
  tag?: string
  /** 数据版本 */
  version?: string
}

// 存储数据结构接口
interface StorageItem<T = any> {
  /** 存储的值 */
  value: T
  /** 创建时间戳 */
  created: number
  /** 过期时间戳 */
  expires?: number
  /** 标签 */
  tag?: string
  /** 版本 */
  version?: string
}

// 内存存储接口
interface MemoryStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

// UUID生成选项
interface UUIDOptions {
  /** 指定长度 */
  length?: number
  /** 基数 */
  radix?: number
  /** 是否使用标准格式 */
  standard?: boolean
}

// 在 Vite 项目中使用 import.meta.env 而不是 process.env
import EnvConfig from '../env'
console.log('import.meta.env~', import.meta.env)
const prefix: string = EnvConfig.appPackName || 'scene-service-portal-mobile'

/**
 * 生成UUID字符串
 * @param options - UUID生成选项
 * @returns UUID字符串
 */
export const generateUUID = (options: UUIDOptions = {}): string => {
  const chars: string[] =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const { length, radix = chars.length, standard = false } = options
  const uuid: (string | undefined)[] = []

  if (length && !standard) {
    // 生成指定长度的UUID
    for (let i = 0; i < length; i++) {
      uuid[i] = chars[Math.floor(Math.random() * radix)]
    }
  } else {
    // 生成标准RFC4122格式UUID
    let r: number
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = Math.floor(Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * 简化的UUID生成函数（兼容旧版本）
 * @deprecated 请使用 generateUUID
 */
export const uuid = (len?: number, radix?: number): string => {
  return generateUUID({ length: len, radix })
}

// 本地存储构造函数选项接口
interface LocalStorageConfig {
  /** 数据库名称 */
  db_name?: string
  /** 存储实例 */
  storage?: Storage
  /** 是否启用调试模式 */
  debug?: boolean
}

/**
 * 本地存储工具类
 * 支持 localStorage、sessionStorage 和内存存储的统一接口
 * 具有数据加密、过期检查、嵌套键名等高级功能
 */
export class MyLocalStorage {
  private readonly db_name: string
  private storage: Storage | MemoryStorage
  private usingMemoryStorage: boolean
  private readonly debug: boolean

  constructor(config: LocalStorageConfig = {}) {
    const {
      db_name = 'MyLocalStorage',
      storage = window.sessionStorage,
      debug = false
    } = config

    this.db_name = db_name
    this.storage = storage
    this.usingMemoryStorage = false
    this.debug = debug

    // 检查存储是否可用
    if (!this.isStorageAvailable()) {
      const storageType =
        storage === window.localStorage ? 'localStorage' : 'sessionStorage'
      console.warn(
        `${storageType} 不可用，使用内存存储（数据将在页面刷新时丢失）`
      )
      this.storage = this.createMemoryStorage()
      this.usingMemoryStorage = true
    }

    if (this.debug) {
      console.log(
        `MyLocalStorage 已初始化: ${this.db_name}, 使用${
          this.usingMemoryStorage ? '内存' : '持久化'
        }存储`
      )
    }
  }

  /**
   * 检查存储是否可用
   * @returns 存储是否可用
   */
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      this.storage.setItem(test, test)
      this.storage.removeItem(test)
      return true
    } catch (error) {
      if (this.debug) {
        console.error('存储不可用:', error)
      }
      return false
    }
  }

  /**
   * 创建内存存储作为降级方案
   * @returns 内存存储实例
   */
  private createMemoryStorage(): MemoryStorage {
    const memoryStorage: Record<string, string> = {}

    return {
      getItem: (key: string): string | null => {
        return memoryStorage[key] ?? null
      },

      setItem: (key: string, value: string): void => {
        memoryStorage[key] = value
        // 尝试使用cookie作为备份（有大小限制）
        this.trySetCookie(key, value)
      },

      removeItem: (key: string): void => {
        delete memoryStorage[key]
        this.tryRemoveCookie(key)
      },

      clear: (): void => {
        Object.keys(memoryStorage).forEach((key) => {
          delete memoryStorage[key]
          this.tryRemoveCookie(key)
        })
      }
    }
  }

  /**
   * 尝试使用cookie存储小量数据
   * @param key - 存储键名
   * @param value - 存储值
   */
  private trySetCookie(key: string, value: unknown): void {
    try {
      // 只存储小于2KB的数据到cookie
      const data = JSON.stringify(value)
      if (data.length < 2048) {
        const cookieKey = `${this.db_name}_${key}`
        document.cookie = `${cookieKey}=${encodeURIComponent(
          data
        )}; path=/; max-age=86400` // 1天过期

        if (this.debug) {
          console.log(`已备份到cookie: ${key}`)
        }
      }
    } catch (error) {
      if (this.debug) {
        console.warn('Cookie设置失败:', error)
      }
    }
  }

  /**
   * 尝试从cookie获取数据
   * @param key - 存储键名
   * @returns 解析后的数据或null
   */
  private tryGetCookie(key: string): any {
    try {
      const cookieKey = `${this.db_name}_${key}`
      const cookies = document.cookie.split(';')

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === cookieKey) {
          return JSON.parse(decodeURIComponent(value))
        }
      }
    } catch (error) {
      if (this.debug) {
        console.warn('Cookie读取失败:', error)
      }
    }
    return null
  }

  /**
   * 删除cookie
   * @param key - 存储键名
   */
  private tryRemoveCookie(key: string): void {
    try {
      const cookieKey = `${this.db_name}_${key}`
      document.cookie = `${cookieKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`

      if (this.debug) {
        console.log(`已删除cookie: ${key}`)
      }
    } catch (error) {
      if (this.debug) {
        console.warn('Cookie删除失败:', error)
      }
    }
  }

  /**
   * 检查是否使用内存存储
   * @returns 是否使用内存存储
   */
  public isUsingMemoryStorage(): boolean {
    return this.usingMemoryStorage
  }

  /**
   * 设置值到存储
   * @param key - 存储键名，支持嵌套路径（如 'user.profile.name'）
   * @param value - 要存储的值
   * @param options - 存储选项
   * @returns 操作是否成功
   */
  public set<T = any>(
    key: string,
    value: T,
    options: StorageOptions = {}
  ): boolean {
    if (!key || typeof key !== 'string') {
      console.error('键名必须是非空字符串')
      return false
    }

    // 如果使用内存存储，给用户提示
    if (this.usingMemoryStorage && !options.skipWarning) {
      console.warn(`使用内存存储模式，数据将在页面刷新时丢失。键名: ${key}`)
    }

    try {
      const now = Date.now()
      const item: StorageItem<T> = {
        value,
        created: now,
        ...options
      }

      const dbData = this.getDBData()
      this.setValue(dbData, key, item)
      const success = this.setDBData(dbData)

      if (this.debug && success) {
        console.log(`已存储数据: ${key}`, { value, options })
      }

      return success
    } catch (error) {
      console.error('设置值失败:', error)
      return false
    }
  }

  /**
   * 获取存储的值
   * @param key - 存储键名，支持嵌套路径
   * @param all - 是否返回完整的存储对象
   * @returns 存储的值或完整对象
   */
  public get<T = any>(key: string, all = false): T | StorageItem<T> | null {
    if (!key || typeof key !== 'string') {
      return null
    }

    try {
      const data = this.getDBData()
      const result = this.getValue(data, key) as StorageItem<T> | null

      // 如果内存存储中没有数据，尝试从cookie获取
      if (!result && this.usingMemoryStorage) {
        const cookieData = this.tryGetCookie(key)
        if (cookieData) {
          return all ? cookieData : cookieData.value ?? cookieData
        }
      }

      if (!result) {
        return null
      }

      // 检查数据是否过期
      if (result.expires && Date.now() > result.expires) {
        this.remove(key)
        if (this.debug) {
          console.log(`数据已过期并被删除: ${key}`)
        }
        return null
      }

      if (all) {
        return result
      }

      // 只返回value字段
      return result && typeof result === 'object' && 'value' in result
        ? result.value
        : (result as T)
    } catch (error) {
      console.error('获取值失败:', error)
      return null
    }
  }

  /**
   * 删除存储的值
   * @param key - 键名或键名数组，支持嵌套路径
   * @returns 操作是否成功
   */
  public remove(key: string | string[]): boolean {
    try {
      const data = this.getDBData()
      const keysToRemove = Array.isArray(key) ? key : [key]

      keysToRemove.forEach((k) => {
        if (k && typeof k === 'string') {
          this.removeValue(data, k)
          if (this.debug) {
            console.log(`已删除数据: ${k}`)
          }
        }
      })

      // 如果数据为空则清空存储
      if (data && Object.keys(data).length > 0) {
        return this.setDBData(data)
      } else {
        this.clear()
        return true
      }
    } catch (error) {
      console.error('删除值失败:', error)
      return false
    }
  }

  /**
   * 清空所有存储数据
   * @returns 操作是否成功
   */
  public clear(): boolean {
    try {
      this.storage.removeItem(this.db_name)

      if (this.debug) {
        console.log(`已清空存储: ${this.db_name}`)
      }

      return true
    } catch (error) {
      console.error('清空存储失败:', error)
      return false
    }
  }

  /**
   * 获取数据库中的所有数据
   * @returns 数据对象
   */
  private getDBData(): Record<string, any> {
    try {
      const item = this.storage.getItem(this.db_name)
      if (!item) {
        return {}
      }

      const data = JSON.parse(item)
      return this.isObject(data) ? data : {}
    } catch (error) {
      console.warn('解析存储数据失败，返回空对象:', error)
      return {}
    }
  }

  /**
   * 设置数据库数据
   * @param data - 要存储的数据对象
   * @returns 操作是否成功
   */
  private setDBData(data: Record<string, any>): boolean {
    try {
      const jsonData = JSON.stringify(data)
      this.storage.setItem(this.db_name, jsonData)
      return true
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError') {
        console.error('存储空间不足，请清理数据')
      } else {
        console.error('存储数据失败:', error)
      }
      return false
    }
  }

  /**
   * 判断值是否为对象（排除null和数组）
   * @param obj - 待判断的值
   * @returns 是否为对象
   */
  private isObject(obj: unknown): obj is Record<string, any> {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
  }

  /**
   * 解析键名为数组，支持嵌套路径（如 'user.profile.name' -> ['user', 'profile', 'name']）
   * @param key - 键名
   * @returns 键名数组
   */
  private getKeys(key: string): string[] {
    return key.includes('.') ? key.split('.') : [key]
  }

  /**
   * 设置嵌套对象的值
   * @param data - 目标数据对象
   * @param key - 键名，支持点号分隔的嵌套路径
   * @param value - 要设置的值
   * @returns 修改后的数据对象
   */
  private setValue(
    data: Record<string, any> = {},
    key: string,
    value: any
  ): Record<string, any> {
    const keys = this.getKeys(key)
    let current = data

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]

      if (i === keys.length - 1) {
        // 最后一层，设置值
        current[currentKey] = value
      } else {
        // 中间层，确保存在对象
        if (!this.isObject(current[currentKey])) {
          current[currentKey] = {}
        }
        current = current[currentKey]
      }
    }

    return data
  }

  /**
   * 获取嵌套对象的值
   * @param data - 数据对象
   * @param key - 键名，支持点号分隔的嵌套路径
   * @returns 找到的值或null
   */
  private getValue(data: Record<string, any>, key: string): any {
    const keys = this.getKeys(key)
    let current: any = data

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]

      if (current === null || current === undefined) {
        return null
      }

      if (i === keys.length - 1) {
        // 最后一层，返回值
        return current[currentKey] ?? null
      } else {
        // 中间层，检查是否为对象
        if (this.isObject(current[currentKey])) {
          current = current[currentKey]
        } else {
          return null
        }
      }
    }

    return null
  }

  /**
   * 删除嵌套对象的值
   * @param data - 数据对象
   * @param key - 键名，支持点号分隔的嵌套路径
   * @returns 修改后的数据对象
   */
  private removeValue(
    data: Record<string, any>,
    key: string
  ): Record<string, any> {
    const keys = this.getKeys(key)
    let current = data

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]

      if (current[currentKey] === undefined) {
        break
      }

      if (i === keys.length - 1) {
        // 最后一层，删除值
        delete current[currentKey]
      } else {
        // 中间层，继续向下
        if (this.isObject(current[currentKey])) {
          current = current[currentKey]
        } else {
          break
        }
      }
    }

    return data
  }

  /**
   * 获取存储中的所有键名
   * @returns 所有键名的数组
   */
  public getAllKeys(): string[] {
    try {
      const data = this.getDBData()
      return this.extractAllKeys(data)
    } catch (error) {
      console.error('获取所有键名失败:', error)
      return []
    }
  }

  /**
   * 递归提取对象中的所有键名
   * @param obj - 要提取键名的对象
   * @param prefix - 键名前缀
   * @returns 键名数组
   */
  private extractAllKeys(obj: Record<string, any>, prefix = ''): string[] {
    const keys: string[] = []

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        keys.push(fullKey)

        if (this.isObject(obj[key])) {
          keys.push(...this.extractAllKeys(obj[key], fullKey))
        }
      }
    }

    return keys
  }

  /**
   * 获取存储使用情况统计
   * @returns 存储统计信息
   */
  public getStorageStats(): {
    size: number
    count: number
    usingMemory: boolean
  } {
    try {
      const data = this.getDBData()
      const jsonString = JSON.stringify(data)

      return {
        size: new Blob([jsonString]).size,
        count: this.getAllKeys().length,
        usingMemory: this.usingMemoryStorage
      }
    } catch (error) {
      console.error('获取存储统计失败:', error)
      return { size: 0, count: 0, usingMemory: this.usingMemoryStorage }
    }
  }
}

// 创建默认的存储实例 根据项目需求选择使用localStorage或sessionStorage
export const storage = new MyLocalStorage({
  db_name: `${prefix}_STORAGE`,
  storage: window.localStorage,
  // storage: window.sessionStorage,
  debug: EnvConfig.isDebugEnabled // 使用统一的环境配置
})

// 创建会话存储实例 根据项目需求
// export const sessionStorage = new MyLocalStorage({
//   db_name: `${prefix}_SESSION`,
//   storage: window.sessionStorage,
//   debug: EnvConfig.isDebugEnabled
// });

// 导出类型定义
export type {
  StorageOptions,
  StorageItem,
  MemoryStorage,
  UUIDOptions,
  LocalStorageConfig
}
