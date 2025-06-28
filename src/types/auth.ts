/**
 * Authentication Types
 * Defines interfaces and types for authentication-related functionality
 */

export interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
  userType?: UserType
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
    user_type: string
    expires_at?: string
  }
  message?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
}

export interface ChangePasswordForm {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ChangePasswordResponse {
  success: boolean
  message?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  userType: string | null
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface AuthError {
  message: string
  code?: string | number
  status?: number
}

// Type guards
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj === 'object' && 
         typeof obj.id === 'number' && 
         typeof obj.name === 'string' && 
         typeof obj.email === 'string'
}

export const isLoginResponse = (obj: any): obj is LoginResponse => {
  return obj && typeof obj === 'object' && 
         typeof obj.success === 'boolean' && 
         obj.data && isUser(obj.data.user) && 
         typeof obj.data.token === 'string'
}

// Utility types
export type UserRole = 'admin' | 'merchant' | 'user' | 'moderator'
export type UserType = 'merchant' | 'admin' | 'user'
export type AuthAction = 'login' | 'logout' | 'register' | 'changePassword' | 'resetPassword'

// Constants
export const USER_TYPES = {
  MERCHANT: 'merchant',
  ADMIN: 'admin',
  USER: 'user'
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  USER: 'user',
  MODERATOR: 'moderator'
} as const