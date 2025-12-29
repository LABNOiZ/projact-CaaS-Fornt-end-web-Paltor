<template>
  <div class="bg-gray-100 border border-blue-500 p-10 rounded-lg w-full max-w-md text-center">
    <div class="flex justify-center mb-6">
      <div class="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center bg-white">
        <span class="text-4xl">✔</span>
      </div>
    </div>
    
    <h2 class="text-lg font-bold mb-8">ตั้งค่า 2factor เสร็จสิ้น</h2>

    <button @click="$router.push('/login')" class="bg-cyan-400 text-white px-6 py-2 rounded shadow hover:bg-cyan-500">
        กลับไปหน้าล็อกอิน
    </button>
  </div>
</template>