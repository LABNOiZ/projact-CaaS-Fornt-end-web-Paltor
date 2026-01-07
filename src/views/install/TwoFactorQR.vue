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

        <div v-else class="flex flex-col items-center justify-center w-40 h-40 text-red-500">
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
import axios from 'axios' 
import QrcodeVue from 'qrcode.vue' 

const route = useRoute()
const router = useRouter()

const email = route.query.email 
const otpAuthUrl = ref('')      
const fallbackQrUrl = ref('')   
const isLoading = ref(false)
const errorMessage = ref('')

const fetchQRCode = async () => {
    // ตรวจสอบ Email
    if (!email) {
        errorMessage.value = "ไม่พบ Email (ระบบผิดพลาด)"
        return
    }
    
    isLoading.value = true
    errorMessage.value = ''
    otpAuthUrl.value = ''
    fallbackQrUrl.value = ''
    
    try {
        console.log(" Fetching QR for:", email)

        // สร้าง Axios Instanceใหม่เพื่อล้าง Token เก่าทิ้ง
        const cleanAxios = axios.create();
        delete cleanAxios.defaults.headers.common['Authorization']; 

        
        // ส่ง email ไปทั้งใน Body และ Query Params เพื่อความชัวร์
        const response = await cleanAxios.post('/api/v1/web/auth/setup-2fa', 
            { email: email }, 
            { params: { email: email } }
        )
        
        const data = response.data
        console.log(" Server Response:", data)

        const secretKey = data.secretKey 
        const rawImageUrl = data.qrCodeUrl

        if (secretKey) {
            // สร้าง QR จาก Secret Key
            const appName = 'NovaPay'
            const label = `${appName}:${email}`
            otpAuthUrl.value = `otpauth://totp/${label}?secret=${secretKey}&issuer=${appName}`
        } 
        else if (rawImageUrl) {
            // ใช้รูปจาก Server 
            const cleanBase64 = rawImageUrl.replace(/\s/g, '')
            fallbackQrUrl.value = cleanBase64.startsWith('data:image') 
                ? cleanBase64 
                : `data:image/png;base64,${cleanBase64}`
        } 
        else {
            errorMessage.value = 'เซิร์ฟเวอร์ไม่ส่งข้อมูล QR Code กลับมา'
        }

    } catch (error) {
        console.error("QR Code Error:", error)
        if (error.response && error.response.status === 403) {
             errorMessage.value = 'ติดสิทธิ์ 403: (ตรวจสอบ Method POST หรือสิทธิ์การเข้าถึง)'
        } else {
             errorMessage.value = error.response?.data?.message || 'โหลด QR Code ไม่สำเร็จ'
        }
    } finally {
        isLoading.value = false
    }
}

const goToNextStep = () => {
    router.push({ 
        path: '/install/two-factor-verify', 
        query: { email: email } 
    })
}

onMounted(() => {
    fetchQRCode()
})
</script>