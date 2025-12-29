import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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