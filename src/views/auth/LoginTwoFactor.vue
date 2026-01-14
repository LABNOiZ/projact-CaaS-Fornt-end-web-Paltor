<template>
  <div class="w-full max-w-sm text-center">
    <div class="mb-8">
      </div>

    <h2 class="text-2xl font-bold mb-8">Welcome</h2>

    <div class="flex justify-between items-end mb-2">
        <label class="text-sm font-bold text-gray-700">One time code</label>
        <span class="text-xs font-bold text-gray-500">Step 2/2</span>
    </div>

    <form @submit.prevent="handleVerify">
      <div class="mb-6">
        <input 
          v-model="otpCode" 
          @input="handleInput"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"        
          autocomplete="one-time-code"
          class="w-full rounded-md border border-gray-300 bg-white p-2 text-center text-xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          :disabled="isLoading"
        />
      </div>

      <div v-if="isError" class="text-red-500 font-bold text-sm mb-4">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        :disabled="isLoading || otpCode.length !== 6"
        class="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Verifying...</span>
        <span v-else>Sign In</span>
      </button>

      <div class="mt-4">
        <button type="button" @click="router.push('/login')" class="text-xs text-gray-500 underline hover:text-gray-700">
            กลับไปหน้า Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService' 

const router = useRouter()
const route = useRoute()

const otpCode = ref('')
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// รับ Email ที่ส่งมาจากหน้า Login
const email = route.query.email 

const handleInput = (e) => {
  isError.value = false
  errorMessage.value = ''
  
  // กรองให้พิมพ์ได้แค่ตัวเลข 0-9 เท่านั้น
  // เพราะ input type="text" รับตัวอักษรได้ จึงต้องเขียนดักไว้
  let value = e.target.value.replace(/[^0-9]/g, '')

  // จำกัดความยาวไม่เกิน 6 ตัว
  if (value.length > 6) {
    value = value.slice(0, 6)
  }
  
  otpCode.value = value
}

const handleVerify = async () => {
  if (!email) {
      isError.value = true
      errorMessage.value = 'ไม่พบ Email กรุณา Login ใหม่'
      return
  }
  
  if (otpCode.value.length !== 6) {
      isError.value = true
      errorMessage.value = 'กรุณากรอกรหัส 6 หลัก'
      return
  }

  isLoading.value = true
  isError.value = false

  try {
    console.log(`Verifying 2FA for ${email}`)
    
    // ยิง API ไปตรวจสอบความถูกต้อง
    const response = await authService.verifyLogin2FA(email, otpCode.value)
    
    console.log("Verify Success:", response.data)

    // รับ Token แล้วบันทึก
    const token = response.data.token || response.data.accessToken
    if (token) {
        localStorage.setItem('token', token)
        router.push('/admin/dashboard') // ไปหน้า Dashboard
    } else {
        throw new Error('ไม่ได้รับ Token จากระบบ')
    }

  } catch (error) {
    console.error("Verify Error:", error)
    isError.value = true
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'รหัสผ่านไม่ถูกต้อง'
    } else {
        errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
    }
  } finally {
    isLoading.value = false
  }
}
</script>