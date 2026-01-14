<template>
  <div class="font-sans">
    <h2 class="text-xl font-bold mb-6 text-black">User Access Management</h2>

    <div class="bg-blue-100 p-6 rounded-lg mb-6 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-4 w-2/3">
        <div class="font-bold text-gray-700">ค้นหาชื่อผู้ใช้</div>
        <div class="relative flex-1">
          <input 
            v-model="searchInput" 
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="พิมพ์ชื่อเพื่อค้นหา..."
            class="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <button 
          @click="handleSearch"
          class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          ค้นหา
        </button>
      </div>

      <button 
        @click="openAddModal" 
        class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2 font-bold shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add User
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-300 text-gray-700 font-bold uppercase">
          <tr>
            <th class="p-4">Name (EN)</th>
            <th class="p-4">Name (TH)</th>
            <th class="p-4">Email</th>
            <th class="p-4">Role</th>
            <th class="p-4 text-center">Branch</th>
            <th class="p-4">Status</th>
            <th class="p-4">Created By</th>
            <th class="p-4">Created At</th>
            <th class="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(user, index) in users" :key="user.id || index" class="hover:bg-gray-50 transition">
            
            <td class="p-4 font-bold text-gray-900">{{ user.name }}</td>
            <td class="p-4 text-gray-600">{{ user.nameTh || '-' }}</td>
            <td class="p-4 text-gray-600">{{ user.email }}</td>
            
            <td class="p-4 whitespace-nowrap">
              <span class="px-2 py-1 rounded bg-gray-100 border border-gray-300 text-xs font-bold">
                {{ user.role }}
              </span>
            </td>
            
            <td class="p-4 text-center">{{ user.branchNumber || '-' }}</td>
            
            <td class="p-4">
              <span 
                :class="user.status === 'Active' ? 'text-green-600' : 'text-red-500'" 
                class="font-bold flex items-center gap-1"
              >
                <span class="w-2 h-2 rounded-full" :class="user.status === 'Active' ? 'bg-green-600' : 'bg-red-500'"></span>
                {{ user.status }}
              </span>
            </td>

            <td class="p-4 text-gray-500">{{ user.createdBy || '-' }}</td>
            
            <td class="p-4 text-gray-500">{{ user.createdAt || '-' }}</td>
            
            <td class="p-4 text-center flex justify-center gap-3">
              <button 
                @click="openEditModal(user)" 
                :disabled="user.roleId === 2 || user.status === 'Suspended'"
                :class="(user.roleId === 2 || user.status === 'Suspended') ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'"
                title="แก้ไขข้อมูล"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              
              <button 
                @click="confirmSuspend(user)" 
                :disabled="user.roleId === 2"
                :class="user.roleId === 2 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-red-500'"
                title="ระงับบัญชี"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="users.length === 0" class="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.25h3m-6 0h6m-12 0h6m-6 0v6.75m0-6.75A2.25 2.25 0 0013.5 15h3a2.25 2.25 0 002.25-2.25V10.75m-15.75 0V7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v3.25" />
        </svg>
        <span>ไม่พบข้อมูลผู้ใช้งาน</span>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-blue-50 p-1 rounded-xl shadow-2xl w-full max-w-lg border-4 border-blue-400 max-h-[90vh] overflow-y-auto">
        <div class="bg-white rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
             <h3 class="font-bold text-lg">{{ isEditMode ? 'Edit User' : 'Add New User' }}</h3>
             <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-1">First Name (EN)</label>
                <input v-model="form.firstName" type="text" class="w-full border p-2 rounded bg-gray-50" placeholder="Somchai" required />
              </div>
              <div>
                <label class="block text-sm font-bold mb-1">Last Name (EN)</label>
                <input v-model="form.lastName" type="text" class="w-full border p-2 rounded bg-gray-50" placeholder="Jaidee" required />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-1">ชื่อ (ไทย)</label>
                <input v-model="form.firstNameTh" type="text" class="w-full border p-2 rounded bg-gray-50" placeholder="สมชาย" required />
              </div>
              <div>
                <label class="block text-sm font-bold mb-1">นามสกุล (ไทย)</label>
                <input v-model="form.lastNameTh" type="text" class="w-full border p-2 rounded bg-gray-50" placeholder="ใจดี" required />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-bold mb-1">Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                :class="isEditMode ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50'"
                class="w-full border p-2 rounded" 
                required 
                :disabled="isEditMode"
              />
            </div>

            <div v-if="!isEditMode">
               <PasswordInput 
                v-model="form.password" 
                label="Password" 
                placeholder="******" 
                @input="formError = ''" 
              />
              <div class="mt-2 mb-4">
                 <PasswordRules 
                    :password="form.password" 
                    @check-valid="(isValid) => isPasswordValid = isValid"
                 />
              </div>
              <PasswordInput 
                v-model="form.confirmPassword" 
                label="Confirm Password" 
                placeholder="ยืนยันรหัสผ่านอีกครั้ง" 
                @input="formError = ''"
              />
            </div>

            <div>
              <label class="block text-sm font-bold mb-1">Role</label>
              <select v-model="form.roleId" class="w-full border p-2 rounded bg-gray-50 border-black" required>
                <option value="" disabled>เลือก role</option>
                <option v-for="role in displayedRoleOptions" :key="role.value" :value="role.value">
                  {{ role.label }}
                </option>
              </select>
            </div>

            <div v-if="isBranchManagerSelected" class="animate-fade-in-down">
              <label class="block text-sm font-bold mb-1 text-blue-600">เลขสาขา (Branch Number)</label>
              <input 
                v-model="form.branchNumber" 
                @input="handleNumberInput"
                type="text" 
                class="w-full border p-2 rounded bg-blue-50 border-blue-300" 
                placeholder="เช่น 102 (ตัวเลขเท่านั้น)" 
                required
              />
            </div>

            <div v-if="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {{ formError }}
            </div>

            <div class="flex gap-4 mt-6 pt-2">
              <button type="button" @click="closeModal" class="flex-1 bg-red-500 text-white font-bold py-2 rounded-full hover:bg-red-600">
                Cancel
              </button>
              <button type="submit" class="flex-1 bg-green-500 text-white font-bold py-2 rounded-full hover:bg-green-600">
                {{ isEditMode ? 'Save Changes' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div v-if="showSuccessAlert" class="fixed inset-0 flex items-center justify-center z-[60]">
      <div class="bg-blue-200 bg-opacity-90 p-10 rounded-xl shadow-2xl text-center border-4 border-blue-300 animate-bounce-in">
        <div class="w-24 h-24 bg-transparent border-4 border-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-16 h-16 text-green-600">
             <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
           </svg>
        </div>
        <h2 class="text-2xl font-bold text-green-800 tracking-wide">{{ successMessage }}</h2>
      </div>
    </div>
    
    <div v-if="isSuspendModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]">
      <div class="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
        <div class="bg-gray-700 text-white p-3 flex justify-between items-center">
            <h3 class="font-bold text-lg ml-2">ยืนยันทำรายการ</h3>
            <button @click="closeSuspendModal" class="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        <div class="p-6 text-center">
             <div class="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <h4 class="text-red-500 font-bold text-xl mb-2">ต้องการระงับบัญชี</h4>
             <p class="text-gray-800 text-lg font-bold">{{ userToSuspend?.name }}</p>
             <p class="text-gray-600 mb-6">Role : {{ userToSuspend?.role }}</p>
             <p class="font-bold text-gray-800 mb-6">ระงับบัญชีผู้ใช้ ใช่หรือไม่</p>
             <div class="flex justify-center gap-4">
                 <button @click="closeSuspendModal" class="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 font-bold">ยกเลิก</button>
                 <button @click="handleSuspendConfirm" class="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 font-bold">ยืนยัน</button>
             </div>
        </div>
      </div>
    </div>
    
    <div v-if="showSuspendSuccess" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[80]">
      <div class="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
         <div class="bg-gray-700 text-white p-3 flex justify-between items-center">
            <h3 class="font-bold text-lg ml-2">ยืนยันทำรายการ</h3>
            <button @click="showSuspendSuccess = false" class="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        <div class="p-8 text-center">
            <p class="text-gray-800 text-lg font-bold mb-1">{{ userToSuspend?.name }}</p>
            <p class="text-gray-600 mb-4">Role : {{ userToSuspend?.role }}</p>
            <h4 class="text-black font-bold text-lg mb-4">ได้ระงับบัญชีผู้ใช้แล้ว</h4>
            <div class="flex justify-center">
                <div class="rounded-full border-4 border-green-600 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'
import { 
  getWebUsers, 
  searchWebUsers, 
  createWebUser, 
  updateWebUser, 
  deleteWebUser 
} from '@/services/adminService'

// Role Master Data (เก็บไว้ใช้อ้างอิงชื่อ)
const masterRoleOptions = [
  { label: 'Admin', value: 2 },  
  { label: 'Call Center', value: 4 }, 
  { label: 'Branch Manager', value: 3 } 
]

const users = ref([])
const searchInput = ref('')
const isModalOpen = ref(false)
const isEditMode = ref(false)
const editingUserId = ref(null)
const showSuccessAlert = ref(false)
const successMessage = ref('')
const isSuspendModalOpen = ref(false)
const userToSuspend = ref(null)
const showSuspendSuccess = ref(false)
const formError = ref('') 
const isPasswordValid = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  firstNameTh: '',
  lastNameTh: '',
  email: '',
  password: '',
  confirmPassword: '', 
  roleId: '',       
  branchNumber: ''
})

// Logic: Role Options ที่จะแสดงใน Dropdown (ถ้าแก้ไข จะไม่ให้เลือก Admin)
const displayedRoleOptions = computed(() => {
  if (isEditMode.value) {
    return masterRoleOptions.filter(role => role.value !== 2)
  }
  return masterRoleOptions
})

const getRoleName = (id) => {
  const found = masterRoleOptions.find(r => r.value === id)
  return found ? found.label : 'Unknown'
}

const isBranchManagerSelected = computed(() => {
  return form.value.roleId === 3 
})

const fetchUsers = async () => {
  try {
    const response = await getWebUsers()
    mapUsersData(response.data)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const handleSearch = async () => {
  if (!searchInput.value) {
    fetchUsers()
    return
  }
  try {
    const response = await searchWebUsers(searchInput.value)
    mapUsersData(response.data)
  } catch (error) {
    console.error('Search error:', error)
  }
}

const mapUsersData = (data) => {
  users.value = data.map(u => {
    
    // จัดการชื่ออังกฤษ
    const fullName = u.fullName || ''
    const nameParts = fullName.trim().split(' ')
    const fName = nameParts[0] || ''
    const lName = nameParts.slice(1).join(' ') || ''
    
    // จัดการ Status
    const isUserActive = u.status === 'ACTIVE'

    return {
      id: u.userId, 
      
      // ข้อมูลสำหรับ Form Edit
      firstName: fName,
      lastName: lName,
      firstNameTh: u.firstNameTh || '',
      lastNameTh: u.lastNameTh || '',
      
      // ข้อมูลสำหรับแสดงผล
      name: fullName, 
      nameTh: `${u.firstNameTh || ''} ${u.lastNameTh || ''}`.trim(),
      
      email: u.email,
      role: getRoleName(u.roleId),
      roleId: u.roleId, // เก็บ ID ไว้เช็คสิทธิ์ (Admin=2)
      branchNumber: u.branchCode || '-',
      
      status: isUserActive ? 'Active' : 'Suspended',
      
      lastLogin: u.lastLogin || '-',
      createdBy: u.createdBy || '-',
      createdAt: u.createdAt || '-'
    }
  })
}

const handleNumberInput = (e) => {
  form.value.branchNumber = e.target.value.replace(/\D/g, '')
}

const openAddModal = () => {
  isEditMode.value = false
  formError.value = ''
  isPasswordValid.value = false
  form.value = { 
    firstName: '', lastName: '', 
    firstNameTh: '', lastNameTh: '',
    email: '', password: '', confirmPassword: '', 
    roleId: '', branchNumber: '' 
  }
  isModalOpen.value = true
}

const openEditModal = (user) => {
  isEditMode.value = true
  editingUserId.value = user.id
  formError.value = ''
  
  form.value = { 
    firstName: user.firstName, 
    lastName: user.lastName,
    firstNameTh: user.firstNameTh || '',
    lastNameTh: user.lastNameTh || '',
    email: user.email, 
    password: '', 
    confirmPassword: '',
    roleId: user.roleId, 
    branchNumber: user.branchNumber === '-' ? '' : user.branchNumber
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  formError.value = '' 
  
  if (!isEditMode.value) {
    if (form.value.password !== form.value.confirmPassword) {
      formError.value = 'รหัสผ่านยืนยันไม่ตรงกัน'
      return 
    }
    if (!isPasswordValid.value) {
      formError.value = 'รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย'
      return 
    }
  }

  const payload = {
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    firstNameTh: form.value.firstNameTh,
    lastNameTh: form.value.lastNameTh,
    roleId: form.value.roleId,
    branchCode: isBranchManagerSelected.value ? form.value.branchNumber : ""
  }

  try {
    if (isEditMode.value) {
      await updateWebUser(editingUserId.value, payload)
      successMessage.value = 'แก้ไขข้อมูลสำเร็จ'
    } else {
      await createWebUser({ ...payload, password: form.value.password })
      successMessage.value = 'สร้าง User สำเร็จ'
    }

    closeModal()
    showSuccessAlert.value = true
    fetchUsers() 
    setTimeout(() => { showSuccessAlert.value = false }, 3000)

  } catch (error) {
    console.error('Submit Error:', error)
    formError.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  }
}

const confirmSuspend = (user) => {
  userToSuspend.value = user
  isSuspendModalOpen.value = true
}

const closeSuspendModal = () => {
  isSuspendModalOpen.value = false
  userToSuspend.value = null
}

const handleSuspendConfirm = async () => {
  if (!userToSuspend.value) return

  try {
    await deleteWebUser(userToSuspend.value.id)
    closeSuspendModal()
    showSuspendSuccess.value = true
    fetchUsers()
    setTimeout(() => { showSuspendSuccess.value = false }, 3000)
  } catch (error) {
    console.error('Suspend Error:', error)
    alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'Error'))
    closeSuspendModal()
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>