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
        <div class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            
            <div class="mb-8">
                <div class="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto animate-bounce">
                    <div class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                        <CheckIcon class="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>

            <h2 class="text-3xl font-bold mb-3 text-white tracking-wide drop-shadow-md">
                เสร็จสมบูรณ์!
            </h2>
            
            <p class="text-blue-100/80 text-sm mb-8 leading-relaxed">
                ตั้งค่า 2FA เรียบร้อยแล้ว<br>
                บัญชีของคุณพร้อมใช้งาน
            </p>

            <button 
                @click="finishAndLogout" 
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/40 transform 
                hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2"
            >
                <span>เข้าสู่ระบบใหม่</span>
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>
            
        </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import bgLogin from '@/assets/bg-login_1.png'
import { CheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

const finishAndLogout = () => {
  //  ล้าง Session ทั้งหมดตรงนี้ (Logout)
  sessionStorage.clear()

  // ดีดกลับไปหน้า Login เพื่อให้ User Login เอง
  router.push('/login')
}
</script>