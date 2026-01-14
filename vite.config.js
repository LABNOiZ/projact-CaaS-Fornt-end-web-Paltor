import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // เพื่อให้ใช้งาน path ได้

export default defineConfig({
  plugins: [vue()],
  resolve: { //ส่วนนี้ เพื่อบอกว่า @ คือ src
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // เมื่อไหร่ที่ axios ยิงไปที่ /api
      '/api': {
        target: 'http://10.82.241.238:8086', // ให้ส่งต่อไปที่ Server นี้แทน
        changeOrigin: true,
        secure: false,
      }
    }
  }
})