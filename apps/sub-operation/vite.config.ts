import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import path from 'path'

export default defineConfig({
  plugins: [react(), mockDevServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5175,
    // 允许被主应用 wujie 嵌入
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // wujie 子应用需要 umd 格式（alive 模式不需要，但保留兼容）
  base: './',
})
