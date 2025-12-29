<template>
  <div class="bg-blue-100 p-10 rounded-xl shadow-lg w-full max-w-md text-center min-h-[300px] flex flex-col justify-center items-center">
    <h2 class="text-2xl font-bold mb-6">Loading...</h2>
    <div class="w-full h-8 border-2 border-black rounded flex overflow-hidden">
        <div class="bg-black w-2/3 h-full"></div>
        <div class="bg-gray-300 w-1/3 h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/install/success')
  }, 2000) // รอ 2 วินาทีแล้วไปหน้าถัดไป
})
</script>