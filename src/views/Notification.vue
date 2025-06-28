<template>
  <DashboardLayout>
    <template #page-title>Notification Management</template>

      <div class="min-h-screen bg-gray-50">
        <!-- Page Header -->
        <div class="bg-white shadow">
          <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div class="py-6 md:flex md:items-center md:justify-between">
              <div class="flex-1 min-w-0">
                <!-- Breadcrumb -->
                <nav class="flex" aria-label="Breadcrumb">
                  <ol role="list" class="flex items-center space-x-4">
                    <li>
                      <div class="flex">
                        <router-link to="/" class="text-sm font-medium text-gray-500 hover:text-gray-700">
                          Dashboard 
                        </router-link>
                      </div>
                    </li>
                    <li>
                      <div class="flex items-center">
                        <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span class="ml-4 text-sm font-medium text-gray-900">Notifications</span>
                      </div>
                    </li>
                  </ol>
                </nav>

                <!-- Page Title -->
                <h1 class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Notification Management
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                  Create and manage notification templates for email, SMS, and WhatsApp communications
                </p>
              </div>

              <!-- Quick Actions -->
              <div class="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                <button @click="showQuickSend = true"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PaperAirplaneIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Quick Send
                </button>
                <button @click="refreshTemplates"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <ArrowPathIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="py-8">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <DocumentTextIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Total Templates</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ stats.total }}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <EnvelopeIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Email Templates</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ stats.email }}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <DevicePhoneMobileIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">SMS Templates</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ stats.sms }}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <ChatBubbleLeftRightIcon class="h-6 w-6 text-purple-400" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">WhatsApp Templates</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ stats.whatsapp }}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notification Template List -->
            <NotificationTemplateList ref="templateListRef" @stats-updated="updateStats" />
          </div>
        </div>

        <!-- Quick Send Modal -->
        <QuickSendModal v-if="showQuickSend" @close="showQuickSend = false" />
      </div>

  </DashboardLayout>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ChevronRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import NotificationTemplateList from '@/components/notifications/NotificationTemplateList.vue'
import QuickSendModal from '@/components/notifications/QuickSendModal.vue'
import { NotificationTemplateService } from '@/services/notificationService'
import type { NotificationTemplate } from '@/types/notifications'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Reactive state
const templateListRef = ref<InstanceType<typeof NotificationTemplateList> | null>(null)
const showQuickSend = ref(false)
const stats = ref({
  total: 0,
  email: 0,
  sms: 0,
  whatsapp: 0
})

// Methods
const updateStats = (templates: NotificationTemplate[]) => {
  stats.value = {
    total: templates.length,
    email: templates.filter(t => t.type === 'email').length,
    sms: templates.filter(t => t.type === 'sms').length,
    whatsapp: templates.filter(t => t.type === 'whatsapp').length
  }
}

const loadStats = async () => {
  try {
    const response = await NotificationTemplateService.getAllTemplates()
    console.log('response of all notification',response)
    const templates = response.data || []
    updateStats(templates)
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const refreshTemplates = () => {
  if (templateListRef.value) {
    // Call the loadTemplates method on the child component
    templateListRef.value.loadTemplates()
  }
  loadStats()
}

// Lifecycle
onMounted(() => {
  loadStats()
})
</script>