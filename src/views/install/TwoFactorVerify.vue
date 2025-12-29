<template>
  <div class="bg-gray-100 border border-blue-300 p-8 rounded-lg w-full max-w-xl shadow-md">
    <p class="mb-6 font-medium text-gray-700">
      3. Enter the one-time code provided by the application and click Submit to finish setup.
    </p>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label class="block font-bold mb-2 text-gray-700">one-time code</label>
        
        <input 
          v-model="otpCode" 
          @input="isError = false"
          type="text" 
          class="w-full bg-gray-300 p-2 rounded text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500" 
        />
      </div>

      <div v-if="isError" class="text-red-500 font-bold text-center mb-4 ">
        รหัสผ่านไม่ถูกต้อง
      </div>

      <div class="flex flex-col items-center gap-3">
        <button 
          type="submit" 
          class="bg-green-500 text-white px-8 py-2 rounded w-40 hover:bg-green-600 transition shadow-sm font-medium"
        >
          Submit
        </button>
        
        <button 
          type="button" 
          @click="$router.back()" 
          class="bg-red-500 text-white px-8 py-2 rounded w-40 hover:bg-red-600 transition shadow-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// สร้างตัวแปรเก็บค่า
const otpCode = ref('')
const isError = ref(false)

// 🔒 กำหนดรหัส 2FA ที่ถูกต้อง (Mock Data) สำหรับทดสอบ
// ในอนาคตค่อยเปลี่ยนตรงนี้เป็นการยิง API ไปหา Server
const CORRECT_OTP = '123456'

const handleSubmit = () => {
  // 1. รีเซ็ต Error ก่อนเริ่มเช็ค
  isError.value = false

  // 2. เช็คว่ารหัสที่กรอก (otpCode) ตรงกับ รหัสที่ถูกต้อง (CORRECT_OTP) หรือไม่
  if (otpCode.value === CORRECT_OTP) {
    // ✅ ถ้าถูก: ไปหน้าถัดไป (เสร็จสิ้น)
    console.log("2FA Success")
    router.push('/setup/2fa-complete')
  } else {
    // ❌ ถ้าผิด: แสดง Error Message
    console.log("2FA Failed")
    isError.value = true
  }
}
</script>