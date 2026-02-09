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
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>

    <div class="relative z-10 w-full max-w-lg p-6">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-8">
        <div class="text-center mb-6">
          <img 
            src="@/assets/logo.png" 
            alt="Company Logo" 
            class="h-24 mx-auto mb-4 drop-shadow-xl"
          />
          <h2 class="text-3xl font-bold text-white tracking-wide drop-shadow-md mb-2">
            Verification
          </h2>
          <div class="flex items-center justify-center gap-2 bg-blue-500/10 py-1 px-3 rounded-full 
          w-fit mx-auto border border-blue-400/20">
              <ShieldCheckIcon class="w-4 h-4 text-green-400" />
              <p class="text-blue-100 text-xs font-medium">Two-Factor Authentication</p>
          </div>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-5">
          <div class="flex justify-between items-end px-1">
            <label class="text-xs font-bold text-blue-200 uppercase tracking-wider">One Time Code</label>
            <span class="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/20">Step 2/2</span>
          </div>

          <div>
            <input 
              v-model="otpCode" 
              @input="handleInput"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"        
              autocomplete="one-time-code"
              maxlength="6"
              class="w-full rounded-xl border border-white/10 bg-white/10 p-3 text-center text-2xl font-mono 
              tracking-[0.5em] text-white placeholder-white/10 focus:bg-white/20 focus:border-blue-300 
              focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-inner"
              :disabled="isLoading"
            />
          </div>

          <div v-if="isError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-2.5 animate-pulse">
            <p class="text-red-100 text-sm font-medium text-center flex items-center justify-center gap-2">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ errorMessage }}
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading || otpCode.length !== 6"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
           text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/40 transform 
           hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 
           disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base"
          >
            <LockClosedIcon v-if="!isLoading" class="w-5 h-5" />
            <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-white/80" />
            <span v-if="isLoading">Verifying...</span>
            <span v-else>Login</span>
          </button>

          <div class="text-center pt-1">
            <button 
                type="button" 
                @click="backToLogin" 
                class="text-xs text-blue-300/70 hover:text-white hover:underline 
                transition-colors flex items-center justify-center mx-auto gap-1"
            >
                <ArrowLeftIcon class="w-3 h-3" />
                กลับไปหน้า Login
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="absolute bottom-4 w-full text-center z-10">
       <p class="text-blue-200/20 text-[10px] tracking-widest uppercase">
         NovaPay System &copy; 2024
       </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService' 
import { userService } from '@/services/userService' 
import bgLogin from '@/assets/bg-login_1.png'
import { 
    ShieldCheckIcon, 
    ExclamationCircleIcon, 
    LockClosedIcon, 
    ArrowLeftIcon 
} from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const otpCode = ref('')
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const email = ref('') 

onMounted(() => {
  // OWASP: ตรวจสอบว่ามี Email ใน Session จริงหรือไม่ ถ้าไม่มีให้ดีดออกทันที
  const storedEmail = sessionStorage.getItem('auth_email')
  if (!storedEmail) {
    console.warn("Security Alert: Attempted to access 2FA page without email.")
    router.replace('/login') // ใช้ replace แทน push เพื่อไม่ให้กด Back กลับมาได้
    return
  }
  email.value = storedEmail
})

const handleInput = (e) => {
  isError.value = false
  errorMessage.value = ''
  
  // OWASP: Input Validation - อนุญาตเฉพาะตัวเลขเท่านั้น (Whitelist pattern)
  let value = e.target.value.replace(/[^0-9]/g, '')
  if (value.length > 6) {
    value = value.slice(0, 6)
  }
  otpCode.value = value
}

const handleVerify = async () => {
  // OWASP: Fail Safe - ตรวจสอบเงื่อนไขก่อนเริ่ม Process
  if (!email.value) {
      router.replace('/login')
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
    console.log(`Verifying 2FA for user...`) // ไม่ log email เพื่อ Privacy Logs
    
    // 1. Verify OTP
    const response = await authService.verifyLogin2FA(email.value, otpCode.value)
    const data = response.data
    
    // ตรวจสอบ Token ว่ามีจริงไหม
    const token = data.token || data.accessToken
    if (!token) {
        throw new Error('Authentication Failed: No token received')
    }

    // OWASP: Session Hygiene - เคลียร์ขยะเก่าก่อนเริ่ม Session ใหม่เสมอ
    const tempEmail = email.value // เก็บไว้เช็ค installer
    sessionStorage.clear() 

    // เริ่มต้น Session ใหม่
    sessionStorage.setItem('token', token)
    
    try {
        // 2. Role Determination (Secure Direct Access)
        // พยายามใช้ Role ที่ Backend แนบมาให้ (ปลอดภัยที่สุดเพราะมาจาก Token Issuer)
        let userRole = data.roleId || data.role

        // Fallback: ถ้าไม่มีจริงๆ ค่อยเรียก Profile (แต่ต้องระวัง 403)
        if (!userRole) {
            console.warn("Role missing in Auth Response, attempting fetch profile...")
            const profileRes = await userService.getProfile()
            userRole = profileRes.data.roleId
        }
        
        // Type Casting เพื่อความปลอดภัยในการเปรียบเทียบ
        userRole = Number(userRole)
        
        if (!userRole) {
            throw new Error("Critical: Unable to determine user role.")
        }
        
        sessionStorage.setItem('roleId', userRole)

        // 3. Secure Routing (Client-Side Access Control)
        // ตรวจสอบ Role และ Redirect ไปยัง Route ที่เหมาะสม
        if (userRole === 6) {
             // ตรวจสอบเงื่อนไข Installer เพิ่มเติมเพื่อความชัวร์ (Optional)
             sessionStorage.setItem('is_installer', 'true')
             router.replace('/install/create-admin')
        } 
        else {
             if (userRole === 2) router.replace('/admin/dashboard')
             else if (userRole === 4) router.replace('/callcenter/search-customer')
             else if (userRole === 3) router.replace('/branch/dashboard')
             else {
                 // OWASP: Default Deny - ถ้า Role ไม่รู้จัก ห้ามให้เข้า
                 console.error("Security: Unknown Role ID detected:", userRole)
                 throw new Error('Access Denied: Invalid Role Permission')
             }
        }

    } catch (innerError) {
        console.error("Authorization Error:", innerError)
        // ถ้ามีปัญหาเรื่องสิทธิ์ ให้เคลียร์ Token ทันที เพื่อไม่ให้มี Session ค้าง
        sessionStorage.clear()
        throw new Error('ไม่สามารถระบุสิทธิ์การใช้งานได้ กรุณาติดต่อผู้ดูแลระบบ')
    }

  } catch (error) {
    console.error("Authentication Error:", error)
    isError.value = true
    // OWASP: Error Handling - แยกประเภท Error 
    if (error.response && error.response.data) {
        // Message จาก Backend ที่ตั้งใจส่งมา (เช่น OTP ผิด) แสดงได้
        errorMessage.value = error.response.data.message || 'รหัส OTP ไม่ถูกต้อง'
    } else {
        // Generic Error สำหรับเคสอื่นๆ
        errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    }
    
    // ถ้า Error รุนแรง ให้เคลียร์ค่าทิ้ง
    if (!errorMessage.value.includes('รหัส OTP ไม่ถูกต้อง')) {
       otpCode.value = ''
    }
    
  } finally {
    isLoading.value = false
  }
}

const backToLogin = () => {
  sessionStorage.clear() // Always clear session on explicit logout/back
  router.replace('/login')
}
</script>