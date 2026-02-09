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

    <div class="relative z-10 w-full max-w-sm">
        <div class="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
            
            <div class="flex justify-center mb-6">
                <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckIcon class="w-10 h-10 text-green-600" />
                </div>
            </div>

            <h2 class="text-2xl font-bold mb-2 text-gray-800">เสร็จสมบูรณ์</h2>
            
            <p class="text-gray-500 text-sm mb-8 leading-relaxed">
                บัญชี Admin ถูกสร้างเรียบร้อยแล้ว<br>
                กด <span class="font-bold text-gray-700">ต่อไป</span> เพื่อเริ่มตั้งค่าความปลอดภัย (2FA)
            </p>

            <button 
                @click="goToNextStep" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
                <span>ต่อไป</span>
                <ArrowRightIcon class="w-4 h-4" />
            </button>
            
        </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import bgLogin from '@/assets/bg-login_1.png'
import { CheckIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const router = useRouter()


const email = sessionStorage.getItem('install_email') || sessionStorage.getItem('auth_email')

const goToNextStep = () => {
  router.push('/install/two-factor-intro')
}
</script>