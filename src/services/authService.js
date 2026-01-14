import api from './api' 

export const authService = {
  // 1. Login 
  //  /web/auth/login (เพื่อให้ api.js เติม prefix ให้เอง)
  login(email, password) {
    return api.post('/web/auth/login', { 
      email: email,
      password: password
    })
  },

  // 2. Register
  register(userData) {
    return api.post('/web/auth/register', userData)
  },
  
  // 3. Setup 2FA
  get2FAQR(email) {
    return api.post('/web/auth/setup-2fa', {
      email: email
    })
  },

  // 4. ยืนยัน 2FA 
  verify2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { 
        email: email,
        code: parseInt(code) 
    })
  },

  //  5.ฟังก์ชันสำหรับหน้า Login Step 2/2
  verifyLogin2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { 
        email: email,
        code: code.toString() // แปลงเป็น String ตาม JSON 
    })
  },

  // 6. เปลี่ยนรหัสผ่าน (Change Password)
  changePassword(data) {
    // data = { oldPassword: '...', newPassword: '...' }
    return api.post('/web/users/change-password', data)
  }

}