import { post, get, setAuthToken, clearAuthToken, isAuthenticated, setRefreshToken } from '@/lib/api-client'
import type {
  User,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  ApiResponse,
} from '@/types/api'

// Pure functions for authentication operations
export const register = async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
  return post<User, CreateUserRequest>('/user/register', userData)
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await post<User, LoginRequest>('/user/login', credentials) as LoginResponse
  
  if (response.success && response.token) {
    setAuthToken(response.token)
    
    // Store refresh token if provided
    if ('refresh_token' in response && response.refresh_token) {
      setRefreshToken(response.refresh_token)
    }
  }
  
  return response
}

export const logout = (): void => {
  clearAuthToken()
}

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  // Try common user endpoints - the API might use a different path
  return get<User>('/user/me')
}

export const checkAuthStatus = (): boolean => {
  return isAuthenticated()
}

// Compose authentication functions
export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  checkAuthStatus,
} as const