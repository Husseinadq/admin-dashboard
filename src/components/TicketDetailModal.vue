<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <h2 class="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <TicketIcon class="w-6 h-6 text-blue-600" />
            Ticket #{{ ticket.id.slice(-8) }}
          </h2>
          <div class="flex gap-2">
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              ticket.status === 'open' ? 'bg-red-100 text-red-800' :
              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            ]">
              {{ formatStatus(ticket.status) }}
            </span>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              ticket.priority === 'low' ? 'bg-gray-100 text-gray-800' :
              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            ]">
              {{ formatPriority(ticket.priority) }}
            </span>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Ticket Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Subject</label>
              <p class="text-sm text-gray-900">{{ ticket.subject }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Category</label>
              <p class="text-sm text-gray-900">{{ formatCategory(ticket.category) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Platform</label>
              <p class="text-sm text-gray-900">{{ formatPlatform(ticket.platform) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Created</label>
              <p class="text-sm text-gray-900">{{ formatDateTime(ticket.created_at) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Last Updated</label>
              <p class="text-sm text-gray-900">{{ formatDateTime(ticket.updated_at) }}</p>
            </div>
            <div class="space-y-1" v-if="ticket.resolved_at">
              <label class="text-sm font-medium text-gray-500">Resolved</label>
              <p class="text-sm text-gray-900">{{ formatDateTime(ticket.resolved_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Merchant Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Merchant Information</h3>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon class="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ ticket.merchant_name }}</h4>
              <p class="text-sm text-gray-600">{{ ticket.merchant_email }}</p>
              <p class="text-xs text-gray-500">ID: {{ ticket.merchant_id }}</p>
            </div>
          </div>
        </div>

        <!-- Assignment Section -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Assigned To</label>
              <p class="text-sm text-gray-900" v-if="ticket.assigned_admin">
                {{ ticket.assigned_admin.name }} ({{ ticket.assigned_admin.email }})
              </p>
              <p class="text-sm text-gray-500" v-else>Unassigned</p>
            </div>
            <div class="flex gap-4">
              <select
                :value="ticket.assigned_to || ''"
                @change="handleAssignment(($event.target as HTMLSelectElement).value)"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                <option v-for="admin in admins" :key="admin.id" :value="admin.id">
                  {{ admin.name }} ({{ admin.active_tickets_count }} active)
                </option>
              </select>
              <select
                :value="ticket.status"
                @change="handleStatusChange(($event.target as HTMLSelectElement).value)"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-700 whitespace-pre-wrap">{{ ticket.description }}</p>
          </div>
        </div>

        <!-- Attachments -->
        <div v-if="ticket.attachments && ticket.attachments.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
          <div class="space-y-2">
            <div v-for="attachment in ticket.attachments" :key="attachment.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0">
                <PaperClipIcon class="w-5 h-5 text-gray-500" />
              </div>
              <div class="flex-1">
                <a :href="attachment.url" target="_blank" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                  {{ attachment.filename }}
                </a>
                <p class="text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
              </div>
              <button @click="downloadAttachment(attachment)" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
                <ArrowDownTrayIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Messages/Conversation -->
        <div v-if="ticket.messages && ticket.messages.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
          <div class="space-y-4">
            <div v-for="message in ticket.messages" :key="message.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    message.sender_type === 'merchant' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  ]">
                    <UserIcon v-if="message.sender_type === 'merchant'" class="w-5 h-5" />
                    <ShieldCheckIcon v-else class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ message.sender_name }}</h4>
                    <p class="text-xs text-gray-500">{{ message.sender_type === 'merchant' ? 'Merchant' : 'Admin' }}</p>
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDateTime(message.created_at) }}
                </div>
              </div>
              <div>
                <p class="text-gray-700 whitespace-pre-wrap">{{ message.message }}</p>
                <div v-if="message.attachments && message.attachments.length > 0" class="mt-3 space-y-2">
                  <div v-for="attachment in message.attachments" :key="attachment.id" class="flex items-center gap-2 text-sm">
                    <PaperClipIcon class="w-4 h-4 text-gray-500" />
                    <a :href="attachment.url" target="_blank" class="text-blue-600 hover:text-blue-700">
                      {{ attachment.filename }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button @click="closeModal" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button @click="openReplyModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <ChatBubbleLeftRightIcon class="w-4 h-4" />
          Reply to Ticket
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import {
  XMarkIcon,
  TicketIcon,
  UserIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { TicketApiService, type Ticket } from '@/services/api'

interface Props {
  ticket: Ticket
  admins: {
    id: string
    name: string
    email: string
    active_tickets_count: number
  }[]
}

interface Emits {
  close: []
  update: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('close')
}

const openReplyModal = () => {
  // This will be handled by the parent component
  emit('close')
  // Parent should open reply modal
}

const handleAssignment = async (adminId: string) => {
  try {
    await TicketApiService.assignTicket(props.ticket.id, adminId)
    emit('update')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to assign ticket')
  }
}

const handleStatusChange = async (status: string) => {
  try {
    await TicketApiService.updateTicketStatus(props.ticket.id, status as Ticket['status'])
    emit('update')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update ticket status')
  }
}

const downloadAttachment = (attachment: any) => {
  window.open(attachment.url, '_blank')
}

// Formatting helpers
const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  }
  return statuses[status] || status
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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>