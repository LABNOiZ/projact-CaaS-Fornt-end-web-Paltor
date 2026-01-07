<template>
  <div class="w-full max-w-sm">
    <h2 class="text-center text-2xl font-bold mb-6">Welcome</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-gray-900 text-sm font-bold mb-2">Email</label>
        <input 
          v-model="email" 
          @input="isError = false"
          type="email" 
          class="w-full rounded-md border border-gray-300 bg-white p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <PasswordInput 
        v-model="password" 
        @update:modelValue="isError = false"
        label="Password" 
      />

      <div class="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded ">
        <p>ใช้ Email และ Password ที่ทีมงานสร้างให้</p>
      </div>

      <div v-if="isError" class="text-red-500 text-sm font-bold text-center ">
        {{ errorMessage || 'Email หรือ Password ไม่ถูกต้อง' }}
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Checking...</span>
        <span v-else>Sign In</span>
      </button>

      <div class="text-center mt-4">
        <a href="#" class="text-xs text-gray-400 underline">Forgot password?</a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '../../components/PasswordInput.vue'
import { authService } from '../../services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isError.value = false
  errorMessage.value = ''
  isLoading.value = true

  try {
    console.log("Attempting Login...")
    
    // 1. ยิง API Login
    const response = await authService.login(email.value, password.value)
    const data = response.data
    console.log("Login Response:", data)

    // 2. เช็คผลลัพธ์
    
    //  กรณีที่ 1: ได้รับ Token (Login ผ่าน)
    if (data.token || data.accessToken) {
        const token = data.token || data.accessToken
        localStorage.setItem('token', token)

        // เช็คว่าเป็น Super Admin หรือไม่ 
        // ตรวจสอบจาก Email (หรือถ้า Backend ส่ง Role มาให้ก็เช็ค Role ได้)
        if (email.value.includes('super_admin') || email.value === 'admin@novapay.com') {
            console.log(" Super Admin Login -> Go to Create Admin")
            router.push('/install/create-admin')
        } else {
            // ถ้าเป็น User ทั่วไปที่มี Token แล้ว ให้ไป Dashboard
            console.log(" User Login -> Go to Dashboard")
            router.push('/admin/dashboard')
        }
    } 
    // กรณีที่ 2: ต้องตั้งค่า 2FA (SETUP_REQUIRED)
    else if (data.status === 'SETUP_REQUIRED') {
        router.push({ 
            path: '/install/two-factor-qr', 
            query: { email: email.value } 
        })
    }
    // กรณีที่ 3: ต้องกรอก OTP (OTP_REQUIRED)
    else if (data.status === 'OTP_REQUIRED') {
         router.push({ path: '/login-2fa', query: { email: email.value } })
    }
    else {
        throw new Error(data.message || 'Login Failed')
    }

  } catch (error) {
    console.error("Login Error:", error)
    isError.value = true
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'Email หรือ Password ไม่ถูกต้อง'
    } else {
        errorMessage.value = 'ไม่สามารถเชื่อมต่อ Server ได้'
    }
  } finally {
    isLoading.value = false
  }
}
</script>