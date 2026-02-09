<template>
  <router-view />

  <div v-if="showTimeoutModal" class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center 
                                      justify-center z-[9999] animate-fade-in px-4">
    
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100  
                animate-bounce-in border border-gray-100">
      
      <div class="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
         <div class="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-2 animate-pulse">
            <ClockIcon class="h-10 w-10 text-red-500" />
         </div>
      </div>

      <div class="p-8 text-center">
        <h3 class="text-2xl font-extrabold text-gray-800 mb-2">หมดเวลาการใช้งาน</h3>
        <p class="text-gray-500 mb-8 text-sm leading-relaxed">
          เพื่อความปลอดภัยของข้อมูล ระบบได้ทำการออกจากระบบอัตโนมัติ เนื่องจากไม่มีการใช้งานเป็นเวลานาน
        </p>

        <button 
          @click="handleTimeoutConfirm"
           class="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30
                 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all 
                  duration-200 flex items-center justify-center gap-2 group"
        >
          <span>เข้าสู่ระบบใหม่</span>
          <ArrowRightOnRectangleIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import { ClockIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute() // ✅ 2. เรียกใช้ route เพื่อเช็คหน้าปัจจุบัน

const showTimeoutModal = ref(false)
let timer = null

// ตั้งเวลา (20 นาที)
const TIMEOUT_DURATION = 60 * 60 * 1000 
const events = ['click', 'mousemove', 'mousedown', 'scroll', 'keypress', 'touchstart']

//  ฟังก์ชันเช็คว่าควรเริ่มนับเวลาไหม?
const shouldTrackTime = () => {
    // 1. ต้องมี Token (แปลว่า Login แล้ว)
    const hasToken = sessionStorage.getItem('token');
    
    // 2. ต้องไม่อยู่ในหน้า Login หรือหน้า Public ต่างๆ
    const isPublicPage = ['/login', '/login-2fa', '/two-factor-intro'].includes(route.path);

    // 3. Modal ต้องยังไม่ขึ้น
    return hasToken && !isPublicPage && !showTimeoutModal.value;
}

const resetTimer = () => {
  // ถ้าไม่เข้าเงื่อนไข (เช่น อยู่หน้า Login) ให้เคลียร์เวลาทิ้งแล้วจบเลย
  if (!shouldTrackTime()) {
      clearTimeout(timer);
      return;
  }

  // ถ้าเข้าเงื่อนไข ให้เริ่มนับใหม่
  clearTimeout(timer)
  timer = setTimeout(triggerLogout, TIMEOUT_DURATION)
}

const triggerLogout = () => {
  // เช็คซ้ำอีกรอบเพื่อความชัวร์ (เผื่อ Route เปลี่ยนตอนนับเสร็จพอดี)
  if (!shouldTrackTime()) return;

  // ลบ Token
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('roleId')
  
  // แสดง Modal
  showTimeoutModal.value = true
}

const handleTimeoutConfirm = () => {
  showTimeoutModal.value = false
  router.push('/login')
}

onMounted(() => {
  events.forEach(event => window.addEventListener(event, resetTimer))
  resetTimer()
})

onUnmounted(() => {
  events.forEach(event => window.removeEventListener(event, resetTimer))
  clearTimeout(timer)
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

<style>
/* Global Styles */
html, body, #app {
  user-select: none;
  cursor: default; 
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  font-family: 'Sarabun', sans-serif;
}

input, textarea {
  user-select: text;
  cursor: text;
  -webkit-user-select: text;
}
</style>