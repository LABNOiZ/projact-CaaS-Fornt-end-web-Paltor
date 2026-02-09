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
        <div class="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
            
            <h2 class="text-xl font-bold mb-6 text-gray-800 tracking-tight">Scan QR Code</h2>
            
            <div class="text-left mb-6 space-y-3">
                <p class="text-sm text-gray-600">
                    <span class="font-bold text-blue-600">1.</span> Install <span class="font-bold text-gray-800">Google Authenticator</span> app on your mobile device.
                </p>
                <p class="text-sm text-gray-600">
                    <span class="font-bold text-blue-600">2.</span> Open the app and scan the barcode below:
                </p>
            </div>

            <div class="border-4 border-blue-100 rounded-xl p-4 inline-flex mb-8 bg-white min-h-[180px] min-w-[180px] items-center justify-center relative shadow-sm">
                
                <qrcode-vue 
                  v-if="otpAuthUrl" 
                  :value="otpAuthUrl" 
                  :size="160" 
                  level="H" 
                  class="mx-auto"
                />

                <img 
                  v-else-if="fallbackQrUrl" 
                  :src="fallbackQrUrl" 
                  alt="QR Code" 
                  class="w-40 h-40 object-contain mx-auto"
                />
                
                <div v-else-if="isLoading" class="flex flex-col items-center justify-center w-40 h-40 text-gray-400">
                   <ArrowPathIcon class="w-8 h-8 animate-spin mb-2 text-blue-500" />
                   <span class="text-xs">กำลังโหลด...</span>
                </div>

                <div v-else class="flex flex-col items-center justify-center w-40 h-40 text-red-500 p-2">
                   <ExclamationCircleIcon class="w-8 h-8 mb-2" />
                   <span class="text-xs mb-2 text-center">{{ errorMessage || 'ไม่สามารถสร้าง QR Code ได้' }}</span>
                   <button @click="fetchQRCode" class="text-xs underline text-blue-600 hover:text-blue-800 font-bold">ลองใหม่</button>
                </div>
            </div>

            <button 
                @click="goToNextStep" 
                :disabled="!otpAuthUrl && !fallbackQrUrl"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
            >
                <span>ถัดไป</span>
                <ArrowRightIcon class="w-4 h-4" />
            </button>

        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue' 
import api from '@/services/api' 
import bgLogin from '@/assets/bg-login_1.png'
import { ArrowPathIcon, ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()

// ตัวแปร state
const otpAuthUrl = ref('')      
const fallbackQrUrl = ref('')   
const isLoading = ref(false)
const errorMessage = ref('')

// 1. ดึง Email ตามลำดับความสำคัญ (Query Param -> Session)
const currentEmail = ref(
    route.query.email || 
    sessionStorage.getItem('auth_email') || 
    sessionStorage.getItem('install_email') || 
    ''
)

const fetchQRCode = async () => {
    isLoading.value = true
    errorMessage.value = ''
    otpAuthUrl.value = ''
    fallbackQrUrl.value = ''
    
    try {
        if (!currentEmail.value) {
            // ถ้าหาอีเมลไม่เจอจริงๆ ให้ Error เลย ไม่ต้องยิง Profile (เพราะจะติด 403)
            throw new Error("ไม่พบข้อมูล Email กรุณา Login ใหม่")
        }

        console.log("Fetching QR for:", currentEmail.value)

        // 2. ยิง API ขอ QR Code
        // หมายเหตุ: ใช้ api.post ตามเดิมที่คุณใช้ (แต่จริงๆ ควรใช้ authService ถ้ามี)
        const response = await api.post('/web/auth/setup-2fa', { 
            email: currentEmail.value 
        })
        
        const data = response.data
        const secretKey = data.secretKey 
        const rawImageUrl = data.qrCodeUrl

        // 3. แปลงผลลัพธ์
        if (secretKey) {
            const appName = 'NovaPay'
            const label = `${appName}:${currentEmail.value}`
            otpAuthUrl.value = `otpauth://totp/${label}?secret=${secretKey}&issuer=${appName}`
            
            // เก็บ Secret ไว้ใช้หน้าถัดไป (ถ้าจำเป็น) แต่ไม่ควรเก็บ Email ซ้ำถ้ามีอยู่แล้ว
            sessionStorage.setItem('tempSecret', secretKey)
        } 
        else if (rawImageUrl) {
            const cleanBase64 = rawImageUrl.replace(/\s/g, '')
            fallbackQrUrl.value = cleanBase64.startsWith('data:image') 
                ? cleanBase64 
                : `data:image/png;base64,${cleanBase64}`
        } 
        else {
            throw new Error('Server ไม่ส่งข้อมูล QR กลับมา')
        }

    } catch (error) {
        console.error("QR Code Error:", error)
        
        if (error.response && error.response.status === 403) {
             // 403 คือ Token ใช้ไม่ได้ หรือไม่มีสิทธิ์
             errorMessage.value = 'Session หมดอายุหรือไม่มีสิทธิ์ (กรุณา Login ใหม่)'
        } else if (error.message) {
             errorMessage.value = error.message
        } else {
             errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
        }
    } finally {
        isLoading.value = false
    }
}

const goToNextStep = () => {
    // ส่ง Email ต่อไปหน้ายืนยัน
    router.push({ 
        path: '/install/two-factor-verify', 
        query: { email: currentEmail.value } 
    })
}

onMounted(() => {
    fetchQRCode()
})
</script>