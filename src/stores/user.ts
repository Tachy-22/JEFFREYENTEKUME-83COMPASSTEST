import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser } from '@/services/auth.service'
import { getAuthToken, clearAuthToken } from '@/lib/api-client'
import type { User } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value && !!getAuthToken())

  const fetchCurrentUser = async () => {
    console.log('fetchCurrentUser called')
    const token = getAuthToken()
    console.log('Token exists:', !!token)
    
    if (!token) {
      error.value = 'No authentication token found'
      console.log('No token found, aborting')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('Making API call to get current user...')
      const response = await getCurrentUser()
      console.log('API response:', response)
      user.value = response.data
      console.log('User set to:', user.value)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      error.value = errorMessage
      console.error('Failed to fetch current user:', err)
      console.error('Error details:', err)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    clearAuthToken()
    error.value = null
  }

  const setUser = (userData: User) => {
    user.value = userData
    error.value = null
  }

  // Computed getters for user properties
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
  })

  const initials = computed(() => {
    if (!user.value) return ''
    const first = user.value.firstName?.[0] || ''
    const last = user.value.lastName?.[0] || ''
    return `${first}${last}`.toUpperCase()
  })

  const avatar = computed(() => {
    return user.value?.avatar || null
  })

  const email = computed(() => {
    return user.value?.email || ''
  })

  const role = computed(() => {
    return user.value?.role || ''
  })

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    fullName,
    initials,
    avatar,
    email,
    role,
    
    // Actions
    fetchCurrentUser,
    logout,
    setUser
  }
})