import type { ApiError } from '@/types/api'

// Pure function to extract error messages
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    if ('msg' in error && typeof error.msg === 'string') {
      return error.msg
    }
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }
  return 'An unexpected error occurred'
}

// Pure function to check if error is API error
export const isApiError = (error: unknown): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'success' in error &&
    'msg' in error &&
    error.success === false
  )
}

// Pure function to get error details
export const getErrorDetails = (error: unknown): { message: string; code?: string; details?: unknown } => {
  if (isApiError(error)) {
    return {
      message: error.msg,
      code: typeof error.error === 'string' ? error.error : undefined,
      details: error.details,
    }
  }
  
  return {
    message: getErrorMessage(error),
  }
}