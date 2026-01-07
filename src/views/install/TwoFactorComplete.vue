<template>
  <div class="bg-gray-100 border border-blue-500 p-10 rounded-lg w-full max-w-md text-center mx-auto mt-10">
    <div class="flex justify-center mb-6">
      <div class="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center bg-white">
        <span class="text-4xl text-green-500">✔</span>
      </div>
    </div>
    
    <h2 class="text-xl font-bold mb-4">ตั้งค่า 2-Factor เสร็จสิ้น</h2>
    <p class="text-gray-600 mb-8">บัญชีของคุณปลอดภัยและพร้อมใช้งานแล้ว</p>

    <button @click="goToDashboard" class="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 font-bold w-full">
        เข้าสู่ระบบจัดการ (Dashboard)
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToDashboard = () => {
    // มีTokenแล้วไปหน้า Admin Dashboard ได้เลย
    router.push('/admin/dashboard')
}
</script>