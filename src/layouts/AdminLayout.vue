<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="h-16 flex items-center justify-center border-b border-gray-100 mb-2">
        <h1 class="text-xl font-bold text-black">Admin</h1>
      </div>

      <nav class="flex-1 overflow-y-auto py-2">
        
        <div class="px-6 mb-2 mt-2 text-xs font-bold text-blue-600 uppercase tracking-wide">
          ภาพรวมระบบ
        </div>
        
        <ul class="space-y-1 mb-6">
          <li>
            <router-link 
              to="/admin/dashboard" 
              class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              active-class="bg-blue-50 text-blue-600 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="text-sm">Dashboard</span>
            </router-link>
          </li>

          <li>
            <router-link 
              to="/admin/web-users" 
              class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              active-class="bg-blue-50 text-blue-600 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span class="text-sm">ผู้ใช้งาน web</span>
            </router-link>
          </li>

          <li>
            <a href="#" class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span class="text-sm">ประวัติลูกค้า</span>
            </a>
          </li>

          <li>
            <a href="#" class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-sm">ประวัติแอดมิน</span>
            </a>
          </li>
        </ul>

        <div class="px-6 mb-2 text-xs font-bold text-blue-600 uppercase tracking-wide">
          การตั้งค่าเปลี่ยนรหัส
        </div>
         <ul class="space-y-1">
          <li>
            <a href="#" class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm">เปลี่ยนรหัส</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <button @click="logout" class="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition text-sm font-bold shadow-sm">
          ออกจากระบบ
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <router-view /> 
    </main>

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