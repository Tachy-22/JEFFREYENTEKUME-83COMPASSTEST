import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { QueryClient } from '@tanstack/vue-query'
import type { App } from 'vue'

// Create query client with functional configuration
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors except 408, 429
          if (error && typeof error === 'object' && 'response' in error) {
            const status = (error as { response?: { status?: number } }).response?.status
            if (status && status >= 400 && status < 500 && ![408, 429].includes(status)) {
              return false
            }
          }
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry mutations on client errors
          if (error && typeof error === 'object' && 'response' in error) {
            const status = (error as { response?: { status?: number } }).response?.status
            if (status && status >= 400 && status < 500) {
              return false
            }
          }
          return failureCount < 1
        },
      },
    },
  })
}

// Install Vue Query plugin
export const installVueQuery = (app: App): void => {
  const queryClient = createQueryClient()
  
  const vueQueryOptions: VueQueryPluginOptions = {
    queryClient,
  }

  app.use(VueQueryPlugin, vueQueryOptions)
}

// Export query client instance
export const queryClient = createQueryClient()