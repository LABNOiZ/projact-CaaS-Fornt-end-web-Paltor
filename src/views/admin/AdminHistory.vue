<template>
  <div class="font-sans">
    <h2 class="text-xl font-bold mb-6 text-black">ประวัติแอดมิน</h2>

    <div class="bg-blue-100 p-6 rounded-lg mb-6 shadow-sm">
      <div class="flex flex-col gap-4">
        
        <div class="w-1/3">
          <label class="block text-gray-700 text-sm font-bold mb-1">ค้นหาชื่อผู้ใช้</label>
          <div class="flex gap-2">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="หัสดี ทองบุญ"
              class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 font-bold">
              ค้นหา
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div>
            <label class="block text-gray-700 text-xs font-bold mb-1">เริ่มต้นวันที่:</label>
            <div class="relative">
              <input type="datetime-local" v-model="startDate" class="p-2 border border-gray-300 rounded-md text-sm w-64 text-gray-600"/>
            </div>
          </div>
          <span class="text-gray-500 mt-5">-</span>
          <div>
            <label class="block text-gray-700 text-xs font-bold mb-1">สิ้นสุดวันที่:</label>
            <div class="relative">
              <input type="datetime-local" v-model="endDate" class="p-2 border border-gray-300 rounded-md text-sm w-64 text-gray-600"/>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h3 class="font-bold text-lg">Actual vacations (Admin Log)</h3>
      </div>
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-200 text-gray-700 font-bold">
          <tr>
            <th class="p-4">วัน / เวลา</th>
            <th class="p-4">Name</th>
            <th class="p-4">Activity</th>
            <th class="p-4">Result</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(log, index) in filteredLogs" :key="index" class="hover:bg-gray-50 transition">
            <td class="p-4 text-gray-900 whitespace-nowrap">{{ log.datetime }}</td>
            <td class="p-4 text-gray-900 font-medium">{{ log.name }}</td>
            <td class="p-4 text-gray-600">
              {{ log.activity }}
              <div v-if="log.subActivity" class="text-xs text-gray-400">{{ log.subActivity }}</div>
            </td>
            <td class="p-4">
              <span :class="log.result === 'Success' ? 'text-green-600' : 'text-red-500'" class="font-bold">
                {{ log.result }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredLogs.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบข้อมูลประวัติ
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock Data ตามรูปภาพ (Admin History)
const logs = ref([
  { datetime: '12/03/2024 | 09:30 AM', name: 'หัสดี ทองบุญ', activity: 'login', result: 'Success' },
  { datetime: '12/03/2024 | 09:35 AM', name: 'หัสดี ทองบุญ', activity: 'เปลี่ยน role ของ', subActivity: 'อภิรดี อยู่ดี', result: 'Success' },
  { datetime: '12/03/2024 | 09:48 AM', name: 'หัสดี ทองบุญ', activity: 'ลบ ชาญวิทย์ องศา', subActivity: 'ออกจากระบบ', result: 'Success' },
  { datetime: '12/03/2024 | 10:00 AM', name: 'หัสดี ทองบุญ', activity: 'logout', result: 'Success' },
])

const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')

const filteredLogs = computed(() => {
  return logs.value.filter(log => 
    log.name.includes(searchQuery.value) || 
    log.activity.includes(searchQuery.value)
  )
})
</script>