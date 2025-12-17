import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { authService } from '@/services/auth.service'
import { isAuthenticated } from '@/lib/api-client'
import type { CreateUserRequest, LoginRequest } from '@/types/api'

import { QUERY_KEYS } from '@/utils/query-keys'

// Auth status composable
export const useAuthStatus = () => {
  const authenticated = computed(() => isAuthenticated())
  
  return {
    isAuthenticated: authenticated,
    isGuest: computed(() => !authenticated.value),
  }
}

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => authService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user })
    },
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user })
      queryClient.setQueryData(QUERY_KEYS.auth.user, data.data)
    },
  })
}

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient()
  
  const logout = () => {
    authService.logout()
    queryClient.clear()
    queryClient.invalidateQueries()
  }
  
  return { logout }
}

// Main auth composable
export const useAuth = () => {
  const authStatus = useAuthStatus()
  const register = useRegister()
  const login = useLogin()
  const { logout } = useLogout()
  
  return {
    ...authStatus,
    register,
    login,
    logout,
  }
}