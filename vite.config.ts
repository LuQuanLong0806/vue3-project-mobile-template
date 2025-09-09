import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import { readFileSync } from 'fs'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// 读取package.json获取项目信息
// const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [VantResolver()],
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: true
      }),
      Components({
        resolvers: [VantResolver()],
        dts: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      postcss: './postcss.config.js',
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/styles/variables.less";',
          javascriptEnabled: true
        }
      }
    },
    server: {
      port: 3000,
      open: true,
      host: true,
      // 移动端开发时禁用自动打开浏览器，便于使用模拟器
      strictPort: false
    },
    build: {
      outDir: env.VITE_APP_PACK_NAME || 'dist',
      sourcemap: false,
      minify: 'terser',
      cssCodeSplit: true,
      // 移动端优化配置
      target: 'es2015',
      rollupOptions: {
        output: {
          // 分包策略优化，减少移动端加载时间
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            vant: ['vant'],
            utils: ['@vueuse/core']
          },
          // 资源文件命名优化
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash].css'
            }
            return 'assets/[name]-[hash].[ext]'
          }
        }
      },
      // 移动端性能优化
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 4096
    },
    // 移动端预览配置
    preview: {
      port: 3000,
      host: true
    }
  }
})
