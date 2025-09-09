/**
 * MyLocalStorage TypeScript 重构演示
 * 展示新版本的使用方法和功能
 */
import { storage, generateUUID, MyLocalStorage } from './index';

// 用户信息接口
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

// 缓存配置接口（保留供将来使用）
// interface CacheConfig {
//   maxAge: number;
//   version: string;
//   encrypted: boolean;
// }

/**
 * 演示基础功能
 */
export function demonstrateBasicFeatures() {
  console.log('=== 基础功能演示 ===');
  
  // 1. 基础存储操作
  const success = storage.set('demo.basic', 'Hello TypeScript!');
  console.log('存储操作结果:', success);
  
  // 2. 类型安全的数据获取
  const message = storage.get<string>('demo.basic');
  console.log('获取的消息:', message);
  
  // 3. 嵌套路径操作
  storage.set('app.settings.theme', 'dark');
  storage.set('app.settings.lang', 'zh-CN');
  
  const theme = storage.get<string>('app.settings.theme');
  console.log('主题设置:', theme);
  
  // 4. 获取所有键名
  const allKeys = storage.getAllKeys();
  console.log('所有存储键:', allKeys);
}

/**
 * 演示高级功能
 */
export function demonstrateAdvancedFeatures() {
  console.log('\n=== 高级功能演示 ===');
  
  // 1. 带过期时间的存储
  const oneHour = Date.now() + 60 * 60 * 1000;
  storage.set('temp.token', 'temp-token-123', {
    expires: oneHour,
    tag: 'authentication',
    version: '1.0'
  });
  
  // 2. 获取完整存储对象
  const fullToken = storage.get('temp.token', true);
  console.log('完整token信息:', fullToken);
  
  // 3. 复杂对象存储
  const userProfile: UserProfile = {
    id: generateUUID(),
    name: '张三',
    email: 'zhangsan@example.com',
    preferences: {
      theme: 'dark',
      language: 'zh-CN',
      notifications: true
    }
  };
  
  storage.set<UserProfile>('user.profile', userProfile, {
    tag: 'user-data',
    version: '2.0'
  });
  
  // 4. 类型安全获取
  const retrievedProfile = storage.get<UserProfile>('user.profile');
  console.log('用户资料:', retrievedProfile);
  
  // 5. 存储统计
  const stats = storage.getStorageStats();
  console.log('存储统计:', stats);
}

/**
 * 演示自定义存储实例
 */
export function demonstrateCustomInstance() {
  console.log('\n=== 自定义存储实例演示 ===');
  
  // 创建调试模式的存储实例
  const debugStorage = new MyLocalStorage({
    db_name: 'DEBUG_STORAGE',
    storage: window.localStorage,
    debug: true
  });
  
  // 调试模式会输出详细日志
  debugStorage.set('debug.test', { message: 'Debug mode enabled' });
  const debugData = debugStorage.get('debug.test');
  console.log('调试数据:', debugData);
  
  // 检查是否使用内存存储
  console.log('使用内存存储:', debugStorage.isUsingMemoryStorage());
}

/**
 * 演示会话存储
 */
export function demonstrateSessionStorage() {
  console.log('\n=== 会话存储演示 ===');
  
  // 使用会话存储（页面关闭后数据丢失）
  sessionStorage.set('session.data', {
    timestamp: Date.now(),
    pageViews: 1
  });
  
  const sessionData = sessionStorage.get('session.data');
  console.log('会话数据:', sessionData);
}

/**
 * 演示UUID生成
 */
export function demonstrateUUIDGeneration() {
  console.log('\n=== UUID生成演示 ===');
  
  // 标准UUID
  const standardUUID = generateUUID();
  console.log('标准UUID:', standardUUID);
  
  // 自定义长度
  const shortUUID = generateUUID({ length: 8 });
  console.log('短UUID:', shortUUID);
  
  // 16进制UUID
  const hexUUID = generateUUID({ length: 16, radix: 16 });
  console.log('16进制UUID:', hexUUID);
}

/**
 * 演示错误处理
 */
export function demonstrateErrorHandling() {
  console.log('\n=== 错误处理演示 ===');
  
  try {
    // 尝试使用无效键名
    const result = storage.set('', 'invalid key');
    console.log('无效键名存储结果:', result); // false
    
    // 尝试获取不存在的数据
    const nonExistent = storage.get('non.existent.key');
    console.log('不存在的数据:', nonExistent); // null
    
    // 批量删除（包含无效键）
    const deleteResult = storage.remove(['valid.key', '', 'another.key']);
    console.log('批量删除结果:', deleteResult);
    
  } catch (error) {
    console.error('操作失败:', error);
  }
}

/**
 * 演示数据清理
 */
export function demonstrateDataCleanup() {
  console.log('\n=== 数据清理演示 ===');
  
  // 设置一些测试数据
  storage.set('cleanup.test1', 'data1');
  storage.set('cleanup.test2', 'data2');
  storage.set('cleanup.nested.test3', 'data3');
  
  console.log('清理前的键:', storage.getAllKeys().filter(key => key.startsWith('cleanup')));
  
  // 删除单个键
  storage.remove('cleanup.test1');
  
  // 批量删除
  storage.remove(['cleanup.test2', 'cleanup.nested.test3']);
  
  console.log('清理后的键:', storage.getAllKeys().filter(key => key.startsWith('cleanup')));
}

/**
 * 运行所有演示
 */
export function runAllDemonstrations() {
  console.log('🚀 MyLocalStorage TypeScript 版本演示开始');
  console.log('================================================');
  
  demonstrateBasicFeatures();
  demonstrateAdvancedFeatures();
  demonstrateCustomInstance();
  demonstrateSessionStorage();
  demonstrateUUIDGeneration();
  demonstrateErrorHandling();
  demonstrateDataCleanup();
  
  console.log('================================================');
  console.log('✅ 所有演示完成');
}

// 如果直接运行此文件，则执行演示
if (typeof window !== 'undefined') {
  // 浏览器环境
  (window as any).storageDemo = {
    runAllDemonstrations,
    demonstrateBasicFeatures,
    demonstrateAdvancedFeatures,
    demonstrateCustomInstance,
    demonstrateSessionStorage,
    demonstrateUUIDGeneration,
    demonstrateErrorHandling,
    demonstrateDataCleanup
  };
  
  console.log('💡 在控制台输入 storageDemo.runAllDemonstrations() 运行完整演示');
}
