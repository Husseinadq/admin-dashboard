<template>
  <DashboardLayout>
    <template #page-title>Template Attributes Management</template>

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
                      <router-link to="/notifications"
                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Notifications
                      </router-link>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span class="ml-4 text-sm font-medium text-gray-900">Template Attributes</span>
                    </div>
                  </li>
                </ol>
              </nav>

              <!-- Page Title -->
              <h1 class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Template Attributes Management
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Manage dynamic attributes for notification templates
              </p>
            </div>

            <!-- Quick Actions -->
            <div class="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button @click="openCreateModal"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Attribute
              </button>
              <button @click="refreshAttributes"
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
          <!-- Filters -->
          <div class="bg-white shadow rounded-lg mb-6">
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Template Filter -->
                <div>
                  <label for="template-filter" class="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Template
                  </label>
                  <select v-model="selectedTemplateId" @change="filterByTemplate"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">All Templates</option>
                    <option v-for="template in templates" :key="template.id" :value="template.id">
                      {{ template.name }} ({{ template.type }})
                    </option>
                  </select>
                </div>

                <!-- Type Filter -->
                <div>
                  <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Type
                  </label>
                  <select v-model="selectedType" @change="filterByType"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">All Types</option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="url">URL</option>
                  </select>
                </div>

                <!-- Search -->
                <div>
                  <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                    Search Attributes
                  </label>
                  <input v-model="searchQuery" @input="filterAttributes" type="text" placeholder="Search by name..."
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>
          </div>

          <!-- Attributes Table -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                Template Attributes
                <span class="ml-2 text-sm text-gray-500">({{ filteredAttributes.length }} total)</span>
              </h3>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="px-6 py-12 text-center">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Loading attributes...
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredAttributes.length === 0" class="px-6 py-12 text-center">
              <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No attributes found</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ searchQuery || selectedTemplateId || selectedType ? 'No attributes match your filters.' : 'Get started by creating your first template attribute.' }}
              </p>
              <div class="mt-6">
                <button @click="openCreateModal" type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Attribute
                </button>
              </div>
            </div>

            <!-- Attributes Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Default Value
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="attribute in filteredAttributes" :key="attribute.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-indigo-600">{{ attribute.name.charAt(0).toUpperCase()
                              }}</span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ attribute.name }}</div>
                          <div class="text-sm text-gray-500"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getTypeColor(attribute.type)">
                        {{ attribute.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span v-if="attribute.value" class="text-gray-900">{{ attribute.value }}</span>
                      <span v-else class="text-gray-400 italic">No default</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div v-if="getTemplateById(attribute.template_id)">
                        <div class="font-medium">{{ getTemplateById(attribute.template_id)?.name }}</div>
                        <div class="text-gray-500">{{ getTemplateById(attribute.template_id)?.type }}</div>
                      </div>
                      <span v-else class="text-gray-400">Unknown Template</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(attribute.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <button @click="openEditModal(attribute)"
                          class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50">
                          <PencilIcon class="h-4 w-4" />
                        </button>
                        <button @click="confirmDelete(attribute)"
                          class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50">
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? 'Edit Template Attribute' : 'Create Template Attribute' }}
              </h3>
              <div class="mt-6">
                <form @submit.prevent="saveAttribute" class="space-y-4">
                  <!-- Template Selection -->
                  <div>
                    <label for="template" class="block text-sm font-medium text-gray-700 mb-1">
                      Template *
                    </label>
                    <select v-model="form.template_id" required
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.template_id }">
                      <option value="">Select a template</option>
                      <option v-for="template in templates" :key="template.id" :value="template.id">
                        {{ template.name }} ({{ template.type }})
                      </option>
                    </select>
                    <p v-if="errors.template_id" class="mt-1 text-sm text-red-600">{{ errors.template_id }}</p>
                  </div>

                  <!-- Attribute Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      Attribute Name *
                    </label>
                    <input v-model="form.name" type="text" required placeholder="e.g., customer_name, order_number"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.name }" />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                    <p class="mt-1 text-xs text-gray-500">Use lowercase with underscores (snake_case)</p>
                  </div>

                  <!-- Attribute Type -->
                  <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                      Data Type *
                    </label>
                    <select v-model="form.type" required
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.type }">
                      <option value="">Select type</option>
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="url">URL</option>
                    </select>
                    <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                  </div>

                  <!-- Default Value -->
                  <div>
                    <label for="value" class="block text-sm font-medium text-gray-700 mb-1">
                      Default Value
                    </label>
                    <input v-model="form.value" type="text" placeholder="Optional default value"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.value }" />
                    <p v-if="errors.value" class="mt-1 text-sm text-red-600">{{ errors.value }}</p>
                    <p class="mt-1 text-xs text-gray-500">Leave empty if no default value is needed</p>
                  </div>

                  <!-- Form Actions -->
                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                    <button type="submit" :disabled="saving"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                      <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="closeDeleteModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete Template Attribute
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete the attribute "{{ attributeToDelete?.name }}"? This action cannot be
                  undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button @click="deleteAttribute" :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button @click="closeDeleteModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  ChevronRightIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { TemplateAttributeService, NotificationTemplateService } from '@/services/notificationService'
import type { TemplateAttribute, CreateTemplateAttributeRequest, UpdateTemplateAttributeRequest, NotificationTemplate } from '@/types/notifications'

// Reactive state
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const attributes = ref<TemplateAttribute[]>([])
const templates = ref<NotificationTemplate[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const attributeToDelete = ref<TemplateAttribute | null>(null)

// Filters
const selectedTemplateId = ref('')
const selectedType = ref('')
const searchQuery = ref('')

// Form state
const form = ref<CreateTemplateAttributeRequest>({
  template_id: 0,
  name: '',
  type: '',
  value: ''
})

const errors = ref<Record<string, string>>({})
const editingAttributeId = ref<number | null>(null)

// Computed properties
const filteredAttributes = computed(() => {
  let filtered = [...attributes.value]

  // Filter by template
  if (selectedTemplateId.value) {
    filtered = filtered.filter(attr => attr.template_id === parseInt(selectedTemplateId.value))
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(attr => attr.type === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(attr =>
      attr.name.toLowerCase().includes(query) ||
      attr.type.toLowerCase().includes(query) ||
      (attr.value && attr.value.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const loadAttributes = async () => {
  loading.value = true
  try {
    const response = await TemplateAttributeService.getAllAttributes()
    attributes.value = response.data || []
  } catch (error) {
    console.error('Error loading attributes:', error)
    // You might want to show a toast notification here
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    const response = await NotificationTemplateService.getAllTemplates()
    templates.value = response.data || []
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const refreshAttributes = () => {
  loadAttributes()
  loadTemplates()
}

const getTemplateById = (id: number) => {
  return templates.value.find(template => template.id === id)
}

const getTypeColor = (type: string) => {
  const colors = {
    string: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800',
    boolean: 'bg-purple-100 text-purple-800',
    date: 'bg-yellow-100 text-yellow-800',
    url: 'bg-indigo-100 text-indigo-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Modal methods
const openCreateModal = () => {
  isEditing.value = false
  editingAttributeId.value = null
  form.value = {
    template_id: selectedTemplateId.value ? parseInt(selectedTemplateId.value) : 0,
    name: '',
    type: '',
    value: ''
  }
  errors.value = {}
  showModal.value = true
}

const openEditModal = (attribute: TemplateAttribute) => {
  isEditing.value = true
  editingAttributeId.value = attribute.id
  form.value = {
    template_id: attribute.template_id,
    name: attribute.name,
    type: attribute.type,
    value: attribute.value || ''
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingAttributeId.value = null
  form.value = {
    template_id: 0,
    name: '',
    type: '',
    value: ''
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.template_id) {
    errors.value.template_id = 'Template is required'
  }

  if (!form.value.name.trim()) {
    errors.value.name = 'Attribute name is required'
  } else if (!/^[a-z][a-z0-9_]*$/.test(form.value.name)) {
    errors.value.name = 'Name must be lowercase, start with a letter, and contain only letters, numbers, and underscores'
  }

  if (!form.value.type) {
    errors.value.type = 'Data type is required'
  }

  return Object.keys(errors.value).length === 0
}

const saveAttribute = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    if (isEditing.value && editingAttributeId.value) {
      const updateData: UpdateTemplateAttributeRequest = {
        name: form.value.name,
        type: form.value.type,
        value: form.value.value || undefined
      }
      await TemplateAttributeService.updateAttribute(editingAttributeId.value, updateData)
    } else {
      await TemplateAttributeService.createAttribute(form.value)
    }

    closeModal()
    await loadAttributes()
    // You might want to show a success toast here
  } catch (error: any) {
    console.error('Error saving attribute:', error)
    // Handle validation errors from the server
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    // You might want to show an error toast here
  } finally {
    saving.value = false
  }
}

// Delete methods
const confirmDelete = (attribute: TemplateAttribute) => {
  attributeToDelete.value = attribute
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  attributeToDelete.value = null
}

const deleteAttribute = async () => {
  if (!attributeToDelete.value) return

  deleting.value = true
  try {
    await TemplateAttributeService.deleteAttribute(attributeToDelete.value.id)
    closeDeleteModal()
    await loadAttributes()
    // You might want to show a success toast here
  } catch (error) {
    console.error('Error deleting attribute:', error)
    // You might want to show an error toast here
  } finally {
    deleting.value = false
  }
}

// Filter methods
const filterByTemplate = () => {
  // Filtering is handled by computed property
}

const filterByType = () => {
  // Filtering is handled by computed property
}

const filterAttributes = () => {
  // Filtering is handled by computed property
}

// Lifecycle
onMounted(() => {
  loadAttributes()
  loadTemplates()
})
</script>