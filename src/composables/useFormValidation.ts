import { reactive, computed } from 'vue'
import type { FieldValidationResult } from '@/utils/validators'

export interface FormField {
  value: string
  error: string | null
  touched: boolean
  hasError: boolean
}

export function useFormValidation(initialFields: string[]) {
  // Create reactive form fields
  const fields = reactive<Record<string, FormField>>(
    initialFields.reduce((acc, fieldName) => {
      acc[fieldName] = {
        value: '',
        error: null,
        touched: false,
        hasError: false
      }
      return acc
    }, {} as Record<string, FormField>)
  )

  // Track form-level validation state
  const isValid = computed(() => {
    return Object.values(fields).every(field => !field.hasError && field.value.trim() !== '')
  })

  const hasErrors = computed(() => {
    return Object.values(fields).some(field => field.hasError)
  })

  // Validate a specific field
  const validateField = (fieldName: string, validator: (value: string) => FieldValidationResult): boolean => {
    const field = fields[fieldName]
    if (!field) return false

    const result = validator(field.value)
    field.hasError = !result.isValid
    field.error = result.error || null

    return result.isValid
  }

  // Handle field blur
  const handleFieldBlur = (fieldName: string) => {
    const field = fields[fieldName]
    if (field) {
      field.touched = true
    }
  }

  // Handle field input
  const handleFieldInput = (fieldName: string, value: string) => {
    const field = fields[fieldName]
    if (field) {
      field.value = value
      
      // Clear error if user starts typing in an invalid field
      if (field.hasError && value.trim() !== '') {
        field.error = null
        field.hasError = false
      }
    }
  }

  // Set field error manually
  const setFieldError = (fieldName: string, error: string) => {
    const field = fields[fieldName]
    if (field) {
      field.error = error
      field.hasError = true
    }
  }

  // Clear all errors
  const clearErrors = () => {
    Object.values(fields).forEach(field => {
      field.error = null
      field.hasError = false
    })
  }

  // Reset form
  const resetForm = () => {
    Object.values(fields).forEach(field => {
      field.value = ''
      field.error = null
      field.hasError = false
      field.touched = false
    })
  }

  // Get form values as object
  const getFormValues = () => {
    const values: Record<string, string> = {}
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      if (field) {
        values[fieldName] = field.value
      }
    })
    return values
  }

  return {
    fields,
    isValid,
    hasErrors,
    validateField,
    handleFieldBlur,
    handleFieldInput,
    setFieldError,
    clearErrors,
    resetForm,
    getFormValues
  }
}