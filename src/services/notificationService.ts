import axios, { type AxiosResponse } from 'axios'
import type {
  NotificationTemplate,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateAttribute,
  CreateTemplateAttributeRequest,
  UpdateTemplateAttributeRequest,
  ApiResponse,
  PaginatedResponse,
  SendEmailRequest,
  SendMultipleEmailsRequest,
  EmailRecord,
  SendSMSRequest,
  SendMultipleSMSRequest,
  SendWhatsAppRequest,
  SendMultipleWhatsAppRequest
} from '@/types/notifications'

// API Configuration
const API_BASE_URL =  'https://eejaz-api.trameaz.com/api'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('user_type')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Template Management Service
export class NotificationTemplateService {
  /**
   * Get all notification templates
   */
  static async getAllTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
    try {
      const response: AxiosResponse<ApiResponse<NotificationTemplate[]>> = await apiClient.get('/templates')
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Get a single template by ID
   */
  static async getTemplate(id: number): Promise<ApiResponse<NotificationTemplate>> {
    try {
      const response: AxiosResponse<ApiResponse<NotificationTemplate>> = await apiClient.get(`/templates/${id}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Create a new notification template
   */
  static async createTemplate(data: CreateTemplateRequest): Promise<ApiResponse<NotificationTemplate>> {
    try {
      const response: AxiosResponse<ApiResponse<NotificationTemplate>> = await apiClient.post('/templates', data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Update an existing template
   */
  static async updateTemplate(id: number, data: UpdateTemplateRequest): Promise<ApiResponse<NotificationTemplate>> {
    try {
      const response: AxiosResponse<ApiResponse<NotificationTemplate>> = await apiClient.put(`/templates/${id}`, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(id: number): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/templates/${id}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private static handleError(error: any): Error {
    if (error.response?.data) {
      const errorData = error.response.data
      if (errorData.errors) {
        // Validation errors
        const messages = Object.values(errorData.errors).flat().join(', ')
        return new Error(messages)
      }
      return new Error(errorData.message || errorData.error || 'An error occurred')
    }
    return new Error(error.message || 'Network error occurred')
  }
}

// Template Attributes Service
export class TemplateAttributeService {
  /**
   * Get all template attributes
   */
  static async getAllAttributes(): Promise<ApiResponse<TemplateAttribute[]>> {
    try {
      const response: AxiosResponse<ApiResponse<TemplateAttribute[]>> = await apiClient.get('/templates/attributes')
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Get a single template attribute by ID
   */
  static async getAttribute(id: number): Promise<ApiResponse<TemplateAttribute>> {
    try {
      const response: AxiosResponse<ApiResponse<TemplateAttribute>> = await apiClient.get(`/templates/attributes/${id}`)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Get attributes for a specific template
   */
  static async getAttributesByTemplate(templateId: number): Promise<ApiResponse<TemplateAttribute[]>> {
    try {
      const response: AxiosResponse<ApiResponse<TemplateAttribute[]>> = await apiClient.get(`/templates/attributes/template/${templateId}`)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Create a new template attribute
   */
  static async createAttribute(data: CreateTemplateAttributeRequest): Promise<ApiResponse<TemplateAttribute>> {
    try {
      const response: AxiosResponse<ApiResponse<TemplateAttribute>> = await apiClient.post('/templates/attributes', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Update an existing template attribute
   */
  static async updateAttribute(id: number, data: UpdateTemplateAttributeRequest): Promise<ApiResponse<TemplateAttribute>> {
    try {
      const response: AxiosResponse<ApiResponse<TemplateAttribute>> = await apiClient.put(`/templates/attributes/${id}`, data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Delete a template attribute
   */
  static async deleteAttribute(id: number): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/templates/attributes/${id}`)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }
}

// Email Service
export class EmailService {
  /**
   * Send a single email
   */
  static async sendEmail(data: SendEmailRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/email/send/message', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Send multiple emails
   */
  static async sendMultipleEmails(data: SendMultipleEmailsRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/email/send/messages', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Get all emails
   */
  static async getAllEmails(): Promise<ApiResponse<EmailRecord[]>> {
    try {
      const response: AxiosResponse<ApiResponse<EmailRecord[]>> = await apiClient.get('/email')
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Get a single email by ID
   */
  static async getEmail(id: number): Promise<ApiResponse<EmailRecord>> {
    try {
      const response: AxiosResponse<ApiResponse<EmailRecord>> = await apiClient.get(`/email/${id}`)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Get emails by sender
   */
  static async getEmailsBySender(sender: string): Promise<ApiResponse<EmailRecord[]>> {
    try {
      const response: AxiosResponse<ApiResponse<EmailRecord[]>> = await apiClient.get(`/email/sender/${encodeURIComponent(sender)}`)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }
}

// SMS Service
export class SMSService {
  /**
   * Send a single SMS
   */
  static async sendSMS(data: SendSMSRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/sms/send/message', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Send multiple SMS messages
   */
  static async sendMultipleSMS(data: SendMultipleSMSRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/sms/send/messages', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }
}

// WhatsApp Service
export class WhatsAppService {
  /**
   * Send a single WhatsApp message
   */
  static async sendWhatsApp(data: SendWhatsAppRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/whatsapp/send/message', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }

  /**
   * Send multiple WhatsApp messages
   */
  static async sendMultipleWhatsApp(data: SendMultipleWhatsAppRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await apiClient.post('/whatsapp/send/messages', data)
      return response.data
    } catch (error: any) {
      throw NotificationTemplateService['handleError'](error)
    }
  }
}

// Export default service for convenience
export default {
  templates: NotificationTemplateService,
  attributes: TemplateAttributeService,
  email: EmailService,
  sms: SMSService,
  whatsapp: WhatsAppService
}