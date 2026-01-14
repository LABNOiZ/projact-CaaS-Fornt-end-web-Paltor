<template>
  <div class="flex gap-6 font-sans">
    
    <SettingsSidebar basePath="/admin" />

    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>

      <div class="bg-white p-8 rounded-lg shadow-sm max-w-lg border border-gray-100">
        <h3 class="text-lg font-bold mb-4 text-gray-800">เปลี่ยนรหัสผ่าน</h3>

        <form @submit.prevent="handleSave" class="space-y-2">
          
          <PasswordInput 
            v-model="form.oldPass" 
            label="ใส่รหัสผ่านเดิม" 
            placeholder="ระบุรหัสเดิม"
          />

          <PasswordInput 
            v-model="form.newPass" 
            label="ใส่รหัสผ่านใหม่" 
            placeholder="ระบุรหัสใหม่"
          />

          <div class="mb-4">
             <PasswordRules 
               :password="form.newPass" 
               @check-valid="handleRuleCheck"
             />
          </div>

          <PasswordInput 
            v-model="form.confirmPass" 
            label="ยืนยันรหัสผ่านใหม่" 
            placeholder="ยืนยันรหัสใหม่อีกครั้ง"
          />
          
          <p v-if="form.confirmPass && !isMatch" class="text-red-500 text-sm font-bold mt-1 mb-4">
             รหัสผ่านยืนยันไม่ตรงกัน
          </p>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center shadow disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
          >
            <span v-if="isLoading">กำลังบันทึก...</span>
            <span v-else>บันทึกรหัสใหม่</span>
          </button>
        </form>
      </div>
    </div>

    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-2xl text-center w-80 animate-fade-in-up">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
           </svg>
        </div>
        <h3 class="text-xl font-bold text-green-600 mb-2">สำเร็จ!</h3>
        <p class="text-gray-500 mb-6 text-sm">เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</p>
        <button @click="showSuccessModal = false" class="bg-blue-600 text-white px-6 py-2 rounded-full w-full font-bold hover:bg-blue-700 transition">
          ตกลง
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2' // ใช้ Alert สวยๆ (ถ้ามี) หรือใช้ alert ธรรมดาก็ได้

// Import Components
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'

// Import Service (สำคัญ!)
import { authService } from '@/services/authService'

// เก็บค่าฟอร์ม
const form = reactive({
  oldPass: '',
  newPass: '',
  confirmPass: ''
})

const isLoading = ref(false)
const showSuccessModal = ref(false)
const isRuleValid = ref(false)
const errorMessage = ref('') // เก็บข้อความ Error จาก Server

// เช็คว่ารหัสตรงกันไหม
const isMatch = computed(() => form.newPass === form.confirmPass)

// ฟังก์ชันรับค่าจาก PasswordRules
const handleRuleCheck = (isValid) => {
  isRuleValid.value = isValid
}

// ปุ่มควรจะกดได้ก็ต่อเมื่อ...
const canSubmit = computed(() => {
    return form.oldPass && 
           form.newPass && 
           form.confirmPass && 
           isMatch.value && 
           isRuleValid.value
})

const handleSave = async () => {
  errorMessage.value = '' // ล้าง Error เก่า

  // Validation เพิ่มเติม
  if (!canSubmit.value) {
      if (!isMatch.value) alert('รหัสผ่านยืนยันไม่ตรงกัน')
      else if (!isRuleValid.value) alert('เงื่อนไขรหัสผ่านไม่ถูกต้อง')
      return
  }

  // เริ่มโหลด
  isLoading.value = true
  
  try {
    //  เรียก API ของจริงตรงนี้
    await authService.changePassword({
        oldPassword: form.oldPass,
        newPassword: form.newPass
    })

    // ถ้าผ่านบรรทัดบนมาได้ แปลว่าสำเร็จ (200 OK)
    showSuccessModal.value = true
    
    // เคลียร์ค่าฟอร์ม
    form.oldPass = ''
    form.newPass = ''
    form.confirmPass = ''

  } catch (error) {
    console.error('Change Password Error:', error)
    
    // ดึงข้อความจาก Backend มาโชว์ (ถ้ามี)
    const serverMsg = error.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ โปรดลองใหม่'
    
    // ถ้าเป็นไปได้ ให้เช็ค Status Code
    if (error.response?.status === 400 || error.response?.status === 401) {
        errorMessage.value = 'รหัสผ่านเดิมไม่ถูกต้อง'
    } else {
        errorMessage.value = serverMsg
    }
    
    // ใช้ Alert แจ้งเตือน
    alert(errorMessage.value) 
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
</style>