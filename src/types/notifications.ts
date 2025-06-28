// Notification Template Types
export interface NotificationTemplate {
  id: number
  tenant_id?: string | null
  owner_id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp'
  content: string
  status?: 'active' | 'inactive'
  description?: string
  created_at: string
  updated_at: string
}

export interface CreateTemplateRequest {
  owner_id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp'
  content: string
  description?: string
  subject?: string
  sender_email?: string
  body?: string
  message?: string
  status?: 'active' | 'inactive'
}

export interface UpdateTemplateRequest {
  owner_id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp'
  content: string
  description?: string
  subject?: string
  sender_email?: string
  body?: string
  message?: string
  status?: 'active' | 'inactive'
}

export interface TemplateAttribute {
  id: number
  template_id: number
  name: string
  type: string
  value?: string
  created_at: string
  updated_at: string
}

export interface CreateTemplateAttributeRequest {
  template_id: number
  name: string
  type: string
  value?: string
}

export interface UpdateTemplateAttributeRequest {
  name: string
  type: string
  value?: string
}

export interface ApiResponse<T> {
  status: number
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  status: number
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Email specific types
export interface EmailMessage {
  sender: string
  recipient: string
  subject: string
  body: string
  attachments?: any
  type: 'otp' | 'register' | 'reset_password' | 'other'
  template_attributes: Record<string, any>
}

export interface SendEmailRequest {
  sender: string
  recipient: string
  subject: string
  body: string
  attachments?: any
  type: 'otp' | 'register' | 'reset_password' | 'other'
  template_attributes: Record<string, any>
}

export interface SendMultipleEmailsRequest {
  messages: EmailMessage[]
}

export interface EmailRecord {
  id: number
  sender: string
  recipient: string
  subject: string
  body: string
  type: string
  sent_at: string
  created_at: string
}

// SMS and WhatsApp types (for future implementation)
export interface SMSMessage {
  phone_number: string
  message: string
  template_id?: number
}

export interface WhatsAppMessage {
  phone_number: string
  message: string
  template_id?: number
}

export interface SendSMSRequest {
  phone_number: string
  message: string
  template_id?: number
}

export interface SendMultipleSMSRequest {
  messages: SMSMessage[]
}

export interface SendWhatsAppRequest {
  phone_number: string
  message: string
  template_id?: number
}

export interface SendMultipleWhatsAppRequest {
  messages: WhatsAppMessage[]
}

// Form validation types
export interface TemplateFormData {
  name: string
  type: 'email' | 'sms' | 'whatsapp'
  content: string
  owner_id: string
}

export interface TemplateAttributeFormData {
  name: string
  type: string
  value: string
}

// Filter and search types
export interface TemplateFilters {
  type?: 'email' | 'sms' | 'whatsapp'
  owner_id?: string
  search?: string
  status?: 'active' | 'inactive'
}

export interface EmailFilters {
  sender?: string
  recipient?: string
  type?: 'otp' | 'register' | 'reset_password' | 'other'
  date_from?: string
  date_to?: string
}

// Utility types
export type TemplateType = 'email' | 'sms' | 'whatsapp'
export type EmailType = 'otp' | 'register' | 'reset_password' | 'other'

// Constants
export const TEMPLATE_TYPES: { value: TemplateType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' }
]

export const EMAIL_TYPES: { value: EmailType; label: string }[] = [
  { value: 'otp', label: 'OTP' },
  { value: 'register', label: 'Registration' },
  { value: 'reset_password', label: 'Password Reset' },
  { value: 'other', label: 'Other' }
]

export const ATTRIBUTE_TYPES: { value: string; label: string }[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' }
]