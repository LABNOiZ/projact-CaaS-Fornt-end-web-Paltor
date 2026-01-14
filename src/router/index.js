import { createRouter, createWebHistory } from 'vue-router'

// 1. Import Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue' 
import CallCenterLayout from '@/layouts/CallCenterLayout.vue' 

// 2. Import Views (Auth & Install)
import LoginView from '@/views/auth/LoginView.vue'
import LoginTwoFactor from '@/views/auth/LoginTwoFactor.vue' 
import CreateAdmin from '@/views/install/CreateAdmin.vue'
import LoadingStep from '@/views/install/LoadingStep.vue'
import InstallSuccess from '@/views/install/InstallSuccess.vue'
import TwoFactorIntro from '@/views/install/TwoFactorIntro.vue'
import TwoFactorQR from '@/views/install/TwoFactorQR.vue'
import TwoFactorVerify from '@/views/install/TwoFactorVerify.vue'
import TwoFactorComplete from '@/views/install/TwoFactorComplete.vue'

// 3. Import Views (Admin Dashboard & History)
import Dashboard from '@/views/admin/Dashboard.vue'
import WebUsers from '@/views/admin/WebUsers.vue' 
import AdminHistory from '@/views/admin/AdminHistory.vue'
import SettingsProfile from '@/views/admin/settings/SettingsProfile.vue'
import SettingsPassword from '@/views/admin/settings/SettingsPassword.vue'
import SettingsTwoFactor from '@/views/admin/settings/SettingsTwoFactor.vue'

// 4. Import Views (Call Center)
import SearchCustomer from '@/views/callcenter/SearchCustomer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [

    // Auth & Installation
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '', redirect: '/call-center/search-customer' }, 
        { path: 'login', name: 'Login', component: LoginView },
        { path: 'login-2fa', name: 'LoginTwoFactor', component: LoginTwoFactor }, 
        
        { path: 'install/create-admin', name: 'CreateAdmin', component: CreateAdmin },
        { path: 'install/loading', name: 'LoadingStep', component: LoadingStep },
        { path: 'install/success', name: 'InstallSuccess', component: InstallSuccess },
        { path: 'install/two-factor-intro', name: 'TwoFactorIntro', component: TwoFactorIntro },
        { path: 'install/two-factor-qr', name: 'TwoFactorQR', component: TwoFactorQR },
        { path: 'install/two-factor-verify', name: 'TwoFactorVerify', component: TwoFactorVerify },
        { path: 'install/two-factor-complete', name: 'TwoFactorComplete', component: TwoFactorComplete },
      ]
    },

    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
        { path: 'web-users', name: 'WebUsers', component: WebUsers },
        { path: 'admin-history', name: 'AdminHistory', component: AdminHistory },
        { path: 'settings/profile', name: 'SettingsProfile', component: SettingsProfile },
        { path: 'settings/password', name: 'SettingsPassword', component: SettingsPassword },
        { path: 'settings/2fa', name: 'SettingsTwoFactor', component: SettingsTwoFactor },
      ]
    },

    {
      path: '/call-center',
      component: CallCenterLayout,
      meta: { requiresAuth: true, role: 'Call Center' },
      redirect: '/call-center/search',
      children: [
        { 
          path: 'search-customer', name: 'CallCenterSearch', component: SearchCustomer
        },
      ]
    }
  ]
})

export default router