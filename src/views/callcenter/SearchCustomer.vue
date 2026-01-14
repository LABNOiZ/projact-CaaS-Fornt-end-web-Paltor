<template>
  <div>
    <h2 class="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">ค้นหาลูกค้า</h2>

    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 class="text-lg font-bold text-gray-700 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2 text-indigo-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        กรองข้อมูลการค้นหา
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2 pl-1">ชื่อ-นามสกุล</label>
          <input 
            v-model="searchForm.name"
            type="text" 
            placeholder="ระบุชื่อ หรือนามสกุล..."
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-gray-50"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2 pl-1">เลขบัตรประชาชน 13 หลัก</label>
          <input 
            v-model="searchForm.idCard"
            type="text" 
            placeholder="ตัวอย่าง: 1 7399 02013 852"
            maxlength="13"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-gray-50 font-mono"
          />
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button 
            @click="handleSearch"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            ค้นหาข้อมูล
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 class="text-lg font-bold text-gray-800">ผลลัพธ์การค้นหา</h3>
             <span class="text-sm text-gray-500">พบ {{ mockResults.length }} รายการ</span>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-gray-600 text-sm uppercase font-bold tracking-wider">
                    <tr>
                        <th class="px-6 py-4">ชื่อ-นามสกุล</th>
                        <th class="px-6 py-4">อีเมล</th>
                        <th class="px-6 py-4">เบอร์โทร</th>
                        <th class="px-6 py-4">เลขบัตรประชาชน</th>
                        <th class="px-6 py-4 text-center">ดำเนินการ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="(customer, index) in mockResults" :key="index" class="hover:bg-indigo-50/50 transition">
                        <td class="px-6 py-4 font-bold text-gray-900">{{ customer.name }}</td>
                        <td class="px-6 py-4 text-gray-600">{{ customer.email }}</td>
                        <td class="px-6 py-4 text-gray-600 font-mono">{{ customer.phone }}</td>
                        <td class="px-6 py-4 text-gray-600 font-mono">{{ customer.idCard }}</td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center justify-center mx-auto gap-1 py-1 px-3 rounded hover:bg-indigo-100 transition">
                                ดูรายละเอียด
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="mockResults.length === 0">
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-gray-300 mb-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            กรุณากรอกข้อมูลเพื่อค้นหา
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Form State
const searchForm = reactive({
    name: '',
    idCard: ''
})

// Mock Data (ข้อมูลจำลองตามรูปภาพ)
const mockResults = ref([
    {
        name: 'เฉลิมลาภ ช่วยอภัย',
        email: 'Fluk25600@gmail.com',
        phone: '064 4052560',
        idCard: '1 7399 02013 852'
    },
    {
        name: 'ลาภ น้อย',
        email: 'Fluk25600@gmail.com',
        phone: '064 4052560',
        idCard: '9 7399 02013 852'
    },
    // เพิ่มข้อมูลจำลองได้ที่นี่
])

const handleSearch = () => {
    console.log('Searching with:', searchForm)
    // TODO: เรียก API ค้นหาลูกค้าจริง
    alert('เริ่มการค้นหา... (Function นี้รอการเชื่อมต่อ API)')
}
</script>