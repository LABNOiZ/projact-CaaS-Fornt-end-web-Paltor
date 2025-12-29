import axios from 'axios'

// สร้างตัวยิง API โดยดึง URL มาจาก .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // รอสูงสุด 5 วินาที
})

export default api