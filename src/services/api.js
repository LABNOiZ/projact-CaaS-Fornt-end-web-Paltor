import axios from 'axios'

// สร้างตัวยิง API โดยดึง URL มาจาก .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
})

// ก่อนจะยิง API ออกไป ให้ทำงานในฟังก์ชันนี้ก่อน
api.interceptors.request.use(
  (config) => {
    // 1.ดึง Token จาก LocalStorage 
    const token = localStorage.getItem('token') 

    // 2.ถ้ามี Token ให้แนบไปใน Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api


