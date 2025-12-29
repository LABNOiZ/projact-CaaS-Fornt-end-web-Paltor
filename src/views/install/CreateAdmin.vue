<template>
  <div class="bg-blue-100 p-8 rounded-xl shadow-lg w-full max-w-lg">
    <h2 class="text-center text-xl font-bold mb-6">สร้างบัญชี admin</h2>

    <form @submit.prevent="goToNext" class="space-y-4">
      <div>
        <label class="block text-gray-900 text-sm font-bold mb-2">ชื่อ-นามสกุล</label>
        <input type="text" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
      </div>

      <div>
        <label class="block text-gray-900 text-sm font-bold mb-2">อีเมล</label>
        <input type="email" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
      </div>

      <PasswordInput 
        v-model="password" 
        label="รหัสผ่าน" 
      />

      <PasswordInput 
        v-model="confirmPassword" 
        label="ยืนยันรหัสผ่าน" 
      />

      <PasswordRules 
        :password="password"
        @check-valid="(val) => isRulePassed = val"
      />

      <div class="mt-6">
        <FormAlert :message="currentErrorMessage" />

        <button 
          type="submit" 
          :disabled="!canSubmit"
          :class="canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed opacity-70'"
          class="w-full text-white py-2 rounded-lg transition"
        >
          สร้างบัญชี Admin
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue' 
import { useRouter } from 'vue-router'

// Import Components 
import PasswordInput from '../../components/PasswordInput.vue'
import PasswordRules from '../../components/PasswordRules.vue' 
import FormAlert from '../../components/FormAlert.vue'        

const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const isRulePassed = ref(false) // ตัวแปรเก็บค่าว่าผ่านกฎเขียวๆ ครบทุกข้อไหม

//  Logic คำนวณข้อความแจ้งเตือน (Alert)
const currentErrorMessage = computed(() => {
  // ถ้าช่องยืนยันมีการพิมพ์แล้ว แต่รหัสไม่ตรงกัน
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return "รหัสผ่านไม่ตรงกัน"
  }
  
  // ถ้ารหัสผ่านมีการพิมพ์แล้ว แต่กฎยังไม่เขียวครบทุกข้อ
  if (password.value && !isRulePassed.value) {
    return "เงื่อนไขการตั้งรหัสผ่านไม่ถูกต้อง"
  }

  // ถ้าไม่มีปัญหาอะไร ให้ส่งค่าว่าง (Alert จะไม่แสดง)
  return ""
})

//  Logic เช็คว่าปุ่มควรกดได้หรือยัง
const canSubmit = computed(() => {
  return isRulePassed.value && 
         (password.value === confirmPassword.value) && 
         password.value !== ''
})

const goToNext = () => {
  router.push('/install/loading')
}
</script>