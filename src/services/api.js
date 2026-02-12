import axios from 'axios'

// สร้างตัวยิง API
const api = axios.create({
  // ตรวจสอบ baseURL ให้ตรงกับ Server จริงของคุณ (เช่น http://10.82.241.238:8086/api/v1)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, 
})

// Request Interceptor: ฝัง Token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') 
    if (token && !config.url.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor: ทำ Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ถ้าเจอ Error 401 (Unauthorized) และยังไม่เคยลอง Retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            console.log(" Token expired. Attempting Silent Refresh...");
            const refreshToken = sessionStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            // ยิงไปขอ Token ใหม่ (ใช้ axios ตัวดิบเพื่อเลี่ยง Loop Interceptor)
            //  ปรับ URL ให้ตรงกับ Server ของคุณ
            const refreshResponse = await axios.post('http://10.82.241.238:8086/api/v1/web/auth/refresh-token', {
                refreshToken: refreshToken
            });

            const { token, refreshToken: newRefreshToken } = refreshResponse.data;

            if (token) {
                // 1. เก็บ Token ใหม่
                sessionStorage.setItem('token', token);
                if (newRefreshToken) {
                    sessionStorage.setItem('refreshToken', newRefreshToken);
                }

                // 2. อัปเดต Header ของ Request เดิม
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                originalRequest.headers['Authorization'] = `Bearer ${token}`;

                // 3. ยิง Request เดิมซ้ำ (User ไม่รู้ตัว)
                return api(originalRequest);
            }

        } catch (refreshError) {
            console.error(" Session expired completely:", refreshError);
            // ถ้าต่ออายุไม่ผ่าน (Refresh Token หมดอายุด้วย) -> ดีดออกไป Login
            sessionStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
  }
)

export default api