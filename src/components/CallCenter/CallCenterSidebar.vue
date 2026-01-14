<template>
  <aside class="w-64 bg-white h-screen flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-10 font-sans">
    <div class="h-20 flex items-center px-8 border-b border-gray-100">
      <h1 class="text-xl font-extrabold text-indigo-600 flex items-center gap-2">
        Call Center
      </h1>
    </div>

    <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
      <router-link 
        to="/call-center/search-customer" 
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
        active-class="bg-indigo-50 text-indigo-700 font-bold shadow-sm"
      >
        ค้นหาลูกค้า
      </router-link>
    </nav>

    <div class="p-4 border-t border-gray-100 bg-gray-50">
        <button @click="logout" class="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold">
            ออกจากระบบ
        </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>