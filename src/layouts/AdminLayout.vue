<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    
    <AdminSidebar />

    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <router-view /> 
    </main>

  </div>
</template>

<script setup>
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
</script>