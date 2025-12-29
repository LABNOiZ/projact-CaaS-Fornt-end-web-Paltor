<template>
  <div class="bg-gray-100 border border-gray-400 p-8 rounded-lg w-full max-w-2xl">
    <div class="mb-4 text-gray-500 text-sm">ตั้งค่า</div>
    <h2 class="text-2xl font-medium mb-4">Two-factor authentication</h2>
    
    <div class="flex justify-between items-center">
        <p class="text-gray-600">ระบบบังคับให้ตั้งค่า Two-factor authentication</p>
        <button @click="$router.push('/setup/2fa-qr')" class="bg-cyan-400 text-white px-4 py-2 rounded shadow hover:bg-cyan-500">
            + ตั้งค่า Authenticator
        </button>
    </div>
  </div>
</template>