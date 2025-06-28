<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  KeyIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'

// Types
interface StatCard {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: any
  color: string
  description?: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}



interface ApiStats {
  merchants: {
    total: number
    active: number
    pending: number
    growth: number
  }
  products: {
    total: number
    published: number
    draft: number
    growth: number
  }
  tokens: {
    total: number
    active: number
    expired: number
    growth: number
  }
  marketScale: {
    totalValue: string
    monthlyGrowth: number
    marketShare: string
    scalabilityIndex: number
  }
}

// Reactive state
const isLoading = ref(true)
const stats = ref<StatCard[]>([])
const salesData = ref<ChartData | null>(null)
const recentOrders = ref<any[]>([])

const apiStats = ref<ApiStats>({} as ApiStats)



// Mock API data generation functions
const generateMockApiStats = (): ApiStats => {
  return {
    merchants: {
      total: 1247,
      active: 1089,
      pending: 158,
      growth: 15.3
    },
    products: {
      total: 45672,
      published: 42341,
      draft: 3331,
      growth: 8.7
    },
    tokens: {
      total: 892456,
      active: 834521,
      expired: 57935,
      growth: 23.1
    },
    marketScale: {
      totalValue: '$2.4M',
      monthlyGrowth: 12.8,
      marketShare: '34.2%',
      scalabilityIndex: 8.7
    }
  }
}

const generateMockStats = (): StatCard[] => {
  const apiData = apiStats.value
  return [
    {
      id: 'merchants',
      title: 'إجمالي التجار',
      value: apiData.merchants?.total || 1247,
      change: apiData.merchants?.growth || 15.3,
      changeType: 'increase',
      icon: BuildingStorefrontIcon,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      description: `${apiData.merchants?.active || 1089} تاجر نشط`
    },
    {
      id: 'products',
      title: 'إجمالي المنتجات',
      value: apiData.products?.total || 45672,
      change: apiData.products?.growth || 8.7,
      changeType: 'increase',
      icon: CubeIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      description: `${apiData.products?.published || 42341} منتج منشور`
    },
    {
      id: 'tokens',
      title: 'الرموز النشطة',
      value: apiData.tokens?.total || 892456,
      change: apiData.tokens?.growth || 23.1,
      changeType: 'increase',
      icon: KeyIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: `${apiData.tokens?.active || 834521} رمز نشط حالياً`
    },
    {
      id: 'marketScale',
      title: 'حجم السوق',
      value: apiData.marketScale?.totalValue || '$2.4M',
      change: apiData.marketScale?.monthlyGrowth || 12.8,
      changeType: 'increase',
      icon: ScaleIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      description: `${apiData.marketScale?.marketShare || '34.2%'} حصة السوق`
    }
  ]
}

const generateMockSalesData = (): ChartData => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Growth',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)'
      }
    ]
  }
}

const generateMockOrders = () => {
  return [
    {
      id: 'ORD-001',
      customer: 'Merchant Alpha',
      amount: '$1,234',
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: 'ORD-002',
      customer: 'Merchant Beta',
      amount: '$856',
      status: 'pending',
      date: '4 hours ago'
    },
    {
      id: 'ORD-003',
      customer: 'Merchant Gamma',
      amount: '$2,100',
      status: 'completed',
      date: '6 hours ago'
    },
    {
      id: 'ORD-004',
      customer: 'Merchant Delta',
      amount: '$675',
      status: 'processing',
      date: '8 hours ago'
    }
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// API simulation functions
const fetchApiStats = async (): Promise<ApiStats> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // In a real application, this would be an actual API call
  // const response = await fetch('/api/v1/dashboard/stats')
  // return await response.json()
  
  return generateMockApiStats()
}

// Lifecycle hooks
onMounted(async () => {
  try {
    // Simulate API loading
    isLoading.value = true
    
    // Fetch API statistics
    apiStats.value = await fetchApiStats()
    
    // Generate dashboard data based on API stats
    stats.value = generateMockStats()
    salesData.value = generateMockSalesData()
    recentOrders.value = generateMockOrders()
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})


</script>

<template>
  <DashboardLayout>
    <template #page-title>Dashboard</template>
    
    <div>
        <!-- Welcome message -->
        <div class="mb-8">
          <p class="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-6">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="stat in stats"
              :key="stat.id"
              class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-400 mb-1">{{ stat.title }}</p>
                  <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
                  <p v-if="stat.description" class="text-xs text-slate-500 mt-1">{{ stat.description }}</p>
                </div>
                <div :class="[stat.color, 'p-3 rounded-xl shadow-lg']">
                  <component :is="stat.icon" class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <component
                  :is="stat.changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon"
                  :class="[
                    stat.changeType === 'increase' ? 'text-teal-400' : 'text-red-400',
                    'h-4 w-4 mr-1'
                  ]"
                />
                <span
                  :class="[
                    stat.changeType === 'increase' ? 'text-teal-400' : 'text-red-400',
                    'text-sm font-medium'
                  ]"
                >
                  {{ Math.abs(stat.change) }}%
                </span>
                <span class="text-slate-500 text-sm ml-1">من الشهر الماضي</span>
              </div>
            </div>
          </div>

          <!-- API Statistics Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">API Statistics Overview</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Merchants Stats -->
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BuildingStorefrontIcon class="w-8 h-8 text-blue-600" />
                </div>
                <h4 class="text-sm font-medium text-gray-600">Merchants</h4>
                <p class="text-2xl font-bold text-gray-900">{{ apiStats.merchants?.total || 0 }}</p>
                <p class="text-xs text-green-600">{{ apiStats.merchants?.active || 0 }} active</p>
              </div>
              
              <!-- Products Stats -->
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CubeIcon class="w-8 h-8 text-green-600" />
                </div>
                <h4 class="text-sm font-medium text-gray-600">Products</h4>
                <p class="text-2xl font-bold text-gray-900">{{ apiStats.products?.total || 0 }}</p>
                <p class="text-xs text-green-600">{{ apiStats.products?.published || 0 }} published</p>
              </div>
              
              <!-- Tokens Stats -->
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <KeyIcon class="w-8 h-8 text-purple-600" />
                </div>
                <h4 class="text-sm font-medium text-gray-600">Tokens</h4>
                <p class="text-2xl font-bold text-gray-900">{{ apiStats.tokens?.total || 0 }}</p>
                <p class="text-xs text-green-600">{{ apiStats.tokens?.active || 0 }} active</p>
              </div>
              
              <!-- Market Scale Stats -->
              <div class="text-center">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ScaleIcon class="w-8 h-8 text-orange-600" />
                </div>
                <h4 class="text-sm font-medium text-gray-600">Market Scale</h4>
                <p class="text-2xl font-bold text-gray-900">{{ apiStats.marketScale?.totalValue || '$0' }}</p>
                <p class="text-xs text-green-600">{{ apiStats.marketScale?.marketShare || '0%' }} share</p>
              </div>
            </div>
          </div>

          <!-- Charts and Tables Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Growth Chart -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Growth Overview</h3>
                <select class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>This year</option>
                </select>
              </div>
              
              <!-- Simple Chart Placeholder -->
              <div class="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-around p-4">
                <div
                  v-for="(value, index) in salesData?.datasets[0].data || []"
                  :key="index"
                  class="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                  :style="{ height: `${(value / 30000) * 200}px`, width: '40px' }"
                  :title="`${salesData?.labels[index]}: $${value.toLocaleString()}`"
                ></div>
              </div>
              
              <div class="flex justify-around mt-4 text-sm text-gray-600">
                <span v-for="label in salesData?.labels" :key="label">{{ label }}</span>
              </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all
                </button>
              </div>
              
              <div class="space-y-4">
                <div
                  v-for="order in recentOrders"
                  :key="order.id"
                  class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p class="font-medium text-gray-900">{{ order.id }}</p>
                      <span
                        :class="[getStatusColor(order.status), 'px-2 py-1 rounded-full text-xs font-medium']"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ order.customer }}</p>
                    <p class="text-xs text-gray-500">{{ order.date }}</p>
                  </div>
                  <div class="text-right ml-4">
                    <p class="font-semibold text-gray-900">{{ order.amount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Metrics Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Top Merchants -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Merchants</h3>
              <div class="space-y-3">
                <div v-for="i in 5" :key="i" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                      <BuildingStorefrontIcon class="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Merchant {{ i }}</p>
                      <p class="text-xs text-gray-500">{{ 150 - i * 20 }} products</p>
                    </div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">${{ (2999 - i * 300).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- System Health -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">API Uptime</span>
                  <span class="text-sm font-medium text-green-600">99.9%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Response Time</span>
                  <span class="text-sm font-medium text-gray-900">120ms</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Active Connections</span>
                  <span class="text-sm font-medium text-blue-600">{{ apiStats.tokens?.active || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Error Rate</span>
                  <span class="text-sm font-medium text-green-600">0.01%</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 flex items-center">
                  <BuildingStorefrontIcon class="w-4 h-4 mr-2" />
                  Add New Merchant
                </button>
                <button class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 flex items-center">
                  <CubeIcon class="w-4 h-4 mr-2" />
                  Manage Products
                </button>
                <button class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 flex items-center">
                  <KeyIcon class="w-4 h-4 mr-2" />
                  Generate API Token
                </button>
                <button class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 flex items-center">
                  <DocumentTextIcon class="w-4 h-4 mr-2" />
                  Export Reports
                </button>
                <button class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 flex items-center">
                  <ChartBarIcon class="w-4 h-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
  </DashboardLayout>
</template>