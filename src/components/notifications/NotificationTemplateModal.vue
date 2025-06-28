<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ modalTitle }}
              </h3>
              <button type="button" @click="handleClose"
                class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- General Error -->
            <div v-if="errors.general" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">Error</p>
                  <p class="text-sm text-red-700 mt-1">{{ errors.general }}</p>
                </div>
              </div>
            </div>

            <!-- Form Content -->
            <div class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Template Name *</label>
                  <input id="name" v-model="form.name" type="text" :disabled="mode === 'view'" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter template name" />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700">Template Type *</label>
                  <select id="type" v-model="form.type" :disabled="mode === 'view'" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500">
                    <option value="">Select type</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" v-model="form.description" :disabled="mode === 'view'" rows="3"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter template description"></textarea>
              </div>

              <!-- Email-specific fields -->
              <div v-if="form.type === 'email'" class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">Email Configuration</h4>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700">Subject *</label>
                    <input id="subject" v-model="form.subject" type="text" :disabled="mode === 'view'"
                      :required="form.type === 'email'"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Email subject" />
                    <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
                  </div>

                  <div>
                    <label for="sender_email" class="block text-sm font-medium text-gray-700">Sender Email</label>
                    <input id="sender_email" v-model="form.sender_email" type="email" :disabled="mode === 'view'"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="sender@example.com" />
                  </div>
                </div>

                <!-- Email Body with HTML Support -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label for="body" class="block text-sm font-medium text-gray-700">Email Body *</label>
                    <div v-if="mode !== 'view'" class="flex space-x-2">
                      <button type="button" @click="emailViewMode = 'code'" :class="[
                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                        emailViewMode === 'code'
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      ]">
                        Code
                      </button>
                      <button type="button" @click="emailViewMode = 'preview'" :class="[
                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                        emailViewMode === 'preview'
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      ]">
                        Preview
                      </button>
                      <button type="button" @click="emailViewMode = 'split'" :class="[
                        'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                        emailViewMode === 'split'
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      ]">
                        Split
                      </button>
                    </div>
                  </div>

                  <!-- View Mode: Rendered HTML -->
                  <div v-if="mode === 'view'" class="border border-gray-300 rounded-md bg-white min-h-[200px] overflow-hidden">
                    <iframe 
                        ref="viewIframe"
                        :srcdoc="getIsolatedHtml(processedEmailBody)"
                        class="w-full min-h-[200px] border-0"
                        sandbox="allow-same-origin"
                        @load="(event) => adjustIframeHeight(event.target as HTMLIFrameElement)"
                      ></iframe>
                  </div>

                  <!-- Edit/Create Mode: Code Editor -->
                  <div v-else-if="emailViewMode === 'code'" class="space-y-2">
                    <textarea id="body" v-model="form.body" :required="form.type === 'email'" rows="12"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                      placeholder="Enter HTML content. You can use variables like {{name}}, {{email}}, etc."></textarea>
                    <p v-if="errors.body" class="text-sm text-red-600">{{ errors.body }}</p>
                    <p class="text-sm text-gray-500">
                      You can use HTML tags and variables in double curly braces, e.g., 
                      <code v-pre>{{name}}</code>, <code v-pre>{{email}}</code>
                    </p>
                  </div>

                  <!-- Edit/Create Mode: Preview -->
                  <div v-else-if="emailViewMode === 'preview'" class="space-y-2">
                    <div class="border border-gray-300 rounded-md bg-white min-h-[300px] overflow-hidden">
                      <iframe 
                        ref="previewIframe"
                        :srcdoc="getIsolatedHtml(processedEmailBody)"
                        class="w-full min-h-[300px] border-0"
                        sandbox="allow-same-origin"
                        @load="(event) => adjustIframeHeight(event.target as HTMLIFrameElement)"
                      ></iframe>
                    </div>
                    <p class="text-sm text-gray-500">Preview of your email template with sample data</p>
                  </div>

                  <!-- Edit/Create Mode: Split View -->
                  <div v-else-if="emailViewMode === 'split'" class="space-y-2">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">HTML Code</h5>
                        <textarea v-model="form.body" :required="form.type === 'email'" rows="12"
                          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                          placeholder="Enter HTML content..."></textarea>
                      </div>
                      <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Preview</h5>
                        <div class="border border-gray-300 rounded-md bg-white h-[300px] overflow-hidden">
                          <iframe 
                            ref="splitIframe"
                            :srcdoc="getIsolatedHtml(processedEmailBody)"
                            class="w-full h-full border-0"
                            sandbox="allow-same-origin"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                    <p v-if="errors.body" class="text-sm text-red-600">{{ errors.body }}</p>
                    <p class="text-sm text-gray-500">Edit HTML on the left and see the preview on the right</p>
                  </div>
                </div>
              </div>

              <!-- SMS-specific fields -->
              <div v-if="form.type === 'sms'" class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">SMS Configuration</h4>

                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700">Message *</label>
                  <textarea id="message" v-model="form.message" :disabled="mode === 'view'"
                    :required="form.type === 'sms'" rows="4" maxlength="160"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="SMS message content. You can use variables like name, phone, etc."></textarea>
                  <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ form.message?.length || 0 }}/160 characters. You can use variables in double curly braces.
                  </p>
                </div>
              </div>

              <!-- WhatsApp-specific fields -->
              <div v-if="form.type === 'whatsapp'" class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">WhatsApp Configuration</h4>

                <div>
                  <label for="whatsapp_message" class="block text-sm font-medium text-gray-700">Message *</label>
                  <textarea id="whatsapp_message" v-model="form.message" :disabled="mode === 'view'"
                    :required="form.type === 'whatsapp'" rows="5"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="WhatsApp message content. You can use variables like name, phone, etc."></textarea>
                  <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
                  <p class="mt-1 text-sm text-gray-500">
                    You can use variables in double curly braces, e.g., 
                    <code v-pre>{{name}}</code>, <code v-pre>{{phone}}</code>
                  </p>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <div class="mt-2">
                  <label class="inline-flex items-center">
                    <input v-model="form.status" type="checkbox" :disabled="mode === 'view'" true-value="active"
                      false-value="inactive"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-50" />
                    <span class="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <!-- Template Variables Info -->
              <div v-if="mode !== 'view'" class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Available Variables</h4>
                <p class="text-sm text-blue-700 mb-2">
                  You can use the following variables in your templates:
                </p>
                <div class="grid grid-cols-2 gap-2 text-sm text-blue-600">
                  <div><code v-pre>{{name}}</code> - Recipient name</div>
                  <div><code v-pre>{{email}}</code> - Email address</div>
                  <div><code v-pre>{{phone}}</code> - Phone number</div>
                  <div><code v-pre>{{company}}</code> - Company name</div>
                  <div><code v-pre>{{date}}</code> - Current date</div>
                  <div><code v-pre>{{time}}</code> - Current time</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <template v-if="mode !== 'view'">
              <button type="submit" :disabled="loading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ loading ? 'Saving...' : (mode === 'create' ? 'Create Template' : 'Update Template') }}
              </button>
            </template>
            <button type="button" @click="handleClose"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading">
              {{ mode === 'view' ? 'Close' : 'Cancel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
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
const emailViewMode = ref<'code' | 'preview' | 'split'>('code')

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

// Sample data for preview
const sampleData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString()
}

// Computed properties
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create Notification Template'
    case 'edit':
      return 'Edit Notification Template'
    case 'view':
      return 'View Notification Template'
    default:
      return 'Notification Template'
  }
})

const processedEmailBody = computed(() => {
  if (!form.value.body) {
    return '<p style="color: #6b7280; font-style: italic;">No content available</p>'
  }

  let processed = form.value.body

  // Replace template variables with sample data
  Object.entries(sampleData).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    processed = processed.replace(regex, String(value))
  })

  // Handle any remaining unmatched variables with better styling
  processed = processed.replace(/{\{\s*([^}]+)\s*}\}/g, '<span class="template-variable">{{$1}}</span>')

  return processed
})

// Template refs
const viewIframe = ref<HTMLIFrameElement>()
const previewIframe = ref<HTMLIFrameElement>()
const splitIframe = ref<HTMLIFrameElement>()

// Methods
const getIsolatedHtml = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Preview</title>
      <style>
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #ffffff;
          padding: 16px;
          word-wrap: break-word;
        }
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        p {
          margin-bottom: 1em;
        }
        
        a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        a:hover {
          color: #1d4ed8;
        }
        
        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1em;
        }
        
        th, td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        /* Images */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Lists */
        ul, ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        
        /* Code */
        code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }
        
        pre {
          background-color: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1em;
        }
        
        /* Variable highlighting */
        .template-variable {
          background-color: #fef3c7;
          color: #92400e;
          padding: 2px 4px;
          border-radius: 3px;
          font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          body {
            padding: 12px;
          }
          
          table {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `
}

const adjustIframeHeight = (iframe: HTMLIFrameElement) => {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      const height = Math.max(
        doc.body.scrollHeight,
        doc.body.offsetHeight,
        doc.documentElement.clientHeight,
        doc.documentElement.scrollHeight,
        doc.documentElement.offsetHeight
      )
      iframe.style.height = Math.max(height + 20, 200) + 'px'
    }
  } catch (error) {
    console.warn('Could not adjust iframe height:', error)
  }
}

const initializeForm = () => {
  if (props.template) {
    form.value = {
      name: props.template.name,
      type: props.template.type,
      description: props.template.description || '',
      subject: '', // Template doesn't have subject property
      body: props.template.type === 'email' ? props.template.content : '',
      message: props.template.type !== 'email' ? props.template.content : '',
      sender_email: '', // Template doesn't have sender_email property
      status: props.template.status || 'active'
    }
  } else {
    // Reset form for create mode
    form.value = {
      name: '',
      type: '' as 'email' | 'sms' | 'whatsapp' | '',
      description: '',
      subject: '',
      body: '',
      message: '',
      sender_email: '',
      status: 'active' as 'active' | 'inactive'
    }
  }

  // Reset email view mode
  emailViewMode.value = 'code'
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // Template name validation
  if (!form.value.name.trim()) {
    errors.value.name = 'Template name is required'
    isValid = false
  } else if (form.value.name.trim().length < 3) {
    errors.value.name = 'Template name must be at least 3 characters'
    isValid = false
  } else if (form.value.name.trim().length > 100) {
    errors.value.name = 'Template name must not exceed 100 characters'
    isValid = false
  }

  // Template type validation
  if (!form.value.type) {
    errors.value.type = 'Template type is required'
    isValid = false
  }

  // Description validation (optional but with limits)
  if (form.value.description && form.value.description.length > 500) {
    errors.value.description = 'Description must not exceed 500 characters'
    isValid = false
  }

  // Email-specific validation
  if (form.value.type === 'email') {
    if (!form.value.subject.trim()) {
      errors.value.subject = 'Email subject is required'
      isValid = false
    } else if (form.value.subject.trim().length > 200) {
      errors.value.subject = 'Email subject must not exceed 200 characters'
      isValid = false
    }

    if (!form.value.body.trim()) {
      errors.value.body = 'Email body is required'
      isValid = false
    } else if (form.value.body.trim().length > 50000) {
      errors.value.body = 'Email body must not exceed 50,000 characters'
      isValid = false
    }

    // Sender email validation (optional)
    if (form.value.sender_email && !isValidEmail(form.value.sender_email)) {
      errors.value.sender_email = 'Please enter a valid email address'
      isValid = false
    }
  }

  // SMS/WhatsApp validation
  if ((form.value.type === 'sms' || form.value.type === 'whatsapp') && !form.value.message.trim()) {
    errors.value.message = 'Message is required'
    isValid = false
  } else if ((form.value.type === 'sms' || form.value.type === 'whatsapp') && form.value.message.trim().length > 1600) {
    errors.value.message = 'Message must not exceed 1,600 characters'
    isValid = false
  }

  return isValid
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  // Clear previous errors
  errors.value = {}
  
  if (!validateForm()) {
    // Scroll to first error field
    const firstErrorField = document.querySelector('.border-red-300')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  loading.value = true

  try {
    const baseData = {
      owner_id: 'current-user-id', // TODO: Get from auth store
      name: form.value.name.trim(),
      type: form.value.type as 'email' | 'sms' | 'whatsapp',
      content: form.value.type === 'email' ? form.value.body.trim() : form.value.message.trim(),
      description: form.value.description?.trim() || undefined,
      status: form.value.status as 'active' | 'inactive'
    }

    if (props.mode === 'create') {
      const createData: CreateTemplateRequest = {
        ...baseData,
        subject: form.value.type === 'email' ? form.value.subject.trim() : undefined,
        body: form.value.type === 'email' ? form.value.body.trim() : undefined,
        message: form.value.type !== 'email' ? form.value.message.trim() : undefined,
        sender_email: form.value.sender_email?.trim() || undefined
      }
      
      const result = await NotificationTemplateService.createTemplate(createData)
      console.log('Template created successfully:', result)
    } else if (props.mode === 'edit' && props.template) {
      const updateData: UpdateTemplateRequest = {
        ...baseData,
        subject: form.value.type === 'email' ? form.value.subject.trim() : undefined,
        body: form.value.type === 'email' ? form.value.body.trim() : undefined,
        message: form.value.type !== 'email' ? form.value.message.trim() : undefined,
        sender_email: form.value.sender_email?.trim() || undefined
      }
      
      const result = await NotificationTemplateService.updateTemplate(props.template.id, updateData)
      console.log('Template updated successfully:', result)
    }

    // Show success message and close modal
    emit('saved')
  } catch (err: any) {
    console.error('Error saving template:', err)
    
    // Handle different types of errors
    if (err.response?.status === 400) {
      // Validation errors from server
      if (err.response.data?.errors) {
        Object.assign(errors.value, err.response.data.errors)
      } else {
        errors.value.general = err.response.data?.message || 'Validation failed. Please check your input.'
      }
    } else if (err.response?.status === 409) {
      errors.value.name = 'A template with this name already exists'
    } else if (err.response?.status === 403) {
      errors.value.general = 'You do not have permission to perform this action'
    } else if (err.response?.status >= 500) {
      errors.value.general = 'Server error. Please try again later.'
    } else if (err.code === 'NETWORK_ERROR') {
      errors.value.general = 'Network error. Please check your connection and try again.'
    } else {
      errors.value.general = err.message || 'Failed to save template. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  // Reset form and errors when closing
  if (props.mode === 'create') {
    initializeForm()
  }
  emit('close')
}

// Watchers
watch(() => props.template, initializeForm, { immediate: true })
watch(() => props.mode, initializeForm)

// Clear type-specific fields when type changes
watch(() => form.value.type, (newType, oldType) => {
  if (newType !== oldType) {
    form.value.subject = ''
    form.value.body = ''
    form.value.message = ''
    form.value.sender_email = ''
    errors.value = {} // Clear errors when type changes
  }
})

// Watch for email body changes and adjust iframe heights
watch(() => form.value.body, () => {
  nextTick(() => {
    if (viewIframe.value) adjustIframeHeight(viewIframe.value)
    if (previewIframe.value) adjustIframeHeight(previewIframe.value)
    if (splitIframe.value) adjustIframeHeight(splitIframe.value)
  })
}, { flush: 'post' })

// Watch for email view mode changes
watch(() => emailViewMode.value, () => {
  nextTick(() => {
    if (previewIframe.value) adjustIframeHeight(previewIframe.value)
    if (splitIframe.value) adjustIframeHeight(splitIframe.value)
  })
}, { flush: 'post' })

// Lifecycle
onMounted(() => {
  initializeForm()
})

// Cleanup on unmount
onUnmounted(() => {
  // Clear any pending timeouts or intervals if needed
  errors.value = {}
})
</script>