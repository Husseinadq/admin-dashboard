<template>
  <DashboardLayout>
    <template #page-title>Ticket Management</template>

    <div class="bg-gray-50 min-h-screen">
      <!-- Header Section -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div class="mb-6">
          <h1 class="flex items-center gap-3 text-3xl font-bold text-gray-900 mb-2">
            <TicketIcon class="w-8 h-8 text-blue-600" />
            Ticket Management
          </h1>
          <p class="text-gray-600 text-lg">Manage and respond to merchant support tickets</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <TicketIcon class="w-6 h-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">إجمالي التذاكر</p>
                <p class="text-2xl font-bold text-white">{{ ticketStats.total }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircleIcon class="w-6 h-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">محلولة</p>
                <p class="text-2xl font-bold text-white">{{ ticketStats.resolved }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ClockIcon class="w-6 h-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">قيد الانتظار</p>
                <p class="text-2xl font-bold text-white">{{ ticketStats.in_progress }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationCircleIcon class="w-6 h-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">مفتوحة</p>
                <p class="text-2xl font-bold text-white">{{ ticketStats.open }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search Section -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-6">
        <div class="mb-4">
          <div class="relative max-w-md">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Search tickets by subject, merchant, or ticket ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch" />
          </div>
        </div>

        <div class="flex flex-wrap gap-4 items-end">
          <!-- Status Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="applyFilters">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <!-- Priority Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select v-model="filters.priority"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="applyFilters">
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="filters.category"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="applyFilters">
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
            </select>
          </div>

          <!-- Platform Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select v-model="filters.platform"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="applyFilters">
              <option value="">All Platforms</option>
              <option value="salla">Salla</option>
              <option value="zid">Zid</option>
              <option value="wordpress">WordPress</option>
              <option value="shopify">Shopify</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Export Button -->
          <button @click="exportTickets"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isExporting">
            <ArrowDownTrayIcon class="w-4 h-4" />
            {{ isExporting ? 'Exporting...' : 'Export' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading tickets...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12 text-center">
        <ExclamationTriangleIcon class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Failed to load tickets</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadTickets"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <ArrowPathIcon class="w-4 h-4" />
          Retry
        </button>
      </div>

      <!-- Tickets Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                  ID</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets" :key="ticket.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono text-sm text-blue-600">#{{ ticket.id.slice(-8) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-1">
                    <div class="font-medium text-gray-900">{{ ticket.merchant_name }}</div>
                    <div class="text-sm text-gray-500">{{ ticket.merchant_email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    ticket.platform === 'salla' ? 'bg-purple-100 text-purple-800' :
                      ticket.platform === 'zid' ? 'bg-blue-100 text-blue-800' :
                        ticket.platform === 'wordpress' ? 'bg-gray-100 text-gray-800' :
                          ticket.platform === 'shopify' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ formatPlatform(ticket.platform) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-1">
                    <div class="font-medium text-gray-900 max-w-xs truncate">{{ ticket.subject }}</div>
                    <div class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">{{
                      formatCategory(ticket.category) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    ticket.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                  ]">
                    {{ formatPriority(ticket.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- <select
                  :value="ticket.status"
                  @change="updateTicketStatus(ticket.id, ($event.target as HTMLSelectElement).value)"
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded border-0 focus:ring-2 focus:ring-blue-500',
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                > -->
                  <!-- <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- <select
                  :value="ticket.assigned_to || ''"
                  @change="assignTicket(ticket.id, ($event.target as HTMLSelectElement).value)"
                  class="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  <option v-for="admin in admins" :key="admin.id" :value="admin.id">
                    {{ admin.name }} ({{ admin.active_tickets_count }})
                  </option>
                </select> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-900">{{ formatDate(ticket.created_at) }}</div>
                    <div class="text-xs text-gray-500">{{ formatTimeAgo(ticket.created_at) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-2">
                    <button @click="viewTicket(ticket)"
                      class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 text-blue-600 hover:text-blue-700"
                      title="View Details">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button @click="replyToTicket(ticket)"
                      class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 text-green-600 hover:text-green-700"
                      title="Reply">
                      <ChatBubbleLeftRightIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1"
          class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} tickets
          </div>
          <div class="flex items-center gap-2">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1"
              class="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeftIcon class="w-4 h-4" />
              Previous
            </button>

            <div class="flex gap-1">
              <!-- <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50',
                { 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700': page === pagination.current_page }
              ]"
            >
              {{ page }}
            </button> -->
            </div>

            <button @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Ticket Detail Modal -->
      <TicketDetailModal v-if="selectedTicket" :ticket="selectedTicket" :admins="admins" @close="selectedTicket = null"
        @update="handleTicketUpdate" />

      <!-- Reply Modal -->
      <TicketReplyModal v-if="replyTicket" :ticket="replyTicket" @close="replyTicket = null"
        @reply-sent="handleReplySent" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
// import { debounce } from 'lodash-es'
import {
  TicketIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { TicketApiService, type Ticket, type TicketFilters, type PaginatedResponse } from '@/services/api'
import TicketDetailModal from '@/components/TicketDetailModal.vue'
import TicketReplyModal from '@/components/TicketReplyModal.vue'

// Reactive state
const tickets = ref<Ticket[]>([])
const selectedTicket = ref<Ticket | null>(null)
const replyTicket = ref<Ticket | null>(null)
const isLoading = ref(false)
const isExporting = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Pagination
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Filters
const filters = reactive<TicketFilters>({
  status: [],
  priority: [],
  category: [],
  platform: [],
  assigned_to: '',
  search: ''
})

// Statistics
const ticketStats = reactive({
  total: 0,
  open: 0,
  in_progress: 0,
  resolved: 0,
  closed: 0
})

// Admins for assignment
const admins = ref<{
  id: string
  name: string
  email: string
  active_tickets_count: number
}[]>([])

// Computed properties
const visiblePages = computed(() => {
  const current = pagination.current_page
  const total = pagination.last_page
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else if (total > 1) {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
})

// Search handler
const handleSearch = () => {
  filters.search = searchQuery.value
  applyFilters()
}

// Methods
const loadTickets = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response: PaginatedResponse<Ticket> = await TicketApiService.getTickets(
      pagination.current_page,
      pagination.per_page,
      filters
    )

    tickets.value = response.data
    Object.assign(pagination, response.meta)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load tickets'
    console.error('Error loading tickets:', err)
  } finally {
    isLoading.value = false
  }
}

const loadTicketStats = async () => {
  try {
    const stats = await TicketApiService.getTicketStats()
    Object.assign(ticketStats, stats)
  } catch (err) {
    console.error('Error loading ticket stats:', err)
  }
}

const loadAdmins = async () => {
  try {
    admins.value = await TicketApiService.getAdmins()
  } catch (err) {
    console.error('Error loading admins:', err)
  }
}

const applyFilters = () => {
  pagination.current_page = 1
  loadTickets()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.last_page) {
    pagination.current_page = page
    loadTickets()
  }
}

const updateTicketStatus = async (ticketId: string, status: string) => {
  try {
    await TicketApiService.updateTicketStatus(ticketId, status as Ticket['status'])
    await loadTickets()
    await loadTicketStats()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update ticket status')
  }
}

const assignTicket = async (ticketId: string, adminId: string) => {
  try {
    await TicketApiService.assignTicket(ticketId, adminId)
    await loadTickets()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to assign ticket')
  }
}

const viewTicket = (ticket: Ticket) => {
  selectedTicket.value = ticket
}

const replyToTicket = (ticket: Ticket) => {
  replyTicket.value = ticket
}

const handleTicketUpdate = () => {
  loadTickets()
  loadTicketStats()
}

const handleReplySent = () => {
  loadTickets()
  replyTicket.value = null
}

const exportTickets = async () => {
  try {
    isExporting.value = true
    const blob = await TicketApiService.exportTickets('excel', filters)

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to export tickets')
  } finally {
    isExporting.value = false
  }
}

// Formatting helpers
const formatPlatform = (platform: string) => {
  const platforms: Record<string, string> = {
    salla: 'Salla',
    zid: 'Zid',
    wordpress: 'WordPress',
    shopify: 'Shopify',
    other: 'Other'
  }
  return platforms[platform] || platform
}

const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    technical: 'Technical',
    billing: 'Billing',
    general: 'General',
    feature_request: 'Feature Request',
    bug_report: 'Bug Report'
  }
  return categories[category] || category
}

const formatPriority = (priority: string) => {
  const priorities: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }
  return priorities[priority] || priority
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Lifecycle
onMounted(() => {
  loadTickets()
  loadTicketStats()
  loadAdmins()
})

// Watch for filter changes
watch(filters, () => {
  if (filters.search === searchQuery.value) {
    applyFilters()
  }
}, { deep: true })
</script>