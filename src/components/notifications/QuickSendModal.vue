<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Quick Send Notification
              </h3>
              <button
                type="button"
                @click="$emit('close')"
                class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Form Content -->
            <div class="space-y-6">
              <!-- Notification Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Notification Type *</label>
                <div class="grid grid-cols-3 gap-3">
                  <label class="relative">
                    <input
                      v-model="form.type"
                      type="radio"
                      value="email"
                      class="sr-only"
                    />
                    <div class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.type === 'email' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'">
                      <div class="text-center">
                        <EnvelopeIcon class="h-8 w-8 mx-auto mb-2" :class="form.type === 'email' ? 'text-indigo-600' : 'text-gray-400'" />
                        <span class="text-sm font-medium" :class="form.type === 'email' ? 'text-indigo-900' : 'text-gray-900'">Email</span>
                      </div>
                    </div>
                  </label>
                  
                  <label class="relative">
                    <input
                      v-model="form.type"
                      type="radio"
                      value="sms"
                      class="sr-only"
                    />
                    <div class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.type === 'sms' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'">
                      <div class="text-center">
                        <DevicePhoneMobileIcon class="h-8 w-8 mx-auto mb-2" :class="form.type === 'sms' ? 'text-green-600' : 'text-gray-400'" />
                        <span class="text-sm font-medium" :class="form.type === 'sms' ? 'text-green-900' : 'text-gray-900'">SMS</span>
                      </div>
                    </div>
                  </label>
                  
                  <label class="relative">
                    <input
                      v-model="form.type"
                      type="radio"
                      value="whatsapp"
                      class="sr-only"
                    />
                    <div class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.type === 'whatsapp' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'">
                      <div class="text-center">
                        <ChatBubbleLeftRightIcon class="h-8 w-8 mx-auto mb-2" :class="form.type === 'whatsapp' ? 'text-purple-600' : 'text-gray-400'" />
                        <span class="text-sm font-medium" :class="form.type === 'whatsapp' ? 'text-purple-900' : 'text-gray-900'">WhatsApp</span>
                      </div>
                    </div>
                  </label>
                </div>
                <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
              </div>

              <!-- Template Selection -->
              <div v-if="form.type">
                <label for="template" class="block text-sm font-medium text-gray-700">Use Template (Optional)</label>
                <select
                  id="template"
                  v-model="form.templateId"
                  @change="loadTemplate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Create custom message</option>
                  <option v-for="template in filteredTemplates" :key="template.id" :value="template.id">
                    {{ template.name }}
                  </option>
                </select>
              </div>

              <!-- Recipients -->
              <div>
                <label for="recipients" class="block text-sm font-medium text-gray-700">
                  Recipients *
                  <span class="text-gray-500 font-normal">({{ form.type === 'email' ? 'email addresses' : 'phone numbers' }} separated by commas)</span>
                </label>
                <textarea
                  id="recipients"
                  v-model="form.recipients"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  :placeholder="form.type === 'email' ? 'user1@example.com, user2@example.com' : '+1234567890, +0987654321'"
                ></textarea>
                <p v-if="errors.recipients" class="mt-1 text-sm text-red-600">{{ errors.recipients }}</p>
              </div>

              <!-- Email-specific fields -->
              <div v-if="form.type === 'email'" class="space-y-4">
                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700">Subject *</label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email subject"
                  />
                  <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
                </div>

                <div>
                  <label for="sender_email" class="block text-sm font-medium text-gray-700">Sender Email</label>
                  <input
                    id="sender_email"
                    v-model="form.senderEmail"
                    type="email"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="sender@example.com (optional)"
                  />
                </div>

                <div>
                  <label for="body" class="block text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    id="body"
                    v-model="form.body"
                    rows="6"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email message content"
                  ></textarea>
                  <p v-if="errors.body" class="mt-1 text-sm text-red-600">{{ errors.body }}</p>
                </div>
              </div>

              <!-- SMS/WhatsApp message -->
              <div v-if="form.type === 'sms' || form.type === 'whatsapp'">
                <label for="message" class="block text-sm font-medium text-gray-700">Message *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="4"
                  required
                  :maxlength="form.type === 'sms' ? 160 : undefined"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  :placeholder="`${form.type === 'sms' ? 'SMS' : 'WhatsApp'} message content`"
                ></textarea>
                <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
                <p v-if="form.type === 'sms'" class="mt-1 text-sm text-gray-500">
                  {{ form.message?.length || 0 }}/160 characters
                </p>
              </div>

              <!-- Send Options -->
              <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Send Options</h4>
                <div class="space-y-2">
                  <label class="inline-flex items-center">
                    <input
                      v-model="form.sendImmediately"
                      type="checkbox"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Send immediately</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Sending...' : 'Send Notification' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  XMarkIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import type { NotificationTemplate } from '@/types/notifications'
import { NotificationTemplateService, EmailService, SMSService, WhatsAppService } from '@/services/notificationService'

// Emits
const emit = defineEmits<{
  close: []
}>()

// Reactive state
const loading = ref(false)
const templates = ref<NotificationTemplate[]>([])
const errors = ref<Record<string, string>>({})

// Form data
const form = ref({
  type: '',
  templateId: '',
  recipients: '',
  subject: '',
  body: '',
  message: '',
  senderEmail: '',
  sendImmediately: true
})

// Computed properties
const filteredTemplates = computed(() => {
  return templates.value.filter(template => 
    template.type === form.value.type && template.status === 'active'
  )
})

// Methods
const loadTemplates = async () => {
  try {
    const response = await NotificationTemplateService.getAllTemplates()
    templates.value = response.data || []
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const loadTemplate = () => {
  if (!form.value.templateId) {
    // Clear form when no template selected
    form.value.subject = ''
    form.value.body = ''
    form.value.message = ''
    form.value.senderEmail = ''
    return
  }

  const template = templates.value.find(t => t.id === parseInt(form.value.templateId))
  if (template) {
    if (template.type === 'email') {
      form.value.body = template.content || ''
      // Subject and sender email should be filled manually or from template attributes
    } else {
      form.value.message = template.content || ''
    }
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!form.value.type) {
    errors.value.type = 'Please select a notification type'
    isValid = false
  }

  if (!form.value.recipients.trim()) {
    errors.value.recipients = 'Recipients are required'
    isValid = false
  }

  if (form.value.type === 'email') {
    if (!form.value.subject.trim()) {
      errors.value.subject = 'Subject is required for email'
      isValid = false
    }
    if (!form.value.body.trim()) {
      errors.value.body = 'Message body is required for email'
      isValid = false
    }
  }

  if ((form.value.type === 'sms' || form.value.type === 'whatsapp') && !form.value.message.trim()) {
    errors.value.message = 'Message is required'
    isValid = false
  }

  return isValid
}

const parseRecipients = (recipients: string): string[] => {
  return recipients
    .split(',')
    .map(r => r.trim())
    .filter(r => r.length > 0)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const recipients = parseRecipients(form.value.recipients)
    
    if (form.value.type === 'email') {
      if (recipients.length === 1) {
        await EmailService.sendEmail({
          sender: form.value.senderEmail || 'noreply@example.com',
          recipient: recipients[0],
          subject: form.value.subject,
          body: form.value.body,
          type: 'other',
          template_attributes: {}
        })
      } else {
        await EmailService.sendMultipleEmails({
          messages: recipients.map(email => ({
            sender: form.value.senderEmail || 'noreply@example.com',
            recipient: email,
            subject: form.value.subject,
            body: form.value.body,
            type: 'other' as const,
            template_attributes: {}
          }))
        })
      }
    } else if (form.value.type === 'sms') {
      if (recipients.length === 1) {
        await SMSService.sendSMS({
          phone_number: recipients[0],
          message: form.value.message
        })
      } else {
        await SMSService.sendMultipleSMS({
          messages: recipients.map(phone => ({
            phone_number: phone,
            message: form.value.message
          }))
        })
      }
    } else if (form.value.type === 'whatsapp') {
      if (recipients.length === 1) {
        await WhatsAppService.sendWhatsApp({
          phone_number: recipients[0],
          message: form.value.message
        })
      } else {
        await WhatsAppService.sendMultipleWhatsApp({
          messages: recipients.map(phone => ({
            phone_number: phone,
            message: form.value.message
          }))
        })
      }
    }
    
    // Success - close modal
    emit('close')
  } catch (err: any) {
    console.error('Error sending notification:', err)
    errors.value.general = err.message || 'Failed to send notification. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => form.value.type, () => {
  // Clear template selection when type changes
  form.value.templateId = ''
  form.value.subject = ''
  form.value.body = ''
  form.value.message = ''
  form.value.senderEmail = ''
})

// Lifecycle
onMounted(() => {
  loadTemplates()
})
</script>