<template>
  <div class="env-demo">
    <div class="header">
      <h2>多环境配置演示</h2>
      <p>展示不同环境下的配置信息</p>
    </div>

    <div class="env-info">
      <!-- 当前环境信息 -->
      <van-cell-group inset title="当前环境">
        <van-cell title="环境名称" :value="currentEnv" />
        <van-cell title="是否开发环境" :value="isDev ? '是' : '否'" />
        <van-cell title="是否生产环境" :value="isProd ? '是' : '否'" />
        <van-cell title="构建模式" :value="buildMode" />
        <van-cell title="构建时间" :value="buildTime" />
      </van-cell-group>

      <!-- 应用配置 -->
      <van-cell-group inset title="应用配置">
        <van-cell title="应用标题" :value="appTitle" />
        <van-cell title="应用包名" :value="appPackName" />
        <van-cell title="应用版本" :value="appVersion" />
      </van-cell-group>

      <!-- API 配置 -->
      <van-cell-group inset title="API 配置">
        <van-cell title="API 地址" :value="apiBaseUrl" />
        <van-cell title="请求超时" :value="apiTimeout + 'ms'" />
      </van-cell-group>

      <!-- 功能开关 -->
      <van-cell-group inset title="功能开关">
        <van-cell title="调试模式" :value="isDebugEnabled ? '开启' : '关闭'" />
        <van-cell title="Mock 数据" :value="isMockEnabled ? '开启' : '关闭'" />
        <van-cell title="日志级别" :value="logLevel" />
      </van-cell-group>

      <!-- 环境判断演示 -->
      <van-cell-group inset title="环境判断">
        <van-cell title="开发环境" :value="EnvConfig.isDevelopment ? '✅' : '❌'" />
        <van-cell title="测试环境" :value="EnvConfig.isTest ? '✅' : '❌'" />
        <van-cell title="预发布环境" :value="EnvConfig.isStaging ? '✅' : '❌'" />
        <van-cell title="生产环境" :value="EnvConfig.isProduction ? '✅' : '❌'" />
      </van-cell-group>

      <!-- 操作按钮 -->
      <van-cell-group inset title="操作">
        <van-cell title="打印环境信息" is-link @click="printEnvInfo" />
        <van-cell title="测试日志输出" is-link @click="testLogger" />
        <van-cell title="根据环境获取配置" is-link @click="testEnvConfig" />
      </van-cell-group>

      <!-- 打包命令说明 -->
      <van-collapse v-model="activeNames" class="build-commands">
        <van-collapse-item title="打包命令说明" name="commands">
          <div class="commands-content">
            <h4>🚀 开发服务</h4>
            <ul>
              <li><code>npm run dev</code> - 开发环境</li>
              <li><code>npm run dev:test</code> - 测试环境</li>
              <li><code>npm run dev:staging</code> - 预发布环境</li>
            </ul>

            <h4>📦 构建打包</h4>
            <ul>
              <li><code>npm run build</code> - 生产环境打包</li>
              <li><code>npm run build:dev</code> - 开发环境打包</li>
              <li><code>npm run build:test</code> - 测试环境打包</li>
              <li><code>npm run build:staging</code> - 预发布环境打包</li>
              <li><code>npm run build:prod</code> - 生产环境打包</li>
            </ul>

            <h4>👁️ 预览服务</h4>
            <ul>
              <li><code>npm run preview</code> - 预览生产构建</li>
              <li><code>npm run preview:test</code> - 预览测试构建</li>
              <li><code>npm run preview:staging</code> - 预览预发布构建</li>
            </ul>

            <h4>🔍 分析工具</h4>
            <ul>
              <li><code>npm run build:analyze</code> - 构建分析</li>
            </ul>
          </div>
        </van-collapse-item>

        <van-collapse-item title="环境变量配置" name="envvars">
          <div class="envvars-content">
            <h4>📁 环境文件</h4>
            <ul>
              <li><code>.env</code> - 通用配置</li>
              <li><code>.env.development</code> - 开发环境</li>
              <li><code>.env.test</code> - 测试环境</li>
              <li><code>.env.staging</code> - 预发布环境</li>
              <li><code>.env.production</code> - 生产环境</li>
            </ul>

            <h4>⚙️ 变量命名规则</h4>
            <p>只有以 <code>VITE_</code> 开头的变量才会暴露给客户端！</p>
            
            <h4>📝 示例配置</h4>
            <pre><code># .env.development
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_DEBUG=true
VITE_LOG_LEVEL=debug</code></pre>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 环境切换提示 -->
    <div class="env-notice" v-if="EnvConfig.isDevelopment">
      <van-notice-bar
        left-icon="info-o"
        text="当前为开发环境，你可以修改 .env.development 文件来更改配置"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EnvConfig from '@/utils/env'
import Logger from '@/utils/logger'
import { showToast } from 'vant'

const activeNames = ref([''])

// 基础环境信息
const currentEnv = computed(() => EnvConfig.env)
const isDev = computed(() => EnvConfig.isDevelopment)
const isProd = computed(() => EnvConfig.isProduction)
const buildMode = computed(() => EnvConfig.buildMode)
const buildTime = computed(() => EnvConfig.buildTime)

// 应用配置
const appTitle = computed(() => EnvConfig.appTitle)
const appPackName = computed(() => EnvConfig.appPackName)
const appVersion = computed(() => EnvConfig.appVersion)

// API 配置
const apiBaseUrl = computed(() => EnvConfig.apiBaseUrl)
const apiTimeout = computed(() => EnvConfig.apiTimeout)

// 功能开关
const isDebugEnabled = computed(() => EnvConfig.isDebugEnabled)
const isMockEnabled = computed(() => EnvConfig.isMockEnabled)
const logLevel = computed(() => EnvConfig.logLevel)

// 打印环境信息到控制台
const printEnvInfo = () => {
  EnvConfig.printEnvInfo()
  showToast('环境信息已打印到控制台')
}

// 测试日志输出
const testLogger = () => {
  Logger.debug('这是调试日志', { timestamp: new Date() })
  Logger.info('这是信息日志', { level: 'info' })
  Logger.warn('这是警告日志', { warning: true })
  Logger.error('这是错误日志', { error: new Error('测试错误') })
  
  showToast('已输出测试日志到控制台')
}

// 测试根据环境获取配置
const testEnvConfig = () => {
  const configs = {
    development: { theme: 'light', features: ['debug', 'mock'] },
    test: { theme: 'light', features: ['debug'] },
    staging: { theme: 'dark', features: [] },
    production: { theme: 'dark', features: [] }
  }
  
  const currentConfig = EnvConfig.getConfig(configs)
  console.log('当前环境配置:', currentConfig)
  
  showToast(`当前主题: ${currentConfig.theme}`)
}
</script>

<style scoped>
.env-demo {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 12px;
  color: white;
}

.header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.env-info > * {
  margin-bottom: 16px;
}

.env-info > *:last-child {
  margin-bottom: 0;
}

.build-commands {
  margin-top: 20px;
}

.commands-content,
.envvars-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.commands-content h4,
.envvars-content h4 {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #22c55e;
}

.commands-content h4:first-child,
.envvars-content h4:first-child {
  margin-top: 0;
}

.commands-content ul,
.envvars-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.commands-content li,
.envvars-content li {
  margin: 4px 0;
  line-height: 1.6;
}

.commands-content code,
.envvars-content code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #e83e8c;
}

.envvars-content pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
  margin: 8px 0;
}

.envvars-content pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.envvars-content p {
  margin: 8px 0;
  padding: 8px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 14px;
}

.env-notice {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-cell__value) {
  color: #22c55e;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .env-demo {
    padding: 12px;
  }
  
  .header {
    padding: 16px;
  }
  
  .header h2 {
    font-size: 18px;
  }
  
  .header p {
    font-size: 13px;
  }
  
  .env-notice {
    bottom: 15px;
    left: 15px;
    right: 15px;
  }
}
</style>
