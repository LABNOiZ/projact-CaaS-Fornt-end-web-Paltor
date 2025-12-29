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
        <span v-if="isLoading">Loading...</span>
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
  // 1. เริ่มต้น: เคลียร์ Error และเปิด Loading
  isError.value = false
  errorMessage.value = ''
  isLoading.value = true

  try {
    // 2. 🚀 ยิง API ไปที่หลังบ้าน
    const response = await authService.login(email.value, password.value)

    console.log("API Login Success:", response.data)

    // 3. ✅ ตรวจสอบเงื่อนไขเพื่อเปลี่ยนหน้า
    // 🔥 แก้ไขตรงนี้: เพิ่มการเช็ค 'admin@novapay.com' ให้ไปหน้าสร้าง Admin
    if (email.value === 'admin@novapay.com' || email.value.includes('setup')) {
        // ถ้าเป็น Super Admin หรือ Setup -> ไปหน้าติดตั้งระบบ
        console.log("Flow: Super Admin -> Go to Install")
        router.push('/install/create-admin')
    } else {
        // ถ้าเป็น Admin คนอื่นๆ -> ไปหน้า 2FA
        console.log("Flow: General Admin -> Go to 2FA")
        router.push('/login-2fa')
    }

  } catch (error) {
    // 4. ❌ ถ้า API ตอบว่าผิดพลาด
    console.error("Login Error:", error)
    isError.value = true
    
    // ดึงข้อความ Error จากหลังบ้านมาแสดง
    if (error.response && error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message
    } else {
        errorMessage.value = "Email หรือ Password ไม่ถูกต้อง (หรือเชื่อมต่อ Server ไม่ได้)"
    }
  } finally {
    // 5. ปิด Loading
    isLoading.value = false
  }
}
</script>