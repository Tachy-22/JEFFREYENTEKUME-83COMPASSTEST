// Pure validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, contains letters and numbers
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const isValidDate = (date: string): boolean => {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime()) && parsedDate > new Date()
}

// Validation result type
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Field-specific validation result
export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

// Real-time field validators
export const validateEmailField = (email: string): FieldValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  return { isValid: true }
}

export const validatePasswordField = (password: string, isLogin = false): FieldValidationResult => {
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' }
  }
  if (!isLogin && !isValidPassword(password)) {
    return { isValid: false, error: 'Password must be at least 8 characters with letters and numbers' }
  }
  return { isValid: true }
}

export const validateNameField = (name: string, fieldName: string): FieldValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  if (!isValidName(name)) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }
  return { isValid: true }
}

// Compose validation functions
export const validateUserRegistration = (data: {
  firstName: string
  lastName: string
  email: string
  password: string
}): ValidationResult => {
  const errors: string[] = []

  if (!isValidName(data.firstName)) {
    errors.push('First name must be at least 2 characters long')
  }

  if (!isValidName(data.lastName)) {
    errors.push('Last name must be at least 2 characters long')
  }

  if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters long and contain letters and numbers')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateLogin = (data: { email: string; password: string }): ValidationResult => {
  const errors: string[] = []

  if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address')
  }

  if (data.password.trim().length === 0) {
    errors.push('Password is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateEvent = (data: {
  eventTitle: string
  description: string
  date: string
  eventType: string
}): ValidationResult => {
  const errors: string[] = []

  if (data.eventTitle.trim().length < 3) {
    errors.push('Event title must be at least 3 characters long')
  }

  if (data.description.trim().length < 10) {
    errors.push('Event description must be at least 10 characters long')
  }

  if (!isValidDate(data.date)) {
    errors.push('Event date must be a valid future date')
  }

  if (data.eventType.trim().length === 0) {
    errors.push('Event type is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}