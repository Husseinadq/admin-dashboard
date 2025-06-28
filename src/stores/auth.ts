import { defineStore } from 'pinia'
import auth from '@/api/auth'
import type { 
  User, 
  AuthState, 
  LoginResponse, 
  LogoutResponse, 
  ChangePasswordForm, 
  ChangePasswordResponse,
  UserType,
  ApiResponse,
  AuthError
} from '@/types/auth'
import { 
  setAuthToken, 
  removeAuthToken, 
  getAuthToken, 
  getUser, 
  setUser, 
  removeUser, 
  setUserType, 
  getUserType,
  clearAllAuthData,
  setLogoutFlag
} from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: getUser(),
    token: getAuthToken(),
    userType: getUserType(),
  }),
  
  getters: {
    isAuthenticated: (state): boolean => {
      return !!(state.token && state.user)
    },
    
    currentUser: (state): User | null => state.user,
    
    currentUserType: (state): string | null => state.userType,
    
    isAdmin: (state): boolean => {
      return state.userType === 'admin'
    },
    
    isMerchant: (state): boolean => {
      return state.userType === 'merchant'
    }
  },
  
  actions: {
    /**
     * Login user with credentials
     */
    async login(
      email: string, 
      password: string, 
      userType: UserType = 'merchant'
    ): Promise<ApiResponse<LoginResponse['data']>> {
      try {
        const response = await auth.login(email, password)
        
        if (response.data.success) {
          const { user, token, user_type } = response.data.data
          
          // Update store state
          this.user = user
          this.token = token
          this.userType = user_type
          
          // Persist to localStorage
          setUser(user)
          setAuthToken(token)
          setUserType(user_type)
          
          console.log('Login successful:', { user: user.name, type: user_type })
        }
        
        return response.data
      } catch (error: any) {
        console.error('Login error:', error)
        
        // Return structured error response
        const authError: AuthError = {
          message: error.response?.data?.message || 'Login failed',
          code: error.response?.status || 'UNKNOWN_ERROR',
          status: error.response?.status || 500
        }
        
        return {
          success: false,
          data: null as any,
          message: authError.message,
          errors: error.response?.data?.errors
        }
      }
    },
    
    /**
     * Logout current user
     */
    async logout(userType: UserType = 'merchant'): Promise<ApiResponse<LogoutResponse>> {
      try {
        const response = await auth.logout(userType)
        
        if (response.data.success) {
          this.clearAuthData()
          setLogoutFlag()
          console.log('Logout successful')
        }
        
        return {
          success: response.data.success,
          data: response.data,
          message: response.data.message
        }
      } catch (error: any) {
        console.error('Logout error:', error)
        
        // Clear auth data even if API call fails
        this.clearAuthData()
        setLogoutFlag()
        
        return {
          success: false,
          data: { success: false, message: 'Logout failed' },
          message: error.response?.data?.message || 'Logout failed'
        }
      }
    },
    
    /**
     * Change user password
     */
    async changePassword(
      passwordForm: ChangePasswordForm
    ): Promise<ApiResponse<ChangePasswordResponse>> {
      try {
        const response = await auth.changePassword(passwordForm)
        
        if (response.data.success) {
          // Force logout after password change
          this.clearAuthData()
          setLogoutFlag()
          console.log('Password changed successfully, user logged out')
        }
        
        return {
          success: response.data.success,
          data: response.data,
          message: response.data.message
        }
      } catch (error: any) {
        console.error('Change password error:', error)
        
        return {
          success: false,
          data: { success: false },
          message: error.response?.data?.message || 'Password change failed',
          errors: error.response?.data?.errors
        }
      }
    },
    
    /**
     * Clear authentication data
     */
    clearAuthData(): void {
      this.user = null
      this.token = null
      this.userType = null
      clearAllAuthData()
    },
    
    /**
     * Initialize auth state from localStorage
     */
    initializeAuth(): void {
      const token = getAuthToken()
      const user = getUser()
      const userType = getUserType()
      
      if (token && user) {
        this.token = token
        this.user = user
        this.userType = userType
        console.log('Auth state initialized:', { user: user.name, type: userType })
      } else {
        this.clearAuthData()
      }
    },
    
    /**
     * Refresh user data
     */
    async refreshUser(): Promise<void> {
      try {
        if (!this.token) {
          throw new Error('No authentication token available')
        }
        
        const response = await auth.getProfile()
        
        if (response.data.success) {
          this.user = response.data.data
          setUser(response.data.data)
        }
      } catch (error: any) {
        console.error('Refresh user error:', error)
        
        // If token is invalid, clear auth data
        if (error.response?.status === 401) {
          this.clearAuthData()
        }
      }
    }
  },
})