<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ChartBarIcon,
  UsersIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  KeyIcon,
  ScaleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TicketIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

interface MenuItem {
  name: string
  icon: any
  href: string
  routeName: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

// Get current user from auth store
const currentUser = computed(() => authStore.user)

// Navigation menu items
const navigation = ref<MenuItem[]>([
  { name: 'Dashboard', icon: HomeIcon, href: '/', routeName: 'dashboard' },
  { name: 'Tickets', icon: TicketIcon, href: '/tickets', routeName: 'tickets' },
  { name: 'Notifications', icon: BellIcon, href: '/notifications', routeName: 'notifications' },
  { name: 'Template Attributes', icon: TagIcon, href: '/template-attributes', routeName: 'template-attributes' },
  // { name: 'Merchants', icon: BuildingStorefrontIcon, href: '/merchants', routeName: 'merchants' },
  // { name: 'Products', icon: CubeIcon, href: '/products', routeName: 'products' },
  // { name: 'Tokens', icon: KeyIcon, href: '/tokens', routeName: 'tokens' },
  // { name: 'Market Scale', icon: ScaleIcon, href: '/market-scale', routeName: 'market-scale' },
  // { name: 'Analytics', icon: ChartBarIcon, href: '/analytics', routeName: 'analytics' },
  // { name: 'Users', icon: UserGroupIcon, href: '/users', routeName: 'users' },
  // { name: 'Reports', icon: DocumentTextIcon, href: '/reports', routeName: 'reports' },
  // { name: 'Settings', icon: Cog6ToothIcon, href: '/settings', routeName: 'settings' },
])

// Sidebar toggle function
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Check if route is active
const isActiveRoute = (routeName: string): boolean => {
  return route.name === routeName
}

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout('admin')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force logout even if API call fails
    authStore.user = null
    authStore.token = null
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-3/4 left-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
    </div>

    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <!-- Brand -->
      <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-teal-500 to-teal-600">
        <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-white">لوحة التحكم</h1>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-8 px-4">
        <ul class="space-y-2">
          <li v-for="item in navigation" :key="item.name">
            <RouterLink
              :to="item.href"
              :class="[
                isActiveRoute(item.routeName)
                  ? 'bg-teal-500/20 text-teal-400 border-r-4 border-teal-400 shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
                'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200'
              ]"
            >
              <component
                :is="item.icon"
                class="mr-3 h-5 w-5"
              />
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      
      <!-- User section -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ currentUser?.name || 'مدير النظام' }}</p>
            <p class="text-xs text-slate-400">{{ currentUser?.email || 'admin@eejaz.com' }}</p>
          </div>
          <button 
            @click="handleLogout"
            class="ml-auto text-slate-400 hover:text-teal-400 transition-colors duration-200"
            title="تسجيل الخروج"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Top navigation -->
      <header class="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-all duration-200"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
            <h1 class="ml-4 text-xl font-semibold text-white">
              <slot name="page-title">لوحة التحكم</slot>
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- User menu -->
            <div class="flex items-center">
              <span class="text-sm text-slate-300 mr-3">{{ currentUser?.name || 'مدير النظام' }}</span>
              <div class="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <button 
                @click="handleLogout"
                class="ml-3 text-slate-400 hover:text-teal-400 transition-colors duration-200"
                title="تسجيل الخروج"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    ></div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>