import axios, { type AxiosResponse } from 'axios'
import { getAuthToken } from '@/services/authService'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL:  'https://eejaz-api.trameaz.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
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
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('user_type')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginRequest {
  email: string
  password: string
  userType: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: number
      name: string
      email: string
      role?: string
      avatar?: string
    }
    token: string
    user_type: string
  }
  message?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ChangePasswordResponse {
  success: boolean
  message?: string
}

const auth = {
  /**
   * Login user with credentials
   */
  async login(email: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return apiClient.post('/v1/auth/admin/login', {
      email,
      password
    })
  },

  /**
   * Logout current user
   */
  async logout(userType: string = 'merchant'): Promise<AxiosResponse<LogoutResponse>> {
    return apiClient.post('/auth/logout', {
      user_type: userType,
    })
  },

  /**
   * Change user password
   */
  async changePassword(passwordForm: ChangePasswordRequest): Promise<AxiosResponse<ChangePasswordResponse>> {
    return apiClient.post('/auth/change-password', passwordForm)
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AxiosResponse<{ success: boolean; data: any }>> {
    return apiClient.get('/auth/profile')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AxiosResponse<{ success: boolean; data: { token: string } }>> {
    return apiClient.post('/auth/refresh')
  },

  /**
   * Verify if token is valid
   */
  async verifyToken(): Promise<AxiosResponse<{ success: boolean; data: any }>> {
    return apiClient.get('/auth/verify')
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
    return apiClient.post('/auth/password/reset-request', { email })
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, confirmPassword: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
    return apiClient.post('/auth/password/reset', {
      token,
      password,
      password_confirmation: confirmPassword,
    })
  },
}

export default auth