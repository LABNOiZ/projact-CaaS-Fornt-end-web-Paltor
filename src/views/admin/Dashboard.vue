<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-gray-800">Operational Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      <div class="bg-cyan-500 rounded-lg p-4 text-white shadow relative overflow-hidden">
        <h3 class="font-bold text-sm mb-1">Mobile Overview</h3>
        <p class="text-xs opacity-90 mb-3">ผู้ใช้งาน Mobile</p>
        <div class="text-3xl font-bold mb-1">{{ stats.totalMobileUsers }} <span class="text-sm font-normal">บัญชี</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} {{ currentTime }}
        </div>
      </div>

      <div class="bg-orange-500 rounded-lg p-4 text-white shadow">
        <h3 class="font-bold text-sm mb-1">ลูกค้าขอบัตรแข็งเข้ามา</h3>
        <div class="text-3xl font-bold mb-1 mt-6">{{ stats.cardRequests }} <span class="text-sm font-normal">รายการ</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} {{ currentTime }}
        </div>
      </div>

      <div class="bg-blue-600 rounded-lg p-4 text-white shadow">
        <h3 class="font-bold text-sm mb-1">Web Overview</h3>
        <p class="text-xs opacity-90 mb-3">ผู้ใช้งาน web Portal</p>
        <div class="text-3xl font-bold mb-1">{{ stats.totalWebUsers }} <span class="text-sm font-normal">บัญชี</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} {{ currentTime }}
        </div>
      </div>
    </div>

    <h3 class="text-lg font-bold mb-3 text-gray-800">System Activity</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
       <div class="bg-yellow-400 rounded-lg p-4 text-black shadow">
          <h4 class="font-bold text-sm">รอการอนุมัติคำร้องขอ</h4>
          <div class="text-3xl font-bold mt-2">{{ stats.frozenCards }} <span class="text-sm font-normal">รายการ</span></div>
          <div class="text-[10px] opacity-70 mt-2">อัปเดต: {{ currentDate }} {{ currentTime }}</div>
       </div>

       <div class="bg-green-500 rounded-lg p-4 text-white shadow">
          <h4 class="font-bold text-sm">อนุมัติคำร้องขอแล้ว</h4>
          <div class="text-3xl font-bold mt-2">{{ stats.approvedRequests }} <span class="text-sm font-normal">รายการ</span></div>
          <div class="text-[10px] opacity-80 mt-2">อัปเดต: {{ currentDate }} {{ currentTime }}</div>
       </div>
      <div class="hidden md:block"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminDashboardStats } from '@/services/adminService'

// จัดการเรื่องวันเวลา
const currentDate = new Date().toLocaleDateString('th-TH')
const currentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

// ตัวแปรสำหรับเก็บข้อมูลจริง
const stats = ref({
  totalMobileUsers: 0,
  totalWebUsers: 0,
  cardRequests: 0,
  approvedRequests: 0,
  frozenCards: 0
})

//  ดึงข้อมูลจาก API
const fetchDashboardData = async () => {
  try {
    const response = await getAdminDashboardStats()
    const data = response.data
    
    stats.value = {
      totalMobileUsers: data.totalMobileUsers,
      totalWebUsers: data.totalWebUsers,
      cardRequests: data.MocK_cardRequests,         // ลูกค้าขอบัตรแข็ง
      approvedRequests: data.MoCK_approvedRequests, // อนุมัติแล้ว
      frozenCards: data.Mock_frozenCards            // รออนุมัติ
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

//  เรียกใช้เมื่อโหลดหน้าเว็บ
onMounted(() => {
  fetchDashboardData()
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>