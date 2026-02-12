import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => { // 1. รับค่า mode (dev หรือ production)
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // 2. ตั้งค่าการลบ Console อัตโนมัติ
    esbuild: {
      // ถ้า mode เป็น production (ตอนรัน npm run build) จะสั่ง drop console และ debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://10.82.241.238:8086', // IP Backend
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Origin', 'http://10.82.241.238:8086'); 
            });
          }
        }
      }
    }
  }
})