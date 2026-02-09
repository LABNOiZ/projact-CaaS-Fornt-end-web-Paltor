<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div 
      class="absolute inset-0 z-0"
      :style="{ 
        backgroundImage: `url(${bgLogin})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }">
    </div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90"></div>

    <div class="relative z-10 w-full max-w-lg">
        <div class="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20">
            
            <h2 class="text-center text-2xl font-bold mb-4 text-gray-800 tracking-tight">สร้างบัญชี Admin</h2>

            <form @submit.prevent="handleRegister" class="space-y-3">
                
                <div v-if="apiError" class="bg-red-50 text-red-600 p-2 rounded-lg text-xs text-center border border-red-200 flex items-center justify-center gap-2">
                    <ExclamationCircleIcon class="h-4 w-4" />
                    {{ apiError }}
                </div>

                <div>
                    <label class="block text-gray-700 text-xs font-bold mb-1 uppercase tracking-wider ml-1">ข้อมูลภาษาไทย</label>
                    <div class="flex gap-2">
                        <input v-model="firstNameTh" type="text" placeholder="ชื่อ (ไทย)" class="w-1/2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                        <input v-model="lastNameTh" type="text" placeholder="นามสกุล (ไทย)" class="w-1/2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                    </div>
                </div>

                <div>
                    <label class="block text-gray-700 text-xs font-bold mb-1 uppercase tracking-wider ml-1">ข้อมูลภาษาอังกฤษ</label>
                    <div class="flex gap-2">
                        <input v-model="firstNameEn" type="text" placeholder="First Name" class="w-1/2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                        <input v-model="lastNameEn" type="text" placeholder="Last Name" class="w-1/2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                    </div>
                </div>

                <div>
                    <label class="block text-gray-700 text-xs font-bold mb-1 uppercase tracking-wider ml-1">อีเมล</label>
                    <input v-model="email" type="email" placeholder="example@novapay.com" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>

                <div class="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
                    <PasswordInput v-model="password" label="รหัสผ่าน" class="text-sm" />
                    <PasswordInput v-model="confirmPassword" label="ยืนยันรหัสผ่าน" class="text-sm" />
                    <div class="pt-1 scale-90 origin-top-left"> <PasswordRules :password="password" @check-valid="(val) => isRulePassed = val" />
                    </div>
                </div>

                <div class="pt-2">
                    <FormAlert :message="currentErrorMessage" class="mb-2 text-xs" />

                    <button
                        type="submit"
                        :disabled="!canSubmit || isLoading"
                        :class="canSubmit ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg cursor-pointer transform hover:-translate-y-0.5' : 'bg-gray-300 cursor-not-allowed text-gray-500'"
                        class="w-full text-white py-3 rounded-xl transition-all duration-200 font-bold text-sm flex justify-center items-center gap-2 shadow-blue-900/20"
                    >
                        <ArrowPathIcon v-if="isLoading" class="animate-spin h-5 w-5 text-white" />
                        <span v-if="isLoading">กำลังสร้างและเข้าสู่ระบบ...</span>
                        <span v-else>สร้างบัญชี Admin</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <div class="absolute bottom-2 text-center w-full z-10">
       <p class="text-blue-200/30 text-[10px] uppercase tracking-widest">© NovaPay System. All rights reserved.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'
import FormAlert from '@/components/FormAlert.vue'
import { authService } from '@/services/authService'
import bgLogin from '@/assets/bg-login_1.png'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

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
    // 1. สร้าง User
    const payload = {
        email: email.value,
        password: password.value,
        firstName: firstNameEn.value,  
        lastName: lastNameEn.value,    
        firstNameTh: firstNameTh.value,
        lastNameTh: lastNameTh.value,  
        roleId: 2
    }
    console.log("Creating Admin:", payload)
    await authService.register(payload)
    console.log("Register Success!")

   
    console.log("Auto-switching to new user context...")
    
    // ล้าง Token Super Admin ทิ้ง
    sessionStorage.clear()
    // Login ด้วย User ใหม่
    const loginRes = await authService.login(email.value, password.value)
    const loginData = loginRes.data
    
    // ✅ เช็ค: ถ้ามี Token หรือ สถานะบอกว่าต้อง Setup 2FA ก็ถือว่าผ่านหมด
    if (loginData.token || loginData.accessToken || loginData.status === 'SETUP_REQUIRED') {
        
        // ถ้ามี Token ให้เก็บ (กรณี Backend ใจดีส่งมาให้)
        const token = loginData.token || loginData.accessToken
        if (token) {
            sessionStorage.setItem('token', token)
        }

        // เก็บข้อมูลจำเป็นสำหรับการไปต่อ
        sessionStorage.setItem('install_email', email.value)
        sessionStorage.setItem('setupOrigin', 'install_flow')
        
        // ไปหน้า Success -> แล้วไป QR Code ต่อ
        router.push('/install/success')

    } else {
        // กรณี Login ไม่ผ่านจริงๆ
        console.error("Login Response unexpected:", loginData)
        throw new Error("สร้างบัญชีสำเร็จ แต่การเข้าสู่ระบบอัตโนมัติล้มเหลว (ไม่ได้รับ Token หรือ Status ที่ถูกต้อง)")
    }

  } catch (error) {
    console.error("❌ Process Error:", error)
    if (error.response && error.response.status === 400) {
        // แปลง Error 400 ให้เข้าใจง่าย
        apiError.value = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น"
    } else if (error.response && error.response.data && error.response.data.message) {
        apiError.value = error.response.data.message
    } else {
        apiError.value = "เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถดำเนินการได้")
    }
  } finally {
    isLoading.value = false
  }
}
</script>