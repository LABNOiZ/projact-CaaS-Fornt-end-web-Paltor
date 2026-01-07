<template>
  <div class="bg-blue-100 p-10 rounded-xl shadow-lg w-full max-w-md text-center">
    <div class="flex justify-center mb-4">
      <div class="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center bg-white">
        <span class="text-4xl text-green-500">✔</span>
      </div>
    </div>
    <h2 class="text-blue-600 text-xl font-bold mb-2">เสร็จสมบูรณ์</h2>
    <p class="text-blue-800 text-sm mb-8">
      บัญชี Admin ถูกสร้างเรียบร้อยแล้ว<br>
      กด <span class="font-bold">ต่อไป</span> เพื่อเริ่มตั้งค่าความปลอดภัย (2FA)
    </p>

    <div class="flex justify-end">
        <button 
          @click="goToNextStep" 
          class="bg-white border border-gray-300 px-6 py-2 rounded shadow text-blue-600 hover:bg-gray-50 font-bold"
        >
        ต่อไป
        </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const email = route.query.email 

const goToNextStep = () => {
  
  router.push({ 
      path: '/install/two-factor-intro', 
      query: { email: email } 
  })
}
</script>