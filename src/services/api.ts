import axios, { type AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://eejaz-api.trameaz.com/api/v1'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface Ticket {
  id: string
  merchant_id: string
  merchant_name: string
  merchant_email: string
  platform: 'salla' | 'zid' | 'wordpress' | 'shopify' | 'other'
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report'
  assigned_to?: string
  assigned_admin?: {
    id: string
    name: string
    email: string
  }
  attachments?: {
    id: string
    filename: string
    url: string
    size: number
  }[]
  messages?: TicketMessage[]
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender_type: 'merchant' | 'admin'
  sender_id: string
  sender_name: string
  message: string
  attachments?: {
    id: string
    filename: string
    url: string
  }[]
  created_at: string
}

export interface TicketFilters {
  status?: 'open' | 'closed' | 'pending'
  sender_id?: number
  receiver_id?: number
  store_id?: number
  from?: string
  to?: string
  search?: string
  // Legacy filters for backward compatibility
  priority?: string[]
  category?: string[]
  platform?: string[]
  assigned_to?: string
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Ticket API Service
export class TicketApiService {
  /**
   * Get paginated list of tickets with filters
   */
  static async getTickets(
    page: number = 1,
    perPage: number = 15,
    filters: TicketFilters = {}
  ): Promise<PaginatedResponse<Ticket>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString()
    })

    // Add filters based on backend API structure
    if (filters.status) params.append('status', filters.status)
    if (filters.sender_id) params.append('sender_id', filters.sender_id.toString())
    if (filters.receiver_id) params.append('receiver_id', filters.receiver_id.toString())
    if (filters.store_id) params.append('store_id', filters.store_id.toString())
    if (filters.from) params.append('from', filters.from)
    if (filters.to) params.append('to', filters.to)
    if (filters.search) params.append('search', filters.search)

    // Legacy filters for backward compatibility
    if (filters.priority && filters.priority.length > 0) {
      filters.priority.forEach(p => params.append('priority[]', p))
    }
    if (filters.category && filters.category.length > 0) {
      filters.category.forEach(c => params.append('category[]', c))
    }
    if (filters.platform && filters.platform.length > 0) {
      filters.platform.forEach(p => params.append('platform[]', p))
    }
    if (filters.assigned_to) params.append('assigned_to', filters.assigned_to)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)

    const response: AxiosResponse<ApiResponse<Ticket[]>> = await apiClient.get(
      `/ticket?${params.toString()}`
    )
    
    // Transform response to match expected PaginatedResponse structure
    return {
      data: response.data.data,
      meta: {
        current_page: page,
        last_page: Math.ceil(response.data.data.length / perPage),
        per_page: perPage,
        total: response.data.data.length,
        from: (page - 1) * perPage + 1,
        to: Math.min(page * perPage, response.data.data.length)
      },
      links: {
        first: '',
        last: '',
        prev: null,
        next: null
      }
    }
  }

  /**
   * Get single ticket by ID with messages
   */
  static async getTicket(ticketId: string): Promise<Ticket> {
    const response: AxiosResponse<ApiResponse<Ticket>> = await apiClient.get(
      `/admin/tickets/${ticketId}`
    )
    return response.data.data
  }

  /**
   * Update ticket status
   */
  static async updateTicketStatus(
    ticketId: string,
    status: Ticket['status']
  ): Promise<Ticket> {
    const response: AxiosResponse<ApiResponse<Ticket>> = await apiClient.patch(
      `/admin/tickets/${ticketId}/status`,
      { status }
    )
    return response.data.data
  }

  /**
   * Assign ticket to admin
   */
  static async assignTicket(
    ticketId: string,
    adminId: string
  ): Promise<Ticket> {
    const response: AxiosResponse<ApiResponse<Ticket>> = await apiClient.patch(
      `/admin/tickets/${ticketId}/assign`,
      { assigned_to: adminId }
    )
    return response.data.data
  }

  /**
   * Add message to ticket
   */
  static async addTicketMessage(
    ticketId: string,
    message: string,
    attachments?: File[]
  ): Promise<TicketMessage> {
    const formData = new FormData()
    formData.append('message', message)
    
    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response: AxiosResponse<ApiResponse<TicketMessage>> = await apiClient.post(
      `/admin/tickets/${ticketId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.data
  }

  /**
   * Get ticket statistics for dashboard
   */
  static async getTicketStats(): Promise<{
    total: number
    open: number
    in_progress: number
    resolved: number
    closed: number
    by_priority: Record<string, number>
    by_category: Record<string, number>
    by_platform: Record<string, number>
  }> {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(
      '/admin/tickets/stats'
    )
    return response.data.data
  }

  /**
   * Get list of admins for assignment
   */
  static async getAdmins(): Promise<{
    id: string
    name: string
    email: string
    active_tickets_count: number
  }[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get(
      '/admin/users?role=admin'
    )
    return response.data.data
  }

  /**
   * Export tickets to CSV/Excel
   */
  static async exportTickets(
    format: 'csv' | 'excel',
    filters: TicketFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      )
    })

    const response: AxiosResponse<Blob> = await apiClient.get(
      `/admin/tickets/export?${params.toString()}`,
      {
        responseType: 'blob'
      }
    )
    return response.data
  }
}

// Dashboard API Service
export class DashboardApiService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<{
    merchants: {
      total: number
      active: number
      pending: number
      growth: number
    }
    products: {
      total: number
      published: number
      draft: number
      growth: number
    }
    tokens: {
      total: number
      active: number
      expired: number
      growth: number
    }
    marketScale: {
      totalValue: string
      monthlyGrowth: number
      marketShare: string
      scalabilityIndex: number
    }
  }> {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(
      '/admin/dashboard/stats'
    )
    return response.data.data
  }
}

export default apiClient