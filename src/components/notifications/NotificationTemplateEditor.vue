<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
    <!-- Header -->
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
    <div v-if="generalError" class="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
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

    <form @submit.prevent="handleSubmit">
      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <!-- Left Column - Form Fields -->
        <div class="p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white/50 border-r border-slate-200">
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

        <!-- Right Column - Template Body/Content -->
        <div class="p-6 bg-gradient-to-b from-white/50 to-slate-50/50">
          <div class="h-full flex flex-col">
            <!-- Content Header -->
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <span v-if="form.type === emailType">📧 Email Body</span>
                <span v-else-if="form.type === smsType">📱 SMS Message</span>
                <span v-else-if="form.type === whatsappType">💬 WhatsApp Message</span>
                <span v-else>📝 Template Content</span>
                <span v-if="form.type" class="text-red-500">*</span>
              </h4>
              <p class="text-sm text-slate-600 mt-1">
                <span v-if="form.type === emailType">Create your email template content below. You can use variables like \{\{name\}\}, \{\{email\}\}, etc.</span>
                <span v-else-if="form.type === smsType">Enter your SMS message content (max 160 characters).</span>
                <span v-else-if="form.type === whatsappType">Create your WhatsApp message template.</span>
                <span v-else>Select a template type to start editing content.</span>
              </p>
            </div>

            <!-- Content Editor -->
            <div class="flex-1 flex flex-col">
              <!-- Email Body -->
              <div v-if="form.type === 'email'" class="flex-1">
                <MonacoEditor
                  v-model="form.body"
                  language="html"
                  theme="vs"
                  height="400px"
                  :readonly="mode === 'view'"
                  :options="monacoOptions"
                />
                <p v-if="errors.body" class="text-sm text-red-500 mt-2 flex items-center space-x-1">
                  <ExclamationTriangleIcon class="h-4 w-4" />
                  <span>{{ errors.body }}</span>
                </p>
              </div>

              <!-- SMS Message -->
              <div v-else-if="form.type === 'sms'" class="flex-1">
                <textarea
                  id="message"
                  v-model="form.message"
                  :required="form.type === 'sms'"
                  :disabled="mode === 'view'"
                  class="w-full h-full min-h-[200px] px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 resize-none"
                  placeholder="Enter SMS message content"
                  maxlength="160"
                ></textarea>
                <div class="flex justify-between items-center mt-2">
                  <p v-if="errors.message" class="text-sm text-red-500 flex items-center space-x-1">
                    <ExclamationTriangleIcon class="h-4 w-4" />
                    <span>{{ errors.message }}</span>
                  </p>
                  <p class="text-sm text-slate-500">
                    Character count: {{ form.message?.length || 0 }}/160
                  </p>
                </div>
              </div>

              <!-- WhatsApp Message -->
              <div v-else-if="form.type === 'whatsapp'" class="flex-1">
                <textarea
                  id="whatsapp_message"
                  v-model="form.message"
                  :required="form.type === 'whatsapp'"
                  :disabled="mode === 'view'"
                  class="w-full h-full min-h-[300px] px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 resize-none"
                  placeholder="Enter WhatsApp message content"
                ></textarea>
                <p v-if="errors.message" class="text-sm text-red-500 mt-2 flex items-center space-x-1">
                  <ExclamationTriangleIcon class="h-4 w-4" />
                  <span>{{ errors.message }}</span>
                </p>
              </div>

              <!-- No Type Selected -->
              <div v-else class="flex-1 flex items-center justify-center">
                <div class="text-center text-slate-400">
                  <DocumentTextIcon class="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p class="text-lg font-medium">Select a template type</p>
                  <p class="text-sm">Choose email, SMS, or WhatsApp to start editing content</p>
                </div>
              </div>
            </div>

            <!-- Variables Helper -->
            <div v-if="form.type" class="mt-4 p-4 bg-blue-50/70 backdrop-blur-sm border border-blue-200 rounded-xl">
              <h5 class="text-sm font-semibold text-blue-800 mb-2">💡 Available Variables</h5>
              <div class="flex flex-wrap gap-2">
                <code class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">\{\{name\}\}</code>
                <code class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">\{\{email\}\}</code>
                <code class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">\{\{phone\}\}</code>
                <code class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">\{\{company\}\}</code>
              </div>
            </div>
          </div>
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { XMarkIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { NotificationTemplate, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/notifications'
import { NotificationTemplateService } from '@/services/notificationService'
import MonacoEditor from '@/components/common/MonacoEditor.vue'

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
const generalError = ref('')
const emailType=ref('email')
const smsType=ref('sms')
const whatsappType=ref('whatsapp')

// Form data
const form = ref({
  name: '',
  type: '' as 'email' | 'sms' | 'whatsapp' | '',
  description: '',
  subject: '',
  sender_email: '',
  body: '',
  message: '',
  status: 'active' as 'active' | 'inactive'
})

// Form errors
const errors = ref<Record<string, string>>({})

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
const resetForm = () => {
  form.value = {
    name: '',
    type: '',
    description: '',
    subject: '',
    sender_email: '',
    body: '',
    message: '',
    status: 'active'
  }
  errors.value = {}
  generalError.value = ''
}

const populateForm = (template: NotificationTemplate) => {
  // Extract content based on template type
  const getBodyAndMessage = (content: string, type: string) => {
    if (type === 'email') {
      return { body: content, message: '' }
    } else if (type === 'sms' || type === 'whatsapp') {
      return { body: '', message: content }
    }
    return { body: '', message: '' }
  }
  
  const { body, message } = getBodyAndMessage(template.content || '', template.type)
  
  form.value = {
    name: template.name || '',
    type: template.type || '',
    description: template.description || '',
    subject: '', // TODO: Extract from content if needed
    sender_email: '', // TODO: Extract from content if needed
    body,
    message,
    status: template.status || 'active'
  }
}

// Monaco Editor options
const monacoOptions = computed(() => ({
  wordWrap: 'on',
  lineNumbers: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  placeholder: 'Enter email content. You can use variables like {{name}}, {{email}}, etc.',
  suggest: {
    showKeywords: true,
    showSnippets: true
  }
}))

// Form validation
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Template name is required'
  }
  
  if (!form.value.type) {
    errors.value.type = 'Template type is required'
  }
  
  if (form.value.type === 'email') {
    if (!form.value.subject.trim()) {
      errors.value.subject = 'Email subject is required'
    }
    if (!form.value.body.trim()) {
      errors.value.body = 'Email body is required'
    }
  }
  
  if ((form.value.type === 'sms' || form.value.type === 'whatsapp') && !form.value.message.trim()) {
    errors.value.message = 'Message content is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  generalError.value = ''
  
  try {
    // Determine content based on template type
    const getContent = () => {
      if (form.value.type === 'email') {
        return form.value.body
      } else if (form.value.type === 'sms' || form.value.type === 'whatsapp') {
        return form.value.message
      }
      return ''
    }
    
    if (props.mode === 'create') {
      const createData: CreateTemplateRequest = {
        owner_id: 'current-user', // TODO: Get from auth store
        name: form.value.name,
        type: form.value.type as 'email' | 'sms' | 'whatsapp',
        content: getContent(),
        description: form.value.description,
        subject: form.value.subject,
        sender_email: form.value.sender_email,
        body: form.value.body,
        message: form.value.message
      }
      await NotificationTemplateService.createTemplate(createData)
    } else if (props.mode === 'edit' && props.template) {
      const updateData: UpdateTemplateRequest = {
        owner_id: props.template.owner_id,
        name: form.value.name,
        type: form.value.type as 'email' | 'sms' | 'whatsapp',
        content: getContent(),
        description: form.value.description,
        subject: form.value.subject,
        sender_email: form.value.sender_email,
        body: form.value.body,
        message: form.value.message,
        status: form.value.status
      }
      await NotificationTemplateService.updateTemplate(props.template.id, updateData)
    }
    
    emit('saved')
    handleClose()
  } catch (error: any) {
    console.error('Error saving template:', error)
    generalError.value = error.response?.data?.message || 'An error occurred while saving the template'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('close')
}

// Watchers
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    populateForm(newTemplate)
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.mode, () => {
  errors.value = {}
  generalError.value = ''
})

// Lifecycle
onMounted(() => {
  if (props.template) {
    populateForm(props.template)
  }
})
</script>