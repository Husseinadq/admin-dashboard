<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex-1">
          <h2 class="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
            <ChatBubbleLeftRightIcon class="w-6 h-6 text-blue-600" />
            Reply to Ticket #{{ ticket.id.slice(-8) }}
          </h2>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium text-gray-700">{{ ticket.subject }}</span>
            <span class="text-sm text-gray-500">{{ ticket.merchant_name }}</span>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Quick Actions -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div class="flex flex-wrap gap-3">
            <button
              @click="updateStatus('in_progress')"
              :disabled="ticket.status === 'in_progress'"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ClockIcon class="w-4 h-4" />
              Mark In Progress
            </button>
            <button
              @click="updateStatus('resolved')"
              :disabled="ticket.status === 'resolved'"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircleIcon class="w-4 h-4" />
              Mark Resolved
            </button>
            <button
              @click="updateStatus('closed')"
              :disabled="ticket.status === 'closed'"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircleIcon class="w-4 h-4" />
              Close Ticket
            </button>
          </div>
        </div>

        <!-- Reply Form -->
        <form @submit.prevent="sendReply" class="space-y-6">
          <div class="space-y-2">
            <label for="message" class="block text-sm font-medium text-gray-700">Your Reply</label>
            <textarea
              id="message"
              v-model="replyMessage"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Type your reply to the merchant..."
              required
            ></textarea>
          </div>

          <!-- Template Responses -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Quick Templates</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="template in templates"
                :key="template.id"
                type="button"
                @click="useTemplate(template.content)"
                class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {{ template.name }}
              </button>
            </div>
          </div>

          <!-- File Attachments -->
          <div class="border-t border-gray-200 pt-4">
            <label class="block text-sm font-medium text-gray-700">Attachments</label>
            <div class="relative">
              <input
                ref="fileInput"
                type="file"
                multiple
                @change="handleFileSelect"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
              />
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer" @click="triggerFileSelect">
                <PaperClipIcon class="w-8 h-8 text-gray-400" />
                <p class="text-sm text-gray-600 mt-2">Click to attach files or drag and drop</p>
                <p class="text-xs text-gray-500 mt-1">PDF, DOC, images, archives (max 10MB each)</p>
              </div>
            </div>
            
            <!-- Selected Files -->
            <div v-if="selectedFiles.length > 0" class="mt-4">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Selected Files:</h5>
              <div class="space-y-2">
                <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <DocumentIcon class="w-5 h-5 text-gray-500" />
                    <span class="text-sm text-gray-900">{{ file.name }}</span>
                    <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Internal Notes -->
          <div class="border-t border-gray-200 pt-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <input
                  v-model="addInternalNote"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Add Internal Note
              </label>
              <textarea
                v-if="addInternalNote"
                v-model="internalNote"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical mt-2"
                placeholder="Internal note (visible only to admins)..."
              ></textarea>
            </div>
          </div>

          <!-- Auto Actions -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-base font-medium text-gray-900 mb-3">After Sending Reply</h4>
            <div class="space-y-3">
              <label class="flex items-center gap-3 text-sm">
                <input
                  v-model="autoActions.changeStatus"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Change status to:</span>
                <select
                  v-model="autoActions.newStatus"
                  :disabled="!autoActions.changeStatus"
                  class="ml-2 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label class="flex items-center gap-3 text-sm">
                <input
                  v-model="autoActions.assignToMe"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Assign ticket to me</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200">
        <div class="flex-1">
          <p class="text-sm text-gray-600">Reply will be sent to: {{ ticket.merchant_email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="closeModal" type="button" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            @click="sendReply"
            :disabled="!replyMessage.trim() || isSending"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon class="w-4 h-4" />
            {{ isSending ? 'Sending...' : 'Send Reply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits } from 'vue'
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperClipIcon,
  DocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import { TicketApiService, type Ticket } from '@/services/api'

interface Props {
  ticket: Ticket
}

interface Emits {
  close: []
  'reply-sent': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const replyMessage = ref('')
const internalNote = ref('')
const addInternalNote = ref(false)
const selectedFiles = ref<File[]>([])
const isSending = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Auto actions
const autoActions = reactive({
  changeStatus: false,
  newStatus: 'in_progress',
  assignToMe: false
})

// Template responses
const templates = [
  {
    id: 1,
    name: 'Thank you',
    content: 'Thank you for contacting us. We have received your request and will get back to you shortly.'
  },
  {
    id: 2,
    name: 'Under Investigation',
    content: 'We are currently investigating this issue. We will update you as soon as we have more information.'
  },
  {
    id: 3,
    name: 'Need More Info',
    content: 'To better assist you, could you please provide more details about the issue you are experiencing?'
  },
  {
    id: 4,
    name: 'Issue Resolved',
    content: 'The issue has been resolved. Please let us know if you continue to experience any problems.'
  },
  {
    id: 5,
    name: 'Follow Up',
    content: 'We wanted to follow up on your recent ticket. Is there anything else we can help you with?'
  }
]

const closeModal = () => {
  emit('close')
}

const useTemplate = (content: string) => {
  replyMessage.value = content
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    
    // Validate file size (max 10MB each)
    const validFiles = newFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
        return false
      }
      return true
    })
    
    selectedFiles.value.push(...validFiles)
    
    // Reset input
    if (target) {
      target.value = ''
    }
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const updateStatus = async (status: string) => {
  try {
    await TicketApiService.updateTicketStatus(props.ticket.id, status as Ticket['status'])
    // Update the ticket status locally or emit update
    emit('reply-sent')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update ticket status')
  }
}

const sendReply = async () => {
  if (!replyMessage.value.trim()) {
    alert('Please enter a reply message')
    return
  }

  try {
    isSending.value = true
    
    // Send the reply with attachments
    await TicketApiService.addTicketMessage(
      props.ticket.id,
      replyMessage.value,
      selectedFiles.value.length > 0 ? selectedFiles.value : undefined
    )
    
    // Handle auto actions
    if (autoActions.changeStatus) {
      await TicketApiService.updateTicketStatus(props.ticket.id, autoActions.newStatus as Ticket['status'])
    }
    
    if (autoActions.assignToMe) {
      // Get current admin ID from localStorage or context
      const currentAdminId = localStorage.getItem('admin_id') || ''
      if (currentAdminId) {
        await TicketApiService.assignTicket(props.ticket.id, currentAdminId)
      }
    }
    
    // Handle internal note if added
    if (addInternalNote.value && internalNote.value.trim()) {
      // Add internal note logic here
      // TODO: Implement internal note API call
    }
    
    emit('reply-sent')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to send reply')
  } finally {
    isSending.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>