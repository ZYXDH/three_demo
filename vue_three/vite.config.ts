import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', //打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') //设置别名
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/assets/css/base.less')}";`
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4000, //启动端口
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9090/',
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api/, '') // 这就是http-proxy要请求的url,我们基地址实际是没有/api 所以replace掉
        }
      }
    },
    cors: true
  }
})
