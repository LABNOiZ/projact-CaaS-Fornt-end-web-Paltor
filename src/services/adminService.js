import api from './api' // ตัวนี้คือ axios instance ที่ config base url ไว้แล้ว

// --- Dashboard (ของเดิม) ---
export const getAdminDashboardStats = () => {
  return api.get('/web/dashboard/stats')
}

 //ผุ้ใช้งานเว็บ
export const getWebUsers = () => {
  return api.get('/web/users')
}

// ค้นหาผู้ใช้
export const searchWebUsers = (query) => {
  return api.get('/web/users/search', {
    params: { query } 
  })
}

// แก้ไขข้อมูลผู้ใช้ 
export const updateWebUser = (userId, data) => {
  return api.patch(`/web/users/${userId}`, data)
}

// ระงับ ผู้ใช้ 
export const deleteWebUser = (userId) => {
  return api.delete(`/web/users/${userId}`)
}

// สร้างผู้ใช้ใหม่ 
export const createWebUser = (data) => {
  return api.post('/web/users/add', data)
}