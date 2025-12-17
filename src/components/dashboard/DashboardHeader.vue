<template>
  <header class="w-screen h-18.75 py-4 bg-dashboard-card fixed top-0 left-0 right-0 z-40">
    <div class="relative flex h-full px-4 sm:px-4 items-center gap-12">
      <!-- Brand Logo -->
      <div class="flex items-center gap-2 shrink-0 z-10">
        <img src="/src/assets/svgs/logo.svg" alt="TBUD Logo" class="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
        <span class="text-white font-bold text-lg sm:text-xl font-lato">TBUD</span>
      </div>

      <!-- Main Content -->
      <div class="flex items-center justify-between w-full h-13.75 bg-dashboard-card rounded-md px-0 -ml-30 sm:-ml-36 lg:-ml-32 pl-20 sm:pl-24 lg:pl-32 pl">
        <!-- Welcome Message -->
        <div class="flex items-center gap-1 sm:gap-1.5 ml-0 sm:ml-4">
          <h1 class="text-white font-bold text-xs lg:text-lg font-lato">
            <span class="inline">Good Morning </span>{{ userStore.fullName || 'John' }}
          </h1>
          <span class="text-lg sm:text-xl">👋</span>
        </div>

        <!-- User Profile Section -->
        <div class="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4">
          <!-- Theme Toggle -->
          <button class="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-figma-orange transition-colors hidden sm:block">
            <Sun class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <!-- Notifications -->
          <button class="relative w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-figma-orange transition-colors">
            <Bell class="w-4 h-4 sm:w-5 sm:h-5" />
            <div class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
          </button>

          <!-- Profile Dropdown -->
          <div class="flex items-center gap-2 sm:gap-4">
            <div class="flex items-center gap-1.5 sm:gap-3">
              <!-- Avatar or Initials -->
              <div class="w-8 h-8 sm:w-10 sm:h-11 rounded-full overflow-hidden">
                <img
                  src="/images/avatar.png"
                  :alt="userStore.fullName"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- <div v-else class="w-8 h-8 sm:w-10 sm:h-11 bg-figma-orange rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-xs sm:text-sm">
                  {{ userStore.initials || 'U' }}
                </span>
              </div> -->
              
              <div class="hidden md:flex md:flex-col gap-0.5">
                <span class="text-white font-semibold text-sm font-lato">
                  {{ userStore.fullName || 'John Doe' }}
                </span>
                <span class="text-dashboard-text-primary text-xs font-open-sans">
                  {{ userStore.role || 'Admin' }}
                </span>
              </div>
            </div>
            <button class="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-figma-orange transition-colors">
              <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Bell, ChevronDown, Sun } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { getAuthToken } from '@/lib/api-client'

const userStore = useUserStore()

onMounted(async () => {
  console.log('Header mounted, fetching user data...')
  console.log('Current user:', userStore.user)
  console.log('Has token:', !!getAuthToken())
  
  // Fetch user data when component mounts
  await userStore.fetchCurrentUser()
  
  console.log('After fetch - user:', userStore.user)
  console.log('After fetch - error:', userStore.error)
})

// Watch for user changes
watch(() => userStore.user, (newUser) => {
  console.log('User changed:', newUser)
}, { deep: true })

watch(() => userStore.error, (newError) => {
  console.log('User store error:', newError)
})
</script>