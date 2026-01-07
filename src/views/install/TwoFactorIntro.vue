<template>
  <div class="bg-gray-100 border border-gray-400 p-8 rounded-lg w-full max-w-2xl">
    <div class="mb-4 text-gray-500 text-sm">ตั้งค่า</div>
    <h2 class="text-2xl font-medium mb-4">Two-factor authentication</h2>
    
    <div class="flex justify-between items-center">
        <p class="text-gray-600">ระบบบังคับให้ตั้งค่า Two-factor authentication เพื่อความปลอดภัย</p>
        <button @click="goNext" class="bg-cyan-400 text-white px-4 py-2 rounded shadow hover:bg-cyan-500">
            + ตั้งค่า Authenticator
        </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goNext = () => {
    // ส่งไปหน้า QR Code
    router.push({
        path: '/install/two-factor-qr',
        query: { email: route.query.email }
    })
}
</script>