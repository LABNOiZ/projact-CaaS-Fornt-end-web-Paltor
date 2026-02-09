import axios from 'axios'

// สร้างตัวยิง API
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
})

// Interceptor สำหรับฝัง Token
api.interceptors.request.use(
  (config) => {
    // 1. ดึง Token จาก sessionStorage
    const token = sessionStorage.getItem('token') 

    // 2. ถ้ามี Token ให้แนบไปใน Header (ยกเว้นตอน Login)
    if (token && !config.url.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api