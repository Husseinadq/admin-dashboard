<template>
  <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" @click="handleBackdropClick">
    <div class="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200/20 overflow-hidden" @click.stop>
      <form @submit.prevent="handleSubmit">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <DocumentTextIcon class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">{{ modalTitle }}</h3>
                <p class="text-teal-100 text-sm">
                  {{ mode === 'view' ? 'View template details' : mode === 'create' ? 'Create a new notification template' : 'Edit template details' }}
                </p>
              </div>
            </div>
            <button type="button" @click="handleClose" class="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- General Error Display -->
        <div v-if="generalError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-start">
            <svg class="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800">Error</h4>
              <p class="text-sm text-red-700 mt-1">{{ generalError }}</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white/50">
          <!-- Template Name -->
          <div class="space-y-2">
            <label for="name" class="block text-sm font-semibold text-slate-700">Template Name *</label>
            <input
              v-if="mode !== 'view'"
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
              placeholder="Enter template name"
            />
            <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 font-medium">
              {{ form.name }}
            </div>
            <p v-if="errors.name" class="text-sm text-red-500 flex items-center space-x-1">
              <ExclamationTriangleIcon class="h-4 w-4" />
              <span>{{ errors.name }}</span>
            </p>
          </div>

          <!-- Template Type -->
          <div class="space-y-2">
            <label for="type" class="block text-sm font-semibold text-slate-700">Template Type *</label>
            <select
              v-if="mode !== 'view'"
              id="type"
              v-model="form.type"
              required
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-700"
            >
              <option value="" class="text-slate-400">Select template type</option>
              <option value="email">📧 Email</option>
              <option value="sms">📱 SMS</option>
              <option value="whatsapp">💬 WhatsApp</option>
            </select>
            <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center space-x-2">
              <span v-if="form.type === 'email'">📧</span>
              <span v-else-if="form.type === 'sms'">📱</span>
              <span v-else-if="form.type === 'whatsapp'">💬</span>
              <span class="capitalize">{{ form.type }}</span>
            </div>
            <p v-if="errors.type" class="text-sm text-red-500 flex items-center space-x-1">
              <ExclamationTriangleIcon class="h-4 w-4" />
              <span>{{ errors.type }}</span>
            </p>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label for="description" class="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              v-if="mode !== 'view'"
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 resize-none"
              placeholder="Enter template description"
            ></textarea>
            <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 min-h-[80px] flex items-center">
              {{ form.description || 'No description provided' }}
            </div>
            <p v-if="errors.description" class="text-sm text-red-500 flex items-center space-x-1">
              <ExclamationTriangleIcon class="h-4 w-4" />
              <span>{{ errors.description }}</span>
            </p>
          </div>

          <!-- Email-specific fields -->
          <div v-if="form.type === 'email'" class="space-y-6">
            <!-- Email Subject -->
            <div class="space-y-2">
              <label for="subject" class="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <span>📧 Email Subject *</span>
              </label>
              <input
                v-if="mode !== 'view'"
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Enter email subject"
              />
              <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 font-medium">
                {{ form.subject }}
              </div>
              <p v-if="errors.subject" class="text-sm text-red-500 flex items-center space-x-1">
                <ExclamationTriangleIcon class="h-4 w-4" />
                <span>{{ errors.subject }}</span>
              </p>
            </div>

            <!-- Sender Email -->
            <div class="space-y-2">
              <label for="sender_email" class="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <span>👤 Sender Email</span>
                <span class="text-xs text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                v-if="mode !== 'view'"
                id="sender_email"
                v-model="form.sender_email"
                type="email"
                class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Enter sender email (optional)"
              />
              <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900">
                {{ form.sender_email || 'Default sender email will be used' }}
              </div>
              <p v-if="errors.sender_email" class="text-sm text-red-500 flex items-center space-x-1">
                <ExclamationTriangleIcon class="h-4 w-4" />
                <span>{{ errors.sender_email }}</span>
              </p>
            </div>

            <!-- Email Body (Text Only) -->
            <div>
              <label for="body" class="block text-sm font-medium text-gray-700">Email Body *</label>
              <textarea
                id="body"
                v-model="form.body"
                :required="form.type === 'email'"
                rows="12"
                :disabled="mode === 'view'"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter email content. You can use variables like {{name}}, {{email}}, etc."
              ></textarea>
              <p v-if="errors.body" class="text-sm text-red-600 mt-1">{{ errors.body }}</p>
              <p class="text-sm text-gray-500 mt-2">
                You can use variables in double curly braces, e.g., 
                <!-- <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{ name }}</code>, 
                <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{ email }}</code>, 
                <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{ '{{order_number}}' }}</code> -->
              </p>
            </div>
          </div>

          <!-- SMS-specific fields -->
          <div v-if="form.type === 'sms'" class="space-y-6">
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">SMS Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                :required="form.type === 'sms'"
                rows="4"
                :disabled="mode === 'view'"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter SMS message content"
                maxlength="160"
              ></textarea>
              <p v-if="errors.message" class="text-sm text-red-600 mt-1">{{ errors.message }}</p>
              <p class="text-sm text-gray-500 mt-1">
                Character count: {{ form.message?.length || 0 }}/160
              </p>
            </div>
          </div>

          <!-- WhatsApp-specific fields -->
          <div v-if="form.type === 'whatsapp'" class="space-y-6">
            <div>
              <label for="whatsapp_message" class="block text-sm font-medium text-gray-700">WhatsApp Message *</label>
              <textarea
                id="whatsapp_message"
                v-model="form.message"
                :required="form.type === 'whatsapp'"
                rows="6"
                :disabled="mode === 'view'"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter WhatsApp message content"
              ></textarea>
              <p v-if="errors.message" class="text-sm text-red-600 mt-1">{{ errors.message }}</p>
              <p class="text-sm text-gray-500 mt-2">
                You can use variables like
                 <!-- <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{ name }}</code>,  -->
                <!-- <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{ '{{phone}}' }}</code> -->
              </p>
            </div>
          </div>

          <!-- Status -->
          <div v-if="mode !== 'create'" class="space-y-2">
            <label for="status" class="block text-sm font-semibold text-slate-700">Status</label>
            <select
              v-if="mode !== 'view'"
              id="status"
              v-model="form.status"
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-700"
            >
              <option value="active">🟢 Active</option>
              <option value="inactive">🔴 Inactive</option>
            </select>
            <div v-else class="px-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl flex items-center space-x-2">
              <span v-if="form.status === 'active'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🟢 Active
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                🔴 Inactive
              </span>
            </div>
            <p v-if="errors.status" class="text-sm text-red-500 flex items-center space-x-1">
              <ExclamationTriangleIcon class="h-4 w-4" />
              <span>{{ errors.status }}</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm border-t border-slate-200/50 px-6 py-4">
          <div class="flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="handleClose"
              class="inline-flex items-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50/70 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
            >
              {{ mode === 'view' ? '👁️ Close' : '❌ Cancel' }}
            </button>
            <button
              v-if="mode !== 'view'"
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 border border-transparent rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-if="mode === 'create'">✨ Create Template</span>
              <span v-else>💾 Update Template</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { XMarkIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { NotificationTemplate, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/notifications'
import { NotificationTemplateService } from '@/services/notificationService'

// Props
interface Props {
  template?: NotificationTemplate | null
  mode: 'view' | 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  template: null
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Reactive state
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

// Form data
const form = ref({
  name: '',
  type: '' as 'email' | 'sms' | 'whatsapp' | '',
  description: '',
  subject: '',
  body: '',
  message: '',
  sender_email: '',
  status: 'active' as 'active' | 'inactive'
})

// Computed properties
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'view':
      return 'View Template'
    case 'create':
      return 'Create Template'
    case 'edit':
      return 'Edit Template'
    default:
      return 'Template'
  }
})

// Methods
const initializeForm = () => {
  if (props.template && props.mode !== 'create') {
    form.value = {
      name: props.template.name || '',
      type: props.template.type || '',
      description: props.template.description || '',
      subject: '',
      body: props.template.type === 'email' ? props.template.content || '' : '',
      message: props.template.type !== 'email' ? props.template.content || '' : '',
      sender_email: '',
      status: props.template.status || 'active'
    }
  } else {
    // Reset form for create mode
    form.value = {
      name: '',
      type: '',
      description: '',
      subject: '',
      body: '',
      message: '',
      sender_email: '',
      status: 'active'
    }
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  generalError.value = null

  // Required field validation
  if (!form.value.name?.trim()) {
    errors.value.name = 'Template name is required'
  } else if (form.value.name.length > 255) {
    errors.value.name = 'Template name must be less than 255 characters'
  }

  if (!form.value.type) {
    errors.value.type = 'Template type is required'
  }

  if (form.value.description && form.value.description.length > 1000) {
    errors.value.description = 'Description must be less than 1000 characters'
  }

  // Email-specific validation
  if (form.value.type === 'email') {
    if (!form.value.subject?.trim()) {
      errors.value.subject = 'Email subject is required'
    } else if (form.value.subject.length > 255) {
      errors.value.subject = 'Subject must be less than 255 characters'
    }

    if (!form.value.body?.trim()) {
      errors.value.body = 'Email body is required'
    } else if (form.value.body.length > 10000) {
      errors.value.body = 'Email body must be less than 10,000 characters'
    }

    if (form.value.sender_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.sender_email)) {
      errors.value.sender_email = 'Please enter a valid email address'
    }
  }

  // SMS-specific validation
  if (form.value.type === 'sms') {
    if (!form.value.message?.trim()) {
      errors.value.message = 'SMS message is required'
    } else if (form.value.message.length > 160) {
      errors.value.message = 'SMS message must be less than 160 characters'
    }
  }

  // WhatsApp-specific validation
  if (form.value.type === 'whatsapp') {
    if (!form.value.message?.trim()) {
      errors.value.message = 'WhatsApp message is required'
    } else if (form.value.message.length > 4096) {
      errors.value.message = 'WhatsApp message must be less than 4,096 characters'
    }
  }

  // Scroll to first error field
  if (Object.keys(errors.value).length > 0) {
    nextTick(() => {
      const firstErrorField = document.querySelector('.text-red-600')?.closest('.space-y-6, div')?.querySelector('input, textarea, select') as HTMLElement
      if (firstErrorField) {
        firstErrorField.focus()
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  generalError.value = null

  try {
    // Trim form data
    const formData = {
      name: form.value.name.trim(),
      type: form.value.type,
      description: form.value.description?.trim() || '',
      subject: form.value.subject?.trim() || '',
      body: form.value.body?.trim() || '',
      message: form.value.message?.trim() || '',
      sender_email: form.value.sender_email?.trim() || '',
      status: form.value.status
    }

    if (props.mode === 'create') {
      const createData: CreateTemplateRequest = {
        owner_id: 'current_user', // This should come from auth context
        name: formData.name,
        type: formData.type as 'email' | 'sms' | 'whatsapp',
        content: formData.type === 'email' ? formData.body : formData.message
      }
      await NotificationTemplateService.createTemplate(createData)
    } else if (props.mode === 'edit' && props.template) {
      const updateData: UpdateTemplateRequest = {
        owner_id: props.template.owner_id || 'current_user',
        name: formData.name,
        type: formData.type as 'email' | 'sms' | 'whatsapp',
        content: formData.type === 'email' ? formData.body : formData.message
      }
      await NotificationTemplateService.updateTemplate(props.template.id, updateData)
    }

    emit('saved')
  } catch (err: any) {
    console.error('Error saving template:', err)
    
    if (err.response?.status === 400) {
      generalError.value = 'Invalid data provided. Please check your inputs.'
    } else if (err.response?.status === 403) {
      generalError.value = 'You do not have permission to perform this action.'
    } else if (err.response?.status === 409) {
      generalError.value = 'A template with this name already exists.'
    } else if (err.response?.status === 500) {
      generalError.value = 'Server error occurred. Please try again later.'
    } else if (err.code === 'NETWORK_ERROR' || !err.response) {
      generalError.value = 'Network error. Please check your connection and try again.'
    } else {
      generalError.value = err.message || 'An unexpected error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  errors.value = {}
  generalError.value = null
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

// Watchers
watch(() => props.template, initializeForm, { immediate: true })
watch(() => props.mode, initializeForm)

// Cleanup
onUnmounted(() => {
  errors.value = {}
  generalError.value = null
})

// Initialize form on mount
onMounted(() => {
  initializeForm()
})
</script>