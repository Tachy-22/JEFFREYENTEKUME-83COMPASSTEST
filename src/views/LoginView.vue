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
      <div class="text-center space-y-2">
        <!-- Login Title -->
        <h1 class="text-white font-medium font-roboto text-lg">
          Login
        </h1>

        <!-- Subtitle -->
        <p class="text-figma-gray font-roboto text-sm">
          Welcome back! Please login to your account
        </p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleLogin" class="space-y-2">
        
        <!-- Email Input -->
        <Input
          :model-value="formValidation.fields.email?.value || ''"
          @update:model-value="(value) => formValidation.handleFieldInput('email', value)"
          @blur="handleEmailBlur"
          type="email"
          placeholder="Email"
          :icon="Mail"
          :disabled="login.isPending.value"
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
          :disabled="login.isPending.value"
          :error="formValidation.fields.password?.error || null"
          :show-error="formValidation.fields.password?.touched || false"
        />

        <!-- Forgot Password Link -->
        <div class="text-left -mt-4">
          <button 
            type="button" 
            class="text-figma-gray hover:text-white text-xs font-roboto transition-colors duration-200"
            @click="handleForgotPassword"
          >
            Forgot password
          </button>
        </div>

        <!-- Login Button -->
        <Button 
          type="submit"
          :disabled="login.isPending.value"
          :loading="login.isPending.value"
          variant="primary"
        >
          {{ login.isPending.value ? 'Logging in...' : 'Login' }}
        </Button>

        <!-- Remember Me -->
        <div class="flex items-center gap-2">
          <input 
            v-model="form.rememberMe"
            type="checkbox" 
            id="remember-me" 
            class="w-4 h-4 text-figma-orange bg-transparent border-figma-gray rounded focus:ring-figma-orange focus:ring-2"
          />
          <label for="remember-me" class="text-figma-gray text-sm font-roboto">
            Remember me
          </label>
        </div>
      </form>

      <!-- Register Link -->
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 text-sm font-roboto">
          <span class="text-figma-gray">
            Don't have an account?
          </span>
          <router-link 
            to="/register" 
            class="text-figma-orange hover:text-figma-orange/80 font-semibold transition-colors duration-200"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { Mail, Lock } from 'lucide-vue-next'
import { Input, Button } from '@/components/ui'
import { useAuth } from '@/composables/useAuth'
import { getErrorMessage } from '@/utils/error-handler'
import { useFormValidation } from '@/composables/useFormValidation'
import { validateEmailField, validatePasswordField } from '@/utils/validators'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
  rememberMe: false,
})

// Setup form validation
const formValidation = useFormValidation(['email', 'password'])

// Real-time validation handlers
const handleEmailBlur = () => {
  formValidation.handleFieldBlur('email')
  formValidation.validateField('email', (value) => validateEmailField(value))
}

const handlePasswordBlur = () => {
  formValidation.handleFieldBlur('password')
  formValidation.validateField('password', (value) => validatePasswordField(value, true))
}

// Watch for real-time validation
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
      formValidation.validateField('password', (value) => validatePasswordField(value, true))
    }
  }
)

const handleLogin = async () => {
  // Validate all fields
  const emailValid = formValidation.validateField('email', (value) => validateEmailField(value))
  const passwordValid = formValidation.validateField('password', (value) => validatePasswordField(value, true))
  
  // Mark fields as touched to show errors
  formValidation.handleFieldBlur('email')
  formValidation.handleFieldBlur('password')
  
  if (!emailValid || !passwordValid) {
    return
  }

  const formData = formValidation.getFormValues()

  try {
    await login.mutateAsync({
      email: formData.email || '',
      password: formData.password || '',
    })
    
    toast.success('Login successful! Redirecting...', {
      position: 'top-right',
      autoClose: 2000,
    })
    
    // Handle remember me functionality if needed
    if (form.rememberMe) {
      // Store preference in localStorage
      localStorage.setItem('rememberMe', 'true')
    }
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    toast.error(errorMessage || 'Login failed. Please check your credentials.', {
      position: 'top-right',
      autoClose: 4000,
    })
   // console.error('Login failed:', error)
  }
}

const handleForgotPassword = () => {
  toast.info('Forgot password functionality will be implemented soon.', {
    position: 'top-right',
    autoClose: 3000,
  })
}
</script>