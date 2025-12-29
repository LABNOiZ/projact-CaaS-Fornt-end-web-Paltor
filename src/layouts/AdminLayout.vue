<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="h-16 flex items-center justify-center border-b border-gray-100">
        <h1 class="text-xl font-bold text-black">Admin</h1>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <div class="px-4 mb-2 text-xs font-bold text-blue-600 uppercase">ภาพรวมระบบ</div>
        
        <ul class="space-y-1 mb-6">
          <li>
            <a href="#" class="flex items-center px-4 py-2 bg-gray-100 text-gray-900 rounded-md mx-2">
              <span class="mr-3">🏠</span> Dashboard
            </a>
          </li>
          <li><a href="#" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 mx-2 transition"><span class="mr-3">📊</span> Operations</a></li>
          <li><a href="#" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 mx-2 transition"><span class="mr-3">🌐</span> ผู้ใช้งาน web</a></li>
          <li><a href="#" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 mx-2 transition"><span class="mr-3">👥</span> Customer Activities</a></li>
        </ul>

        <div class="px-4 mb-2 text-xs font-bold text-blue-600 uppercase">การตั้งค่าเปลี่ยนรหัส</div>
         <ul class="space-y-1">
          <li><a href="#" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 mx-2 transition"><span class="mr-3">🔒</span> เปลี่ยนรหัส</a></li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <button @click="logout" class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-bold">
          ออกจากระบบ
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <router-view /> </main>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
  // Mock Logout -> กลับไปหน้า Login
  router.push('/login')
}
</script>