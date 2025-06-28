<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Notification Templates</h3>
          <p class="mt-1 text-sm text-gray-500">
            Manage your notification templates for email, SMS, and WhatsApp
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Template
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-0">
          <label for="search" class="sr-only">Search templates</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search templates..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <select
            v-model="filters.type"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <select
            v-model="filters.status"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading templates...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-6 py-12 text-center">
      <div class="text-red-600">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 mb-4" />
        <h3 class="text-lg font-medium mb-2">Error Loading Templates</h3>
        <p class="text-sm">{{ error }}</p>
        <button
          @click="loadTemplates"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTemplates.length === 0" class="px-6 py-12 text-center">
      <div class="text-gray-500">
        <DocumentTextIcon class="mx-auto h-12 w-12 mb-4" />
        <h3 class="text-lg font-medium mb-2">No Templates Found</h3>
        <p class="text-sm mb-4">
          {{ templates.length === 0 ? 'Get started by creating your first notification template.' : 'No templates match your current filters.' }}
        </p>
        <button
          v-if="templates.length === 0"
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Your First Template
        </button>
      </div>
    </div>

    <!-- Templates Table -->
    <div v-else class="overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Template
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="template in filteredTemplates" :key="template.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ template.name }}</div>
                <div class="text-sm text-gray-500">{{ template.description || 'No description' }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTypeClass(template.type)">
                {{ template.type.toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(template.status || 'active')">
                {{ (template.status || 'active').charAt(0).toUpperCase() + (template.status || 'active').slice(1) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(template.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(template.updated_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="viewTemplate(template)"
                  class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                  title="View template"
                >
                  <EyeIcon class="h-4 w-4" />
                </button>
                <button
                  @click="editTemplate(template)"
                  class="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                  title="Edit template"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDelete(template)"
                  class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                  title="Delete template"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <NotificationTemplateModal
      v-if="showModal"
      :template="selectedTemplate"
      :mode="modalMode"
      @close="closeModal"
      @saved="handleTemplateSaved"
    />

    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Template"
      :message="`Are you sure you want to delete the template '${templateToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-class="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      @confirm="deleteTemplate"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { NotificationTemplate, TemplateFilters } from '@/types/notifications'
import { NotificationTemplateService } from '@/services/notificationService'
import NotificationTemplateModal from './NotificationTemplateModal.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'

// Reactive state
const templates = ref<NotificationTemplate[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Modal state
const showModal = ref(false)
const modalMode = ref<'view' | 'create' | 'edit'>('view')
const selectedTemplate = ref<NotificationTemplate | null>(null)

// Delete confirmation state
const showDeleteModal = ref(false)
const templateToDelete = ref<NotificationTemplate | null>(null)

// Filters
const filters = ref<TemplateFilters>({
  search: ''
})

// Computed properties
const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(template => 
      template.name.toLowerCase().includes(search) ||
      template.description?.toLowerCase().includes(search)
    )
  }

  if (filters.value.type) {
    filtered = filtered.filter(template => template.type === filters.value.type)
  }

  if (filters.value.status) {
    filtered = filtered.filter(template => template.status === filters.value.status)
  }

  return filtered
})

// Methods
const loadTemplates = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await NotificationTemplateService.getAllTemplates()
    console.log('API Response:', response)
    
    // Handle different response formats
    if (Array.isArray(response)) {
      // Direct array response
      templates.value = response
    } else if (response.data && Array.isArray(response.data)) {
      // Wrapped in ApiResponse structure
      templates.value = response.data
    } else {
      // Fallback
      templates.value = []
      console.warn('Unexpected response format:', response)
    }
    
    console.log('Loaded templates:', templates.value)
  } catch (err: any) {
    error.value = err.message || 'Failed to load templates'
    console.error('Error loading templates:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedTemplate.value = null
  modalMode.value = 'create'
  showModal.value = true
}

const viewTemplate = (template: NotificationTemplate) => {
  selectedTemplate.value = template
  modalMode.value = 'view'
  showModal.value = true
}

const editTemplate = (template: NotificationTemplate) => {
  selectedTemplate.value = template
  modalMode.value = 'edit'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTemplate.value = null
}

const handleTemplateSaved = () => {
  closeModal()
  loadTemplates() // Refresh the list
}

const confirmDelete = (template: NotificationTemplate) => {
  templateToDelete.value = template
  showDeleteModal.value = true
}

const deleteTemplate = async () => {
  if (!templateToDelete.value) return

  try {
    await NotificationTemplateService.deleteTemplate(templateToDelete.value.id)
    templates.value = templates.value.filter(t => t.id !== templateToDelete.value!.id)
    showDeleteModal.value = false
    templateToDelete.value = null
  } catch (err: any) {
    error.value = err.message || 'Failed to delete template'
    console.error('Error deleting template:', err)
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  templateToDelete.value = null
}

// Utility functions
const getTypeClass = (type: string) => {
  const classes = {
    email: 'bg-blue-100 text-blue-800',
    sms: 'bg-green-100 text-green-800',
    whatsapp: 'bg-purple-100 text-purple-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Expose methods for parent component
defineExpose({
  loadTemplates
})

// Emits
const emit = defineEmits<{
  'stats-updated': [templates: NotificationTemplate[]]
}>()

// Watch templates and emit stats updates
watch(templates, (newTemplates) => {
  emit('stats-updated', newTemplates)
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadTemplates()
})
</script>