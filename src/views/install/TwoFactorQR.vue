<template>
  <div class="bg-gray-100 border border-gray-400 p-8 rounded-lg w-full max-w-lg text-center">
    <p class="text-left mb-4 text-sm">
        1. Install one of the following applications on your mobile: <span class="text-blue-500">Google Authenticator</span>
    </p>
    <p class="text-left mb-6 text-sm">
        2. Open the application and scan the barcode:
    </p>

    <div class="border-4 border-blue-400 p-2 inline-block mb-6 bg-white">
        <div class="w-40 h-40 bg-gray-800"></div> 
    </div>

    <div>
        <button @click="$router.push('/setup/2fa-verify')" class="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700">
            ถัดไป
        </button>
    </div>
  </div>
</template>