<template>
  <div class="w-full max-w-sm text-center">
    <div class="mb-8">
      </div>

    <h2 class="text-2xl font-bold mb-8">Welcome</h2>

    <div class="flex justify-between items-end mb-2">
        <label class="text-sm font-bold text-gray-700">One time code</label>
        <span class="text-xs font-bold text-gray-500">Step 2/2</span>
    </div>

    <form @submit.prevent="handleVerify">
      <div class="mb-6">
        <input 
          v-model="otpCode" 
          @input="handleInput"
          type="number"  
          class="w-full rounded-md border border-gray-300 bg-white p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <div v-if="isError" class="text-red-500 font-bold text-sm mb-4 ">
        รหัสผ่านไม่ถูกต้อง
      </div>

      <button 
        type="submit" 
        class="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition shadow-lg"
      >
        Sign In
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const otpCode = ref('')
const isError = ref(false)
const CORRECT_OTP = '123456' 

// 🔥 ฟังก์ชันใหม่: จัดการ input ให้ไม่เกิน 6 ตัว และเคลียร์ error
const handleInput = (e) => {
  isError.value = false // เคลียร์ข้อความสีแดงก่อน

  // เช็คว่าถ้าความยาวเกิน 6 ตัว ให้ตัดทิ้ง
  if (otpCode.value.toString().length > 6) {
    otpCode.value = otpCode.value.toString().slice(0, 6)
  }
}

const handleVerify = () => {
  if (String(otpCode.value) === CORRECT_OTP) {
    router.push('/admin/dashboard')
  } else {
    isError.value = true
  }
}
</script>

<style scoped>
/* ซ่อนปุ่มลูกศรขึ้นลง */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>