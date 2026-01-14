<template>
  <div class="bg-gray-100 border border-blue-300 p-8 rounded-lg w-full max-w-xl shadow-md mx-auto mt-10">
    <p class="mb-6 font-medium text-gray-700">
      3. Enter the one-time code provided by the application and click Submit to finish setup.
    </p>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label class="block font-bold mb-2 text-gray-700">One-time code</label>
        
        <input 
          v-model="otpCode" 
          @input="handleInput"
          type="text" 
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="Enter 6-digit code"
          class="w-full bg-gray-300 p-2 rounded text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500" 
          :disabled="isLoading"
          maxlength="6"
        />
      </div>

      <div v-if="isError" class="text-red-500 font-bold text-center mb-4 ">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col items-center gap-3">
        <button 
          type="submit" 
          :disabled="isLoading || otpCode.length < 6"
          class="bg-green-500 text-white px-8 py-2 rounded w-40 hover:bg-green-600 transition shadow-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Checking...' : 'Submit' }}
        </button>
        
        <button 
          type="button" 
          @click="$router.back()" 
          :disabled="isLoading"
          class="bg-red-500 text-white px-8 py-2 rounded w-40 hover:bg-red-600 transition shadow-sm font-medium"
        >
          Back
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

const email = route.query.email

// ฟังก์ชันกรองตัวเลข
const handleInput = (e) => {
  isError.value = false
  let value = e.target.value.replace(/[^0-9]/g, '')
  if (value.length > 6) value = value.slice(0, 6)
  otpCode.value = value
}

const handleSubmit = async () => {
  isError.value = false
  errorMessage.value = ''

  if (!otpCode.value) return
  if (!email) {
      errorMessage.value = "ไม่พบข้อมูล Email (กรุณาเริ่มใหม่)"
      return
  }

  isLoading.value = true

  try {
    console.log(`Verifying OTP for ${email}...`)
    const response = await authService.verify2FA(email, otpCode.value)

    console.log("2FA Success! Response:", response.data)

    // รับ Token และบันทึก
    const token = response.data.accessToken || response.data.token || response.data.data?.accessToken

    if (token) {
        localStorage.setItem('token', token)
        console.log("Token saved to LocalStorage!")
        
        //  เช็คว่ามาจากไหน (Settings หรือ Install ใหม่) 
        const origin = localStorage.getItem('setupOrigin')
        
        if (origin === 'settings') {
            // ถ้ามาจาก Settings ให้กลับไปที่หน้า Settings
            console.log("Redirecting back to Settings...")
            localStorage.removeItem('setupOrigin') // ลบป้ายทิ้ง
            router.push({ name: 'SettingsTwoFactor' }) // หรือ '/admin/settings/2fa'
        } else {
            // ถ้าเป็น Flow ปกติ (Admin ใหม่) ให้ไปหน้า Complete
            router.push('/install/two-factor-complete') 
        }

    } else {
        throw new Error("ยืนยันตัวตนผ่าน แต่ไม่ได้รับ Token จาก Server")
    }

  } catch (error) {
    console.error("2FA Failed:", error)
    isError.value = true
    
    if (error.response) {
        if (error.response.status === 400) {
            errorMessage.value = "รหัส OTP ไม่ถูกต้อง"
        } else if (error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message
        } else {
            errorMessage.value = `เกิดข้อผิดพลาด (${error.response.status})`
        }
    } else {
        errorMessage.value = 'ไม่สามารถเชื่อมต่อ Server ได้'
    }
  } finally {
    isLoading.value = false
  }
}
</script>