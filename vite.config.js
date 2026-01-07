import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // <--- 1. เพิ่มบรรทัดนี้ เพื่อให้ใช้งาน path ได้

export default defineConfig({
  plugins: [vue()],
  resolve: { // <--- 2. เพิ่มส่วนนี้ เพื่อบอกว่า @ คือ src
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // เมื่อไหร่ที่ axios ยิงไปที่ /api
      '/api': {
        target: 'http://10.82.241.238:8080', // ให้ส่งต่อไปที่ Server นี้แทน
        changeOrigin: true,
        secure: false,
      }
    }
  }
})