import api from './api'

export const authService = {
  // ฟังก์ชันสำหรับ Login Super Admin
  login(email, password) {
    // ยิง POST ไปที่ /web/auth/login (มันจะไปต่อกับ Base URL เอง)
    // ส่งข้อมูล json { email, password } ไป
    return api.post('/web/auth/login', {
      email: email,
      password: password
    })
  }
}