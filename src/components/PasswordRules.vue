<template>
  <div class="text-xs space-y-1 mt-2 transition-all duration-200">
    <p :class="validation.minLength ? 'text-green-600 font-bold' : 'text-gray-500'">
      <span v-if="validation.minLength">✅</span><span v-else>⚪</span> ตั้งรหัสอย่างน้อย 8 ตัว
    </p>

    <p :class="validation.hasUpper ? 'text-green-600 font-bold' : 'text-gray-500'">
      <span v-if="validation.hasUpper">✅</span><span v-else>⚪</span> มี A-Z อย่างน้อย 1 ตัว (ตัวพิมพ์ใหญ่)
    </p>

    <p :class="validation.hasLower ? 'text-green-600 font-bold' : 'text-gray-500'">
      <span v-if="validation.hasLower">✅</span><span v-else>⚪</span> มี a-z อย่างน้อย 1 ตัว (ตัวพิมพ์เล็ก)
    </p>

    <p :class="validation.hasNumber ? 'text-green-600 font-bold' : 'text-gray-500'">
      <span v-if="validation.hasNumber">✅</span><span v-else>⚪</span> มี 0-9 อย่างน้อย 1 ตัว (ตัวเลข)
    </p>

    <p :class="validation.hasSpecial ? 'text-green-600 font-bold' : 'text-gray-500'">
      <span v-if="validation.hasSpecial">✅</span><span v-else>⚪</span> มีสัญลักษณ์พิเศษอย่างน้อย 1 ตัว (!@#$%)
    </p>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  password: {
    type: String,
    default: ''
  }
})

// ส่งค่ากลับไปบอกว่า "ผ่าน" หรือ "ไม่ผ่าน"
const emit = defineEmits(['check-valid'])

const validation = computed(() => {
  const p = props.password
  return {
    minLength: p.length >= 8,
    hasUpper: /[A-Z]/.test(p),
    hasLower: /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(p)
  }
})

// คำนวณภาพรวมว่าผ่านทุกข้อไหม
const isAllValid = computed(() => {
  return (
    validation.value.minLength &&
    validation.value.hasUpper &&
    validation.value.hasLower &&
    validation.value.hasNumber &&
    validation.value.hasSpecial
  )
})

// คอยดูค่า isAllValid ถ้าเปลี่ยนให้ส่งไปบอกหน้าหลักทันที
watch(isAllValid, (newValue) => {
  emit('check-valid', newValue)
}, { immediate: true }) 
</script>