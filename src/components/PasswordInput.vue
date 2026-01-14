<template>
  <div class="mb-4">
    <!-- label -->
    <label class="block text-gray-900 text-sm font-bold mb-2">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full p-2 border rounded
               focus:outline-none focus:ring-2 focus:ring-blue-500
               pr-10"
      />

      <button
        type="button"
        @click="togglePassword"
        class="absolute right-3 top-2.5
               text-gray-800 hover:text-blue-600
               focus:outline-none"
      >
        <EyeSlashIcon
          v-if="showPassword"
          class="w-5 h-5"
        />

        <EyeIcon
          v-else
          class="w-5 h-5"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

/* props */
defineProps({
  modelValue: String,
  label: {
    type: String,
    default: 'Password'
  },
  placeholder: {
    type: String,
    default: '********'
  }
})

/* emit สำหรับ v-model */
defineEmits(['update:modelValue'])

/* state */
const showPassword = ref(false)

/* method */
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>
