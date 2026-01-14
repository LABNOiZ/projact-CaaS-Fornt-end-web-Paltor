<template>
  <aside class="w-64 bg-white shadow-md flex flex-col z-10">
    <div class="h-16 flex items-center justify-center border-b border-gray-100 mb-2">
      <h1 class="text-xl font-bold text-black">Admin</h1>
    </div>

    <nav class="flex-1 overflow-y-auto py-2">
      
      <div class="px-6 mb-2 mt-2 text-xs font-bold text-blue-600 tracking-wide">
        ภาพรวมระบบ
      </div>
      
      <ul class="space-y-1 mb-6">
        <li>
          <router-link 
            to="/admin/dashboard" 
            class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            active-class="bg-blue-50 text-blue-600 font-bold"
          >
            <HomeIcon class="h-5 w-5 mr-3" />
            <span class="text-sm">Dashboard</span>
          </router-link>
        </li>

        <li>
          <router-link 
            to="/admin/web-users" 
            class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            active-class="bg-blue-50 text-blue-600 font-bold"
          >
            <GlobeAltIcon class="h-5 w-5 mr-3" />
            <span class="text-sm">ผู้ใช้งาน web</span>
          </router-link>
        </li>

        <li>
          <router-link 
            to="/admin/admin-history" 
            class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            active-class="bg-blue-50 text-blue-600 font-bold"
          >
            <ClockIcon class="h-5 w-5 mr-3" />
            <span class="text-sm">ประวัติแอดมิน</span>
          </router-link>
        </li>
      </ul>

      <div class="px-6 mb-2 text-xs font-bold text-blue-600 uppercase tracking-wide">
          การตั้งค่า
      </div>
      
      <ul class="space-y-1">
          <li>
             <router-link 
                 to="/admin/settings/profile"
                 class="flex items-center px-6 py-3 mx-2 rounded-lg transition-colors duration-200"
                 :class="isSettings ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
              >
                  <Cog6ToothIcon class="h-5 w-5 mr-3" />
                  <span class="text-sm">ตั้งค่า</span>
              </router-link>
          </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-gray-100">
      <button @click="logout" class="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition text-sm font-bold shadow-sm">
        ออกจากระบบ
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

// Import ไอคอนมาไว้ที่นี่แทน
import { 
  HomeIcon, 
  GlobeAltIcon, 
  ClockIcon, 
  Cog6ToothIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute() 

// Logic การเช็ค Active Link ย้ายมาอยู่ที่นี่
const isSettings = computed(() => {
  return route.path.includes('/settings')
})

// Logic Logout ย้ายมาอยู่ที่นี่
const logout = () => {
  localStorage.removeItem('token') 
  router.push('/login')
}
</script>