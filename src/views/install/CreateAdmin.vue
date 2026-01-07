<template>
  <div class="bg-blue-100 p-8 rounded-xl shadow-lg w-full max-w-lg my-8">
    <h2 class="text-center text-xl font-bold mb-6">สร้างบัญชี Admin</h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div v-if="apiError" class="bg-red-100 text-red-700 p-3 rounded text-sm text-center border border-red-200">
        {{ apiError }}
      </div>

      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2">ข้อมูลภาษาไทย</label>
        <div class="flex gap-4">
            <div class="w-1/2">
                <input 
                    v-model="firstNameTh" 
                    type="text" 
                    placeholder="ชื่อ (ไทย)" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                />
            </div>
            <div class="w-1/2">
                <input 
                    v-model="lastNameTh" 
                    type="text" 
                    placeholder="นามสกุล (ไทย)" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                />
            </div>
        </div>
      </div>

      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2">ข้อมูลภาษาอังกฤษ</label>
        <div class="flex gap-4">
            <div class="w-1/2">
                <input 
                    v-model="firstNameEn" 
                    type="text" 
                    placeholder="First Name (Eng)" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                />
            </div>
            <div class="w-1/2">
                <input 
                    v-model="lastNameEn" 
                    type="text" 
                    placeholder="Last Name (Eng)" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                />
            </div>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-gray-900 text-sm font-bold mb-2">อีเมล</label>
        <input 
          v-model="email" 
          type="email" 
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" 
          required 
        />
      </div>

      <PasswordInput v-model="password" label="รหัสผ่าน" />
      <PasswordInput v-model="confirmPassword" label="ยืนยันรหัสผ่าน" />

      <PasswordRules :password="password" @check-valid="(val) => isRulePassed = val" />

      <div class="mt-6">
        <FormAlert :message="currentErrorMessage" />

        <button 
          type="submit" 
          :disabled="!canSubmit || isLoading"
          :class="canSubmit ? 'bg-blue-600 hover:bg-blue-700 shadow-lg cursor-pointer' : 'bg-blue-300 cursor-not-allowed opacity-70'"
          class="w-full text-white py-3 rounded-lg transition font-bold"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังบันทึก...
          </span>
          <span v-else>สร้างบัญชี Admin</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue' 
import { useRouter } from 'vue-router'
import PasswordInput from '../../components/PasswordInput.vue'
import PasswordRules from '../../components/PasswordRules.vue' 
import FormAlert from '../../components/FormAlert.vue'
import { authService } from '../../services/authService'

const router = useRouter()

const firstNameTh = ref('')
const lastNameTh = ref('')
const firstNameEn = ref('')
const lastNameEn = ref('')

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const isRulePassed = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const currentErrorMessage = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return "รหัสผ่านไม่ตรงกัน"
  }
  if (password.value && !isRulePassed.value) {
    return "เงื่อนไขการตั้งรหัสผ่านไม่ถูกต้อง"
  }
  return ""
})

// เช็คความครบถ้วนของข้อมูลก่อนให้กดปุ่ม
const canSubmit = computed(() => {
  return isRulePassed.value && 
         (password.value === confirmPassword.value) && 
         password.value !== '' &&
         email.value !== '' &&
         firstNameTh.value.trim() !== '' && 
         lastNameTh.value.trim() !== '' &&
         firstNameEn.value.trim() !== '' && 
         lastNameEn.value.trim() !== ''
})

const handleRegister = async () => {
  apiError.value = ''
  isLoading.value = true

  try {
    const payload = {
        email: email.value,
        password: password.value,
        firstName: firstNameEn.value,   
        lastName: lastNameEn.value,     
        firstNameTh: firstNameTh.value, 
        lastNameTh: lastNameTh.value,   
        roleId: 2 
    }

    console.log("🚀  Sending Payload:", payload)

    // ยิง API Register
    await authService.register(payload)
    
    console.log(" Register Success! Redirecting...")

    // ไปหน้า Loading 
    router.push({ 
        path: '/install/loading', 
        query: { email: email.value } 
    })

  } catch (error) {
    console.error("❌ Registration Error:", error)
    
    // ดึงข้อความ Error จาก Server มาแสดง
    if (error.response && error.response.data && error.response.data.message) {
        apiError.value = error.response.data.message
    } else {
        apiError.value = "เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถสร้างบัญชีได้")
    }
  } finally {
    isLoading.value = false
  }
}
</script>