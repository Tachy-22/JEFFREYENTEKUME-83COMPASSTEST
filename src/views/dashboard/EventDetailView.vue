<template>
  <!-- Loading State -->
  <EventDetailSkeleton v-if="isLoading" />

  <!-- Content -->
  <div v-else class="py-3 sm:py-4 px-3 sm:px-4 lg:px-4 lg:pr-6 space-y-3 sm:space-y-4">
    <!-- Page Title -->
    <div>
      <h1 class="text-white font-bold text-5.25 leading-[120%] font-lato">Events</h1>
    </div>

    <!-- Action Buttons Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
      >
        <ChevronLeft class="w-3 h-3" />
        <span class="font-open-sans font-semibold text-xs">Back</span>
      </button>

      <!-- Add Employee Button -->
      <button class="bg-figma-orange text-white px-2 sm:px-3 py-1.5 rounded-sm flex items-center gap-1.5 hover:bg-figma-orange/90 transition-colors text-xs sm:text-sm">
        <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
        <span class="font-open-sans font-semibold">Add Employee</span>
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-11 gap-3 sm:gap-4">
      <!-- Event Image Column (4/10) -->
      <div class="lg:col-span-5 flex flex-col order-1">
        <!-- Event Image and Description Container -->
        <div class="w-full h-fit bg-dashboard-card-content rounded-[1.5px] flex flex-col">
          <!-- Event Hero Image -->
          <div class="relative w-full h-40 sm:h-48 lg:h-[188.25px] bg-gray-800 rounded-t-[1.5px] overflow-hidden">
            <img 
              :src="event?.image || '/src/assets/images/auth-background.avif'" 
              :alt="event?.title"
              class="w-full h-full object-cover"
            />
            <!-- Event Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 h-[27.75px] bg-black/20 flex items-center px-2.25">
              <h2 class="font-inter font-semibold text-[13.5px] text-white">
                {{ event?.title || 'Dinner Night' }}
              </h2>
            </div>
          </div>

          <!-- Event Description -->
          <div class="flex-1 p-3 sm:p-4 lg:p-4.5 flex items-start">
            <p class="text-dashboard-text-primary font-open-sans text-xs sm:text-sm lg:text-xs leading-4 sm:leading-5 lg:leading-4">
              {{ event?.fullDescription || 'Join us for an elegant Dinner Night, where gourmet cuisine meets a warm, inviting atmosphere. With a carefully curated menu featuring exquisite dishes, each course promises to delight every palate. Whether you\'re celebrating a special occasion or enjoying a refined evening out, this event offers the perfect blend of great food, fine wine, and ambiance. Beyond the cuisine, Dinner Night is about creating memorable moments with friends, family, and loved ones. With soft music, candlelit tables, and impeccable service, it\'s more than just a meal—it\'s an experience designed to help you unwind, connect, and make lasting memories.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Event Details Panel (3/10) -->
      <div class="lg:col-span-3 order-2">
        <div class="bg-dashboard-card-content rounded h-fit py-3 sm:py-4 flex flex-col">
          <!-- DETAILS Header -->
          <div class=" pl-2.25">
            <h3 class="text-figma-orange font-lato font-bold text-sm leading-[120%]">
              DETAILS
            </h3>
          </div>
          
          <!-- Details Content -->
          <div class="flex-1 py-3 sm:py-4 pl-3 sm:pl-3.5 flex flex-col justify-start">
            <!-- Date Row -->
            <div class="flex items-start mb-4 sm:mb-6.75">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21 shrink-0">
                Date:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ formatEventDate(event?.date) }}
              </span>
            </div>
            
            <!-- Time Row -->
            <div class="flex items-start mb-4 sm:mb-6.75">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21.25 shrink-0">
                Time:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ event?.time || '8:00pm - 11:00pm' }}
              </span>
            </div>
            
            <!-- Organizer Row -->
            <div class="flex items-start mb-4 sm:mb-6.5">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21 shrink-0">
                Organizer:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ event?.organizer || 'Selena Sanchez (Human Resources)' }}
              </span>
            </div>
            
            <!-- Type Row -->
            <div class="flex items-start mb-4 sm:mb-6.75">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21.25 shrink-0">
                Type:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ event?.type || 'Evening Soirée' }}
              </span>
            </div>
            
            <!-- Location Row -->
            <div class="flex items-start mb-4 sm:mb-6.75">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21 shrink-0">
                Location:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ event?.location || 'Office Lounge' }}
              </span>
            </div>
            
            <!-- Department Row -->
            <div class="flex items-start">
              <span class="text-dashboard-text-secondary font-open-sans text-xs leading-4 w-16 sm:w-21 shrink-0">
                Department:
              </span>
              <span class="text-dashboard-text-primary font-open-sans text-xs leading-4">
                {{ event?.department || 'All Department' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Registered Users Panel (3/10) -->
      <div class="lg:col-span-3 order-3">
        <div class="bg-dashboard-card-content rounded max-h-80 sm:max-h-110.75 h-fit flex flex-col">
          <!-- REGISTERED USERS Header -->
          <div class="pt-2 sm:pt-2.75 pl-2 sm:pl-2.75">
            <h3 class="text-figma-orange font-lato font-bold text-sm leading-[120%]">
              REGISTERED USERS
            </h3>
          </div>
          
          <!-- Users List Container -->
          <div class="flex-1 pt-4 sm:pt-6.5 pl-1 sm:pl-1.25 pr-1 sm:pr-1.25">
            <div class="flex flex-col items-start p-1.5 sm:p-2 gap-3 sm:gap-5.25 max-h-60 sm:max-h-98 overflow-y-auto">
              <!-- No users message -->
              <div 
                v-if="registeredUsers.length === 0"
                class="text-dashboard-text-secondary font-open-sans text-sm text-center w-full py-8"
              >
                No users registered yet
              </div>
              <!-- Registered users list -->
              <div 
                v-for="(user, index) in registeredUsers" 
                :key="`${user}-${index}`"
                class="text-dashboard-text-primary font-open-sans text-sm leading-4.75 w-full shrink-0"
              >
                {{ index + 1 }}. {{ user }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Plus } from 'lucide-vue-next'
import { useEvent } from '@/composables/useEvents'
import EventDetailSkeleton from '@/components/ui/EventDetailSkeleton.vue'

const route = useRoute()
const router = useRouter()

// Get real event data from composable
const eventId = computed(() => route.params.id as string)
const { event: apiEvent, isLoading, isError } = useEvent(eventId.value)

// Transform API event data for the view
const event = computed(() => {
  if (!apiEvent.value) return null
  
  const eventDate = new Date(apiEvent.value.date)
  
  // Extract organizer info from createdBy
  const organizer = apiEvent.value.createdBy && typeof apiEvent.value.createdBy === 'object' 
    ? `${apiEvent.value.createdBy.firstName} ${apiEvent.value.createdBy.lastName} (Human Resources)`
    : 'Event Organizer (Human Resources)'
  
  return {
    id: apiEvent.value._id,
    title: apiEvent.value.eventTitle,
    date: eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    time: eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    organizer,
    type: apiEvent.value.eventType,
    location: 'Office Lounge', // Default location since not in API
    department: 'All Department', // Default department since not in API
    image: apiEvent.value.image || '/src/assets/images/auth-background.avif',
    fullDescription: apiEvent.value.description
  }
})

// Real registered users from API
const registeredUsers = computed(() => {
  if (!apiEvent.value || !Array.isArray(apiEvent.value.registeredUsers)) return []
  
  return apiEvent.value.registeredUsers.map((user, index) => {
    // Handle both populated user objects and string IDs
    if (typeof user === 'string') {
      return `User ${index + 1}` // Fallback for string IDs
    }
    return `${user.firstName} ${user.lastName}`
  })
})

const formatEventDate = (date: string | undefined) => {
  return date || 'Loading...'
}

const goBack = () => {
  router.push('/dashboard/events')
}

// Handle loading and error states
if (isError.value) {
  router.push('/dashboard/events')
}
</script>