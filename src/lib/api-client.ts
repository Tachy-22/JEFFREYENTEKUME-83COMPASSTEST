import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import type { ApiResponse, ApiError } from '@/types/api'

const AUTH_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Encryption utilities for fallback storage
const ENCRYPTION_KEY = 'secure_key_for_token_storage'

const encryptData = (data: string): string => {
  try {
    // Simple encryption - in production, use a proper encryption library like crypto-js
    const encoded = btoa(data + ENCRYPTION_KEY)
    return encoded
  } catch {
    return data
  }
}

const decryptData = (encryptedData: string): string => {
  try {
    const decoded = atob(encryptedData)
    return decoded.replace(ENCRYPTION_KEY, '')
  } catch {
    return encryptedData
  }
}

// Cookie utilities for secure storage
const setCookie = (name: string, value: string, options: {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  maxAge?: number
} = {}) => {
  const { 
    httpOnly = true, 
    secure = window.location.protocol === 'https:', 
    sameSite = 'Strict',
    maxAge = 7 * 24 * 60 * 60 // 7 days
  } = options
  
  let cookieString = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}`
  
  if (secure) {
    cookieString += '; Secure'
  }
  
  // Note: httpOnly cannot be set via JavaScript for security reasons
  // This would need to be set by the server
  document.cookie = cookieString
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Secure token management functions
export const getAuthToken = (): string | null => {
  // Try to get token from secure cookie first
  const cookieToken = getCookie(AUTH_TOKEN_KEY)
  if (cookieToken) {
    return cookieToken
  }
  
  // Fallback to encrypted sessionStorage (more secure than localStorage)
  const encryptedToken = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (encryptedToken) {
    return decryptData(encryptedToken)
  }
  
  // Last fallback to localStorage for backward compatibility (will be migrated)
  const legacyToken = localStorage.getItem(AUTH_TOKEN_KEY)
  if (legacyToken) {
    // Migrate to secure storage and remove from localStorage
    setAuthToken(legacyToken)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return legacyToken
  }
  
  return null
}

export const setAuthToken = (token: string): void => {
  // Primary: Set secure cookie (this would ideally be set by the server)
  setCookie(AUTH_TOKEN_KEY, token, {
    secure: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 // 24 hours
  })
  
  // Fallback: Store encrypted in sessionStorage
  const encryptedToken = encryptData(token)
  sessionStorage.setItem(AUTH_TOKEN_KEY, encryptedToken)
  
  // Remove any legacy localStorage token
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const clearAuthToken = (): void => {
  // Clear cookie
  removeCookie(AUTH_TOKEN_KEY)
  
  // Clear sessionStorage
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  
  // Clear any legacy localStorage token
  localStorage.removeItem(AUTH_TOKEN_KEY)
  
  // Clear refresh token if exists
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
}

// Refresh token management
export const getRefreshToken = (): string | null => {
  const cookieToken = getCookie(REFRESH_TOKEN_KEY)
  if (cookieToken) {
    return cookieToken
  }
  
  const encryptedToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
  return encryptedToken ? decryptData(encryptedToken) : null
}

export const setRefreshToken = (token: string): void => {
  setCookie(REFRESH_TOKEN_KEY, token, {
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
  
  const encryptedToken = encryptData(token)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, encryptedToken)
}

export const isAuthenticated = (): boolean => Boolean(getAuthToken())

// Error handling function
const handleError = (error: AxiosError<ApiError>): ApiError => {
  if (error.response) {
    const apiError = error.response.data
    if (error.response.status === 401) {
      clearAuthToken()
    }
    return {
      success: false,
      msg: apiError?.msg || 'An error occurred',
      error: apiError?.error || error.message,
      details: apiError,
    }
  }

  if (error.request) {
    return {
      success: false,
      msg: 'Network error. Please check your internet connection.',
      error: 'NETWORK_ERROR',
    }
  }

  return {
    success: false,
    msg: error.message || 'An unexpected error occurred',
    error: 'UNKNOWN_ERROR',
  }
}

// Request interceptor function
const addAuthHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

// Create axios instance with functional setup
const createApiInstance = (baseURL = env.apiBaseUrl): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Setup interceptors
  instance.interceptors.request.use(
    (config) => {
      const configWithAuth = addAuthHeader(config)
      // console.log('Final request config:', {
      //   url: configWithAuth.url,
      //   method: configWithAuth.method,
      //   headers: configWithAuth.headers,
      //   baseURL: configWithAuth.baseURL
      // })
      return configWithAuth
    },
    (error) => Promise.reject(handleError(error))
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    async (error: AxiosError<ApiError>) => Promise.reject(await handleErrorWithRefresh(error))
  )

  return instance
}

// Create the api instance
const api = createApiInstance()

// HTTP method functions
export const get = async <T>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.get<ApiResponse<T>>(url, config)
  return response.data
}

export const post = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.post<ApiResponse<T>>(url, data, config)
  return response.data
}

export const put = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.put<ApiResponse<T>>(url, data, config)
  return response.data
}

export const patch = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.patch<ApiResponse<T>>(url, data, config)
  return response.data
}

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.delete<ApiResponse<T>>(url, config)
  return response.data
}

// Token refresh functionality
const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return false
    }
    
    const response = await axios.post(`${env.apiBaseUrl}/auth/refresh`, {
      refresh_token: refreshToken
    })
    
    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token)
      if (response.data.refresh_token) {
        setRefreshToken(response.data.refresh_token)
      }
      return true
    }
    
    return false
  } catch {
    clearAuthToken()
    return false
  }
}

// Enhanced error handling with token refresh
const handleErrorWithRefresh = async (error: AxiosError<ApiError>): Promise<ApiError> => {
  if (error.response?.status === 401) {
    // Try to refresh the token
    const refreshed = await refreshAuthToken()
    if (refreshed && error.config) {
      // Retry the original request with new token
      try {
        const retryResponse = await axios.request(error.config)
        return retryResponse.data
      } catch {
        // If retry fails, clear tokens and return error
        clearAuthToken()
      }
    } else {
      clearAuthToken()
    }
  }
  
  return handleError(error)
}

// Export all api functions as a single object for convenience
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  setAuthToken,
  clearAuthToken,
  isAuthenticated,
  getRefreshToken,
  setRefreshToken,
  refreshAuthToken,
}