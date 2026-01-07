import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue' 

// Views (Auth)
import LoginView from '../views/auth/LoginView.vue'
import LoginTwoFactor from '../views/auth/LoginTwoFactor.vue' 

// Views (Install)
import CreateAdmin from '../views/install/CreateAdmin.vue'
import LoadingStep from '../views/install/LoadingStep.vue'
import InstallSuccess from '../views/install/InstallSuccess.vue'
import TwoFactorIntro from '../views/install/TwoFactorIntro.vue'
import TwoFactorQR from '../views/install/TwoFactorQR.vue'
import TwoFactorVerify from '../views/install/TwoFactorVerify.vue'
import TwoFactorComplete from '../views/install/TwoFactorComplete.vue'

// Views (Admin)
import Dashboard from '../views/admin/Dashboard.vue'
import WebUsers from '../views/admin/WebUsers.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 1. กลุ่ม Auth (Login, Setup)
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '', redirect: '/login' }, 
        { path: 'login', component: LoginView },
        { path: 'login-2fa', component: LoginTwoFactor }, 
        
        // --- 🟢 Install Flow ---
        { path: 'install/create-admin', component: CreateAdmin },
        { path: 'install/loading', component: LoadingStep },
        { path: 'install/success', component: InstallSuccess },
        
        // --- 🔵 2FA Setup Flow (ใช้ชื่อ path แบบมีขีดกลาง - ให้เหมือนกันหมด) ---
        { path: 'install/two-factor-intro', component: TwoFactorIntro },
        { path: 'install/two-factor-qr', component: TwoFactorQR },
        { path: 'install/two-factor-verify', component: TwoFactorVerify },
        { path: 'install/two-factor-complete', component: TwoFactorComplete },
      ]
    },

    // 2. กลุ่ม Admin
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'web-users', component: WebUsers } 
      ]
    }
  ]
})

export default router