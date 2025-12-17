<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { User, Mail, Lock } from 'lucide-vue-next'
import { Input, Button } from '@/components/ui'
import { useAuth } from '@/composables/useAuth'
import { getErrorMessage } from '@/utils/error-handler'
import { useFormValidation } from '@/composables/useFormValidation'
import { validateEmailField, validatePasswordField, validateNameField } from '@/utils/validators'

const router = useRouter()
const { register } = useAuth()

// Setup form validation
const formValidation = useFormValidation(['firstName', 'lastName', 'email', 'password'])

// Real-time validation handlers
const handleFirstNameBlur = () => {
  formValidation.handleFieldBlur('firstName')
  formValidation.validateField('firstName', (value) => validateNameField(value, 'First name'))
}

const handleLastNameBlur = () => {
  formValidation.handleFieldBlur('lastName')
  formValidation.validateField('lastName', (value) => validateNameField(value, 'Last name'))
}

const handleEmailBlur = () => {
  formValidation.handleFieldBlur('email')
  formValidation.validateField('email', (value) => validateEmailField(value))
}

const handlePasswordBlur = () => {
  formValidation.handleFieldBlur('password')
  formValidation.validateField('password', (value) => validatePasswordField(value))
}

// Watch for real-time validation
watch(
  () => formValidation.fields.firstName?.value,
  (newValue) => {
    if (formValidation.fields.firstName?.touched && newValue) {
      formValidation.validateField('firstName', (value) => validateNameField(value, 'First name'))
    }
  }
)

watch(
  () => formValidation.fields.lastName?.value,
  (newValue) => {
    if (formValidation.fields.lastName?.touched && newValue) {
      formValidation.validateField('lastName', (value) => validateNameField(value, 'Last name'))
    }
  }
)

watch(
  () => formValidation.fields.email?.value,
  (newValue) => {
    if (formValidation.fields.email?.touched && newValue) {
      formValidation.validateField('email', (value) => validateEmailField(value))
    }
  }
)

watch(
  () => formValidation.fields.password?.value,
  (newValue) => {
    if (formValidation.fields.password?.touched && newValue) {
      formValidation.validateField('password', (value) => validatePasswordField(value))
    }
  }
)

const handleRegister = async () => {
  // Validate all fields
  const firstNameValid = formValidation.validateField('firstName', (value) => validateNameField(value, 'First name'))
  const lastNameValid = formValidation.validateField('lastName', (value) => validateNameField(value, 'Last name'))
  const emailValid = formValidation.validateField('email', (value) => validateEmailField(value))
  const passwordValid = formValidation.validateField('password', (value) => validatePasswordField(value))
  
  // Mark fields as touched to show errors
  formValidation.handleFieldBlur('firstName')
  formValidation.handleFieldBlur('lastName')
  formValidation.handleFieldBlur('email')
  formValidation.handleFieldBlur('password')
  
  if (!firstNameValid || !lastNameValid || !emailValid || !passwordValid) {
    return
  }

  const formData = formValidation.getFormValues()
  
  try {
    await register.mutateAsync({
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      password: formData.password || '',
    })
    toast.success('Account created successfully! Redirecting to login...', {
      position: 'top-right',
      autoClose: 2000,
    })
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    toast.error(errorMessage || 'Registration failed. Please try again.', {
      position: 'top-right',
      autoClose: 4000,
    })
   // console.error('Registration failed:', error)
  }
}
</script>

<template>
  <!-- Main Container with Background -->
  <div 
    class="min-h-screen w-full flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/auth-background.avif');"
  >
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-figma-gradient"></div>
    
    <!-- Logo -->
      <div class="absolute z-10 top-4 left-4 w-10 h-10">
        <img src="/src/assets/svgs/logo.svg" alt="Logo" class="w-full h-full object-contain" />
      </div>
   
      <!-- Form Container -->
    <div class="w-full max-w-95 bg-white/10 backdrop-blur-sm shadow-lg rounded-md p-6 space-y-6 relative z-10">
      
     
      
      <!-- Header Section -->
      <div class="text-center space-y-2 pt-">
        <!-- Register Title -->
        <h1 class="text-white font-medium font-roboto text-lg">
          Register
        </h1>

        <!-- Subtitle -->
        <p class="text-figma-gray font-roboto text-sm">
          Kindly fill out this form to Register
        </p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleRegister" class="space-y-2">
        
        <!-- First Name Input -->
        <Input
          :model-value="formValidation.fields.firstName?.value || ''"
          @update:model-value="(value) => formValidation.handleFieldInput('firstName', value)"
          @blur="handleFirstNameBlur"
          type="text"
          placeholder="First Name"
          :icon="User"
          :disabled="register.isPending.value"
          :error="formValidation.fields.firstName?.error || null"
          :show-error="formValidation.fields.firstName?.touched || false"
        />

        <!-- Last Name Input -->
        <Input
          :model-value="formValidation.fields.lastName?.value || ''"
          @update:model-value="(value) => formValidation.handleFieldInput('lastName', value)"
          @blur="handleLastNameBlur"
          type="text"
          placeholder="Last Name"
          :icon="User"
          :disabled="register.isPending.value"
          :error="formValidation.fields.lastName?.error || null"
          :show-error="formValidation.fields.lastName?.touched || false"
        />

        <!-- Email Input -->
        <Input
          :model-value="formValidation.fields.email?.value || ''"
          @update:model-value="(value) => formValidation.handleFieldInput('email', value)"
          @blur="handleEmailBlur"
          type="email"
          placeholder="Email"
          :icon="Mail"
          :disabled="register.isPending.value"
          :error="formValidation.fields.email?.error || null"
          :show-error="formValidation.fields.email?.touched || false"
        />

        <!-- Password Input -->
        <Input
          :model-value="formValidation.fields.password?.value || ''"
          @update:model-value="(value) => formValidation.handleFieldInput('password', value)"
          @blur="handlePasswordBlur"
          type="password"
          placeholder="Password"
          :icon="Lock"
          :disabled="register.isPending.value"
          :error="formValidation.fields.password?.error || null"
          :show-error="formValidation.fields.password?.touched || false"
        />

        <!-- Create Account Button -->
        <Button 
          type="submit"
          :disabled="register.isPending.value"
          :loading="register.isPending.value"
          size="md"
          variant="primary"
        >
          {{ register.isPending.value ? 'Creating...' : 'Create Account' }}
        </Button>

      </form>

      <!-- Login Link - Outside form -->
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 text-sm font-roboto">
          <span class="text-figma-gray">
            Already have an account?
          </span>
          <router-link 
            to="/login" 
            class="text-figma-orange hover:text-figma-orange/80 font-semibold transition-colors duration-200"
          >
            Login
          </router-link>
        </div>
      </div>
    </div>

 
  </div>
</template>