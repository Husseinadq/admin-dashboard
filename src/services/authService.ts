/**
 * Authentication Service
 * Handles localStorage operations for authentication data
 */

export interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string
}

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user'
const USER_TYPE_KEY = 'user_type'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Token Management
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error setting auth token:', error)
  }
}

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Error removing auth token:', error)
  }
}

/**
 * Refresh Token Management
 */
export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error setting refresh token:', error)
  }
}

export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

export const removeRefreshToken = (): void => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Error removing refresh token:', error)
  }
}

/**
 * User Data Management
 */
export const setUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('Error setting user data:', error)
  }
}

export const getUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Error removing user data:', error)
  }
}

/**
 * User Type Management
 */
export const setUserType = (userType: string): void => {
  try {
    localStorage.setItem(USER_TYPE_KEY, userType)
  } catch (error) {
    console.error('Error setting user type:', error)
  }
}

export const getUserType = (): string | null => {
  try {
    return localStorage.getItem(USER_TYPE_KEY)
  } catch (error) {
    console.error('Error getting user type:', error)
    return null
  }
}

export const removeUserType = (): void => {
  try {
    localStorage.removeItem(USER_TYPE_KEY)
  } catch (error) {
    console.error('Error removing user type:', error)
  }
}

/**
 * Authentication State Helpers
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  const user = getUser()
  return !!(token && user)
}

export const clearAllAuthData = (): void => {
  removeAuthToken()
  removeRefreshToken()
  removeUser()
  removeUserType()
  
  // Clear any other auth-related data
  try {
    localStorage.removeItem('trameazai-logout')
  } catch (error) {
    console.error('Error clearing additional auth data:', error)
  }
}

/**
 * Token Validation
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

export const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('Error parsing token payload:', error)
    return null
  }
}

/**
 * Session Management
 */
export const initializeAuthState = (): { isAuthenticated: boolean; user: User | null; token: string | null } => {
  const token = getAuthToken()
  const user = getUser()
  
  // Check if token is expired
  if (token && isTokenExpired(token)) {
    clearAllAuthData()
    return { isAuthenticated: false, user: null, token: null }
  }
  
  return {
    isAuthenticated: !!(token && user),
    user,
    token
  }
}

/**
 * Logout flag management (for cross-tab logout)
 */
export const setLogoutFlag = (): void => {
  try {
    localStorage.setItem('trameazai-logout', 'true')
  } catch (error) {
    console.error('Error setting logout flag:', error)
  }
}

export const getLogoutFlag = (): boolean => {
  try {
    return localStorage.getItem('trameazai-logout') === 'true'
  } catch (error) {
    console.error('Error getting logout flag:', error)
    return false
  }
}

export const clearLogoutFlag = (): void => {
  try {
    localStorage.removeItem('trameazai-logout')
  } catch (error) {
    console.error('Error clearing logout flag:', error)
  }
}

/**
 * Cross-tab logout detection
 */
export const setupCrossTabLogout = (callback: () => void): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'trameazai-logout' && event.newValue === 'true') {
      callback()
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}