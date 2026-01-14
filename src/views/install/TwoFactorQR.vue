<template>
  <div class="bg-gray-100 border border-gray-400 p-8 rounded-lg w-full max-w-lg text-center mx-auto mt-10">
    <p class="text-left mb-4 text-sm">
        1. Install one of the following applications on your mobile: <span class="text-blue-500 font-bold">Google Authenticator</span>
    </p>
    <p class="text-left mb-6 text-sm">
        2. Open the application and scan the barcode:
    </p>

    <div class="border-4 border-blue-400 p-2 inline-flex mb-6 bg-white min-h-[180px] min-w-[180px] items-center justify-center relative">
        
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
           <span class="animate-spin text-3xl mb-2">⏳</span>
           <span class="text-xs">กำลังโหลด...</span>
        </div>

        <div v-else class="flex flex-col items-center justify-center w-40 h-40 text-red-500 p-2">
           <span class="text-xs mb-2">{{ errorMessage || 'ไม่สามารถสร้าง QR Code ได้' }}</span>
           <button @click="fetchQRCode" class="text-xs underline text-blue-500 hover:text-blue-700">ลองใหม่</button>
        </div>
    </div>

    <div>
        <button 
          @click="goToNextStep" 
          :disabled="!otpAuthUrl && !fallbackQrUrl"
          class="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            ถัดไป
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue' 
// ✅ เรียกใช้ API มาตรฐาน และ Service ดึงโปรไฟล์
import api from '@/services/api'
import { getUserProfile } from '@/services/adminService'

const route = useRoute()
const router = useRouter()

// ตัวแปร state
const otpAuthUrl = ref('')      
const fallbackQrUrl = ref('')   
const isLoading = ref(false)
const errorMessage = ref('')
// เก็บ email ไว้ใน ref เพื่อให้เปลี่ยนค่าได้
const currentEmail = ref(route.query.email || localStorage.getItem('email') || '')

const fetchQRCode = async () => {
    isLoading.value = true
    errorMessage.value = ''
    otpAuthUrl.value = ''
    fallbackQrUrl.value = ''
    
    try {
        // 🛡️ 1. ถ้าไม่มี Email ให้ลองดึงจาก Profile ตัวเองก่อน (Auto Recovery)
        if (!currentEmail.value) {
            console.log("Email missing, trying to fetch profile...")
            try {
                const profileRes = await getUserProfile() // เรียก API /web/users/profile
                currentEmail.value = profileRes.data.email
                // บันทึกกันเหนียว
                localStorage.setItem('email', currentEmail.value)
            } catch (err) {
                console.warn("Cannot fetch profile", err)
                // ถ้าดึงไม่ได้จริงๆ ค่อยยอมแพ้
                throw new Error("ไม่พบข้อมูล Email (กรุณา Login ใหม่)")
            }
        }

        console.log("Fetching QR for:", currentEmail.value)

        // 🛡️ 2. ยิง API ขอ QR Code
        // ใช้ api ตัวปกติที่มี Token แปะไปด้วย (เพราะเรา Login อยู่)
        const response = await api.post('/web/auth/setup-2fa', 
            { email: currentEmail.value },
            { params: { email: currentEmail.value } } // บางที backend รับทาง param
        )
        
        const data = response.data
        const secretKey = data.secretKey 
        const rawImageUrl = data.qrCodeUrl

        // 3. แปลงผลลัพธ์เป็นรูปภาพ
        if (secretKey) {
            const appName = 'NovaPay'
            const label = `${appName}:${currentEmail.value}`
            otpAuthUrl.value = `otpauth://totp/${label}?secret=${secretKey}&issuer=${appName}`
            // เก็บ Secret ไว้เผื่อหน้าถัดไปใช้
            localStorage.setItem('tempSecret', secretKey)
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
             errorMessage.value = 'ติดสิทธิ์ 403 Forbidden'
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