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
        
        // Flow ติดตั้งเดิม
        { path: 'install/create-admin', component: CreateAdmin },
        { path: 'install/loading', component: LoadingStep },
        { path: 'install/success', component: InstallSuccess },
        { path: 'setup/2fa-intro', component: TwoFactorIntro },
        { path: 'setup/2fa-qr', component: TwoFactorQR },
        { path: 'setup/2fa-verify', component: TwoFactorVerify },
        { path: 'setup/2fa-complete', component: TwoFactorComplete },
      ]
    },

    //  Admin (Dashboard) -> ใช้ AdminLayout
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: 'dashboard', component: Dashboard }
      ]
    }
  ]
})

export default router