import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://10.82.241.238:8086', // IP Backend
        changeOrigin: true,
        secure: false,
        // ✅ เพิ่มส่วนนี้: เพื่อหลอก Server ว่า Request นี้มาจากบ้านมันเอง
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'http://10.82.241.238:8086'); 
          });
        }
      }
    }
  }
})