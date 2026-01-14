<template>
  <div class="flex gap-6 font-sans relative">
    
    <SettingsSidebar basePath="/admin" />

    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-6 text-black">Settings</h2>

      <div class="bg-gray-100 rounded-lg p-4 px-6 flex items-center justify-between border border-gray-300 shadow-sm max-w-4xl">
        <div class="flex items-center gap-10">
          <div class="font-bold text-gray-500 text-lg uppercase">2FA STATUS</div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-green-600 text-lg">Active</span>
            <span class="text-gray-500 text-sm">for {{ currentUserEmail || 'loading...' }}</span>
          </div>
        </div>

        <button 
          @click="openDeleteModal"
          class="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded shadow transition font-bold"
        >
          Disable 2FA
        </button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm px-4">
      
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-fade-in-up p-8">
        
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-orange-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">ยืนยันการปิด 2FA</h3>
        </div>

        <div class="flex flex-col items-center text-center mb-8">
          <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-1.5 0h12a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z" />
            </svg>
          </div>

          <p class="text-xl font-bold text-gray-900 mb-2">
            ใส่รหัสผ่านเพื่อยืนยัน
          </p>
          <p class="text-gray-500 text-sm">
            โปรดระบุรหัสผ่าน Login ของคุณเพื่อยืนยันการทำรายการ
          </p>
        </div>

        <div class="mb-8">
          <div class="w-full text-left">
            <PasswordInput 
              v-model="confirmPassword" 
              label="Password"
              placeholder="กรอกรหัสผ่านเพื่อยืนยัน..."
              class="w-full"
              inputClass="bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>
          <div class="h-6 mt-2 text-center">
             <p v-if="isError" class="text-red-500 font-bold text-sm ">
               {{ errorMessage || 'รหัสผ่านไม่ถูกต้อง' }}
             </p>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            @click="closeModal"
            class="flex-1 py-3 rounded-full border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition duration-200"
          >
            ยกเลิก
          </button>
          
          <button 
            @click="handleSubmit"
            :disabled="isLoading"
            class="flex-1 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>ยืนยัน</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import PasswordInput from '@/components/PasswordInput.vue'

// ✅ Import Service ที่เราทำไว้
import { resetTwoFactor, getUserProfile } from '@/services/adminService'

const router = useRouter()

// State
const showModal = ref(false)
const confirmPassword = ref('')
const isError = ref(false)
const errorMessage = ref('') // เพิ่มไว้แสดงข้อความ error จากหลังบ้าน
const isLoading = ref(false)
const currentUserEmail = ref('') // เอาไว้เก็บอีเมลตัวเอง

// 1. โหลดข้อมูล Profile ทันที เพื่อเอาอีเมลมาเตรียมไว้
onMounted(async () => {
  try {
    const res = await getUserProfile()
    currentUserEmail.value = res.data.email // (ต้องเช็ค console ว่า key ชื่อ email หรือเปล่านะครับ)
  } catch (error) {
    console.error("Failed to load profile", error)
  }
})

// เปิด Modal
const openDeleteModal = () => {
  confirmPassword.value = '' 
  isError.value = false
  errorMessage.value = ''
  showModal.value = true     
}

// ปิด Modal
const closeModal = () => {
  showModal.value = false
}

// กดยืนยันใน Modal
const handleSubmit = async () => {
  if (!confirmPassword.value) {
    isError.value = true
    errorMessage.value = 'กรุณากรอกรหัสผ่าน'
    return
  }

  isLoading.value = true
  isError.value = false

  try {
    //  2. เรียก API (ส่งอีเมลตัวเอง + รหัสผ่านที่พิมพ์มา)
    await resetTwoFactor(currentUserEmail.value, confirmPassword.value)
    
    console.log("Reset Success!")
    
    // ตั้งค่า flag ว่ามาจาก settings (เผื่อหน้า intro ต้องการรู้)
    localStorage.setItem('setupOrigin', 'settings') 
    
    showModal.value = false
    
    // 3. เด้งไปหน้าเริ่ม Setup ใหม่
    // (หรือจะแค่ Alert ว่าปิดสำเร็จแล้วก็ได้ แล้วแต่ Flow งาน)
    router.push({ name: 'TwoFactorIntro' }) 

  } catch (error) {
    console.error(error)
    isError.value = true
    // ถ้าหลังบ้านส่ง error message มา ให้โชว์ด้วย
    // เช่น รหัสผ่านผิด (403 Forbidden)
    if (error.response && error.response.status === 403) {
        errorMessage.value = 'รหัสผ่านไม่ถูกต้อง'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>