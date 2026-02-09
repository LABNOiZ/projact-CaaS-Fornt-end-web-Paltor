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

    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-lg p-6">
      
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-8">
        
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30 shadow-inner">
             <ShieldCheckIcon class="w-8 h-8 text-blue-100" />
          </div>
          
          <h2 class="text-3xl font-bold text-white tracking-wide drop-shadow-md mb-2">
            Verify Setup
          </h2>
          <p class="text-blue-100/80 text-sm">
            Step 3: Enter the code from your authenticator app to finish setup.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 text-center">
              One-time code
            </label>
            <input 
              v-model="otpCode" 
              @input="handleInput"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"        
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="000000"
              class="w-full rounded-xl border border-white/10 bg-white/10 p-4 text-center text-3xl font-mono 
              tracking-[0.5em] text-white placeholder-white/10 focus:bg-white/20 focus:border-blue-300 
              focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-inner"
              :disabled="isLoading"
            />
          </div>

          <div v-if="isError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-3 animate-pulse">
            <p class="text-red-100 text-sm font-medium text-center flex items-center justify-center gap-2">
              <ExclamationCircleIcon class="w-5 h-5" />
              {{ errorMessage }}
            </p>
          </div>

          <div class="space-y-3 pt-2">
            <button 
              type="submit" 
              :disabled="isLoading || !otpCode || otpCode.length < 6"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500
             text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/30 transform 
             hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 
             disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base"
            >
              <CheckCircleIcon v-if="!isLoading" class="w-5 h-5" />
              <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-white/80" />
              
              <span v-if="isLoading">Verifying...</span>
              <span v-else>Finish Setup</span>
            </button>

            <button 
              type="button" 
              @click="$router.back()" 
              :disabled="isLoading"
              class="w-full bg-white/5 hover:bg-white/10 text-blue-100 font-bold py-3 rounded-xl 
              border border-white/10 transition-all flex justify-center items-center gap-2 text-sm"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              Back
            </button>
          </div>

        </form>
      </div>
    </div>

    <div class="absolute bottom-4 w-full text-center z-10">
       <p class="text-blue-200/20 text-[10px] tracking-widest uppercase">
         NovaPay System &copy; 2025
       </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import { getUserProfile } from '@/services/adminService'
import bgLogin from '@/assets/bg-login_1.png'
import { 
    ShieldCheckIcon, 
    ExclamationCircleIcon, 
    CheckCircleIcon, 
    ArrowLeftIcon 
} from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// ⭐ กำหนดค่าเริ่มต้นให้เป็น string ว่างเสมอ
const otpCode = ref('')
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const email = route.query.email || sessionStorage.getItem('install_email') || sessionStorage.getItem('auth_email')

const handleInput = (e) => {
  isError.value = false
  // ป้องกัน e.target.value เป็น null
  const inputVal = e.target.value || ''
  let value = inputVal.replace(/[^0-9]/g, '')
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
    
    // ดึง Token อย่างปลอดภัย
    const token = response?.data?.accessToken || response?.data?.token || response?.data?.data?.accessToken

    if (token) {
        sessionStorage.setItem('token', token)
        console.log("Token saved to SessionStorage!")

        let userRoleId = response.data.roleId 

        if (!userRoleId) {
            try {
                const profileRes = await getUserProfile()
                userRoleId = profileRes.data.roleId || profileRes.data.role 
            } catch (err) {
                console.error("Failed to fetch profile:", err)
            }
        }

        if (userRoleId) {
            sessionStorage.setItem('roleId', userRoleId)
        }
        
        // --- ส่วนสำคัญ: Logic การเปลี่ยนหน้า ---
        const origin = sessionStorage.getItem('setupOrigin')
        
        if (origin === 'settings') {
            console.log("Redirecting back to Settings...")
            sessionStorage.removeItem('setupOrigin')
            
            if (userRoleId === 4) router.push({ name: 'CallCenter2FA' })
            else router.push({ name: 'SettingsTwoFactor' }) 

        } else {
            // ✅ Flow ติดตั้ง: ไปหน้า Complete (เพื่อรอ User กด Login เอง)
            // sessionStorage.removeItem('setupOrigin')
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