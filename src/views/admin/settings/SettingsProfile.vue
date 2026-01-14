<template>
  <div class="flex gap-6 font-sans">
    
    <SettingsSidebar basePath="/admin" />

    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>

      <div class="bg-white p-8 rounded-lg shadow-sm flex gap-8">
        
        <div class="flex flex-col items-center">
          <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 flex-1">
          
          <div class="col-span-2 space-y-1">
            <p><strong>Email :</strong> {{ profile.email }}</p>
            <p><strong>Role :</strong> {{ profile.roleName || profile.roleId }}</p> 
            <p><strong>Branch number :</strong> {{ profile.branchCode || '-' }}</p>
          </div>

          <div>
            <label class="font-bold text-sm">ชื่อ (ภาษาไทย)</label>
            <input 
              type="text" 
              :value="profile.firstNameTh" 
              disabled 
              class="w-full bg-gray-200 border rounded p-2 mt-1 text-gray-500"
            >
          </div>
          
          <div>
            <label class="font-bold text-sm">นามสกุล (ภาษาไทย)</label>
            <input 
              type="text" 
              :value="profile.lastNameTh" 
              disabled 
              class="w-full bg-gray-200 border rounded p-2 mt-1 text-gray-500"
            >
          </div>

          <div>
            <label class="font-bold text-sm">ชื่อ (ภาษาอังกฤษ)</label>
            <input 
              type="text" 
              :value="profile.firstNameEn" 
              disabled 
              class="w-full bg-gray-200 border rounded p-2 mt-1 text-gray-500"
            >
          </div>

          <div>
            <label class="font-bold text-sm">นามสกุล (ภาษาอังกฤษ)</label>
            <input 
              type="text" 
              :value="profile.lastNameEn" 
              disabled 
              class="w-full bg-gray-200 border rounded p-2 mt-1 text-gray-500"
            >
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// เรียกใช้ Service 
import { getUserProfile } from '@/services/adminService' 
import SettingsSidebar from '@/components/SettingsSidebar.vue' 

// สร้างตัวแปรมารอรับข้อมูล (กำหนดค่าว่างไว้ก่อน กัน Error)
const profile = ref({
  email: '-',
  roleName: '-',      // ต้องเช็คกับ Backend ว่าส่ง key ชื่อ roleName หรือ roleId
  branchCode: '-',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: ''
})

// โหลดข้อมูลทันทีเมื่อเข้าหน้านี้
onMounted(async () => {
  try {
    const response = await getUserProfile()
    // เอาข้อมูลจาก API มาใส่ตัวแปร profile
    profile.value = response.data 
    console.log('Profile Data:', response.data) // เช็คดูข้อมูลใน Console
  } catch (error) {
    console.error('โหลดข้อมูลไม่สำเร็จ:', error)
  }
})
</script>