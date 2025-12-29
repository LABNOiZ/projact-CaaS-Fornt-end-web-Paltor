<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-gray-800">Operational Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      <div class="bg-cyan-500 rounded-lg p-4 text-white shadow relative overflow-hidden">
        <h3 class="font-bold text-sm mb-1">Mobile Overview</h3>
        <p class="text-xs opacity-90 mb-3">ผู้ใช้งาน Mobile</p>
        <div class="text-3xl font-bold mb-1">200 <span class="text-sm font-normal">บัญชี</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} 02:30 AM
        </div>
      </div>

      <div class="bg-orange-500 rounded-lg p-4 text-white shadow">
        <h3 class="font-bold text-sm mb-1">ลูกค้าขอบัตรแข็งเข้ามา</h3>
        <div class="text-3xl font-bold mb-1 mt-6">100 <span class="text-sm font-normal">รายการ</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} 02:30 AM
        </div>
      </div>

      <div class="bg-blue-600 rounded-lg p-4 text-white shadow">
        <h3 class="font-bold text-sm mb-1">Web Overview</h3>
        <p class="text-xs opacity-90 mb-3">ผู้ใช้งาน web Portal</p>
        <div class="text-3xl font-bold mb-1">100 <span class="text-sm font-normal">บัญชี</span></div>
        <div class="text-[10px] opacity-80 mt-2">
            อัปเดต: {{ currentDate }} 02:30 AM
        </div>
      </div>
    </div>

    <h3 class="text-lg font-bold mb-3 text-gray-800">System Activity</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
       <div class="bg-yellow-400 rounded-lg p-4 text-black shadow">
          <h4 class="font-bold text-sm">รอการอนุมัติคำร้องขอ</h4>
          <div class="text-3xl font-bold mt-2">50 <span class="text-sm font-normal">รายการ</span></div>
          <div class="text-[10px] opacity-70 mt-2">อัปเดต: {{ currentDate }} 02:30 AM</div>
       </div>

       <div class="bg-green-500 rounded-lg p-4 text-white shadow">
          <h4 class="font-bold text-sm">อนุมัติคำร้องขอแล้ว</h4>
          <div class="text-3xl font-bold mt-2">50 <span class="text-sm font-normal">รายการ</span></div>
          <div class="text-[10px] opacity-80 mt-2">อัปเดต: {{ currentDate }} 02:30 AM</div>
       </div>
       
       <div class="hidden md:block"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h4 class="font-bold mb-2 text-sm text-gray-700">สถิติผู้ใช้งานรายเดือน</h4>
            <div class="h-56">
                <Bar :data="chartData" :options="chartOptions" />
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h4 class="font-bold mb-2 text-sm text-gray-700">ธุรกรรมล่าสุด (Transaction)</h4>
            <div class="h-56">
                 <Line :data="lineChartData" :options="chartOptions" />
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
// Import Chart Components
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

const currentDate = new Date().toLocaleDateString('th-TH')

const chartData = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
  datasets: [{
    label: 'ผู้ใช้งานใหม่',
    backgroundColor: '#3b82f6',
    data: [40, 20, 12, 39, 10, 80]
  }]
}

const lineChartData = {
  labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
  datasets: [{
    label: 'Transaction',
    borderColor: '#10b981',
    backgroundColor: '#10b981',
    data: [15, 25, 20, 45, 30, 60],
    tension: 0.4
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>