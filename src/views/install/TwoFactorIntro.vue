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

    <div class="relative z-10 w-full max-w-xl">
        <div class="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
            
            <div class="mb-6">
                <span class="text-blue-600 text-xs font-bold uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full">
                    Setup Security
                </span>
                <h2 class="text-2xl font-bold mt-3 text-gray-800">Two-factor authentication</h2>
                <p class="text-gray-500 text-sm mt-1">
                    เพิ่มความปลอดภัยอีกขั้นให้กับบัญชีผู้ดูแลระบบ
                </p>
            </div>
            
            <div class="bg-blue-50/60 rounded-xl border border-blue-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div class="flex items-start gap-4">
                    <div class="p-3 bg-white rounded-full shadow-sm text-blue-600">
                        <ShieldCheckIcon class="w-8 h-8" />
                    </div>
                    <div>
                        <h3 class="text-gray-800 font-bold text-sm">ระบบบังคับเปิดใช้งาน 2FA</h3>
                        <p class="text-gray-500 text-xs mt-1 leading-relaxed">
                            กรุณาตั้งค่า Authenticator App<br>เพื่อใช้ในการเข้าสู่ระบบครั้งถัดไป
                        </p>
                    </div>
                </div>

                <button 
                    @click="goNext" 
                    class="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 text-sm font-bold flex items-center gap-2"
                >
                    <PlusIcon class="w-4 h-4" />
                    ตั้งค่า Authenticator
                </button>

            </div>

        </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import bgLogin from '@/assets/bg-login_1.png'
import { ShieldCheckIcon, PlusIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// ดึง Email จาก Session ที่หน้า TwoFactorCard ฝังไว้
const email = sessionStorage.getItem('install_email') || sessionStorage.getItem('auth_email')

const goNext = () => {
    // ✅ ส่ง Email แนบไปกับ URL เลย เพื่อกันเหนียว
    router.push({
        path: '/install/two-factor-qr',
        query: { email: email }
    })
}
</script>