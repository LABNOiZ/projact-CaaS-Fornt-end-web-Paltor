<template>
  <div class="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
    <CallCenterSidebar />

    <main class="flex-1 overflow-x-hidden overflow-y-auto relative z-0 focus:outline-none">
      <div class="py-8 px-8">
         <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import CallCenterSidebar from '@/components/CallCenter/CallCenterSidebar.vue'
</script>