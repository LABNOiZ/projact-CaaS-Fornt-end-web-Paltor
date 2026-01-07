<template>
  <div class="bg-blue-100 p-10 rounded-xl shadow-lg w-full max-w-md text-center min-h-[300px] flex flex-col justify-center items-center">
    <h2 class="text-2xl font-bold mb-6">กำลังสร้างบัญชี...</h2>
    <div class="w-full h-8 border-2 border-black rounded flex overflow-hidden relative">
        <div class="bg-black h-full animate-loading-bar"></div>
    </div>
  </div>
</template>

<style scoped>
/*  Animation โหลด */
@keyframes load {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-loading-bar {
  animation: load 2s ease-out forwards;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  setTimeout(() => {
  
    router.push({
        path: '/install/success',
        query: { email: route.query.email } 
    })
  }, 2000) 
})
</script>