import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [react(), compression({ algorithms: ['gzip', 'brotliCompress'] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5176,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-echarts', test: /node_modules[\\/]echarts/, priority: 17 },
            {
              name: 'vendor-antd',
              test: /node_modules[\\/](antd|@ant-design[\\/](?!pro)|rc-|@rc-component)/,
              priority: 16,
            },
            { name: 'vendor-pro', test: /node_modules[\\/]@ant-design[\\/]pro-/, priority: 15 },
            { name: 'vendor-utils', test: /node_modules[\\/](zustand|i18next)/, priority: 10 },
            { name: 'vendor', test: /node_modules/, priority: 1 },
          ],
        },
      },
    },
  },
})
