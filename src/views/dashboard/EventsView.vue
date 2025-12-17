<template>
  <div class="py-3 sm:py-2 px-3 sm:px-1 lg:px-3 lg:pr-6 space-y-6 sm:space-y-7">
    <!-- Events Header -->
    <div>
      <h1 class="text-white font-bold text-lg leading-4.75 font-lato">Events</h1>
    </div>

    <!-- Search and Actions Bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-3 max-w-full lg:max-w-[96%]">
      <!-- Search Input -->
      <div class="flex items-center bg-dashboard-card rounded px-2.25 py-2.5 w-full sm:max-w-150 gap-[2.5">
        <Search class="w-3.75 h-3.75 text-dashboard-text-secondary" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Events"
          class="flex-1 bg-transparent border-none outline-none text-dashboard-text-secondary placeholder:text-dashboard-text-secondary font-open-sans text-[12px]"
        />
      </div>

      <!-- Filter and Add Button Container -->
      <div class="flex items-center gap-2 sm:gap-3 justify-end">
        <!-- Filter Dropdown -->
        <Dropdown
          v-model="selectedFilter"
          :options="filterOptions"
          placeholder="Filter events"
          width="152px"
          @change="handleFilterChange"
        />

        <!-- Add Event Button -->
        <Button  class="bg-figma-orange text-white px-2 sm:px-3 py-1.5 gap-1.5 rounded-sm w-fit shrink-0">
          <Plus class="w-4.5 h-4.5" />
          <span class="font-open-sans font-semibold text-[12px] hidden sm:inline">Events</span>
        </Button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-5 max-w-full lg:max-w-[95.5%] mt-4">
      <!-- Left Column - Events List -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
          <EventCardSkeleton v-for="i in 3" :key="i" />
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="text-red-400 font-open-sans text-base mb-2">
              Failed to load events
            </div>
            <div class="text-dashboard-text-secondary font-open-sans text-sm mb-4">
              Something went wrong. Please try again.
            </div>
            <button 
              @click="refetch()"
              class="bg-figma-orange text-white px-4 py-2 rounded-sm font-inter font-medium text-sm hover:bg-figma-orange/90 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="events.length === 0" class="flex flex-col justify-center items-center py-12">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-dashboard-card-content rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-dashboard-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-dashboard-text-primary font-lato font-semibold text-lg mb-2">
              No events found
            </h3>
            <p class="text-dashboard-text-secondary font-open-sans text-sm mb-4">
              There are no events matching your current filters.
            </p>
            <button 
              v-if="selectedFilter !== 'all'"
              @click="selectedFilter = 'all'"
              class="bg-figma-orange text-white px-4 py-2 rounded-sm font-inter font-medium text-sm hover:bg-figma-orange/90 transition-colors"
            >
              Show all events
            </button>
          </div>
        </div>

        <!-- Events List -->
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @register="handleEventRegister"
        />
      </div>

      <!-- Right Column - Sidebar Content -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        <!-- Mobile: Show in horizontal scroll, Desktop: Stack vertically -->
        <div class="flex lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          <!-- Calendar Component -->
          <div class="shrink-0 w-80 lg:w-full">
            <CalendarWidget :events="allEvents || []" />
          </div>
          
          <!-- Upcoming Celebrations -->
          <div class="shrink-0 w-80 lg:w-full">
            <CelebrationsCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import { Button, Dropdown } from '@/components/ui'
import EventCard from '@/components/dashboard/EventCard.vue'
import EventCardSkeleton from '@/components/ui/EventCardSkeleton.vue'
import CalendarWidget from '@/components/dashboard/CalendarWidget.vue'
import CelebrationsCard from '@/components/dashboard/CelebrationsCard.vue'
import { useEvents, useRegisterForEvent } from '@/composables/useEvents'
import { toast } from 'vue3-toastify'
import type { Event } from '@/types/api'

const searchQuery = ref('')
const selectedFilter = ref('upcoming')

// Use real events data from composable
const { events: allEvents, isLoading, isError, error, refetch } = useEvents()
const { mutate: registerForEvent } = useRegisterForEvent()

// Filter options for the dropdown
const filterOptions = [
  { label: 'Upcoming events', value: 'upcoming' },
  { label: 'Past events', value: 'completed' },
  { label: 'All events', value: 'all' },
  { label: 'Registration open', value: 'open' },
  { label: 'Registration closed', value: 'closed' }
]

// Transform API events to match EventCard interface
const transformEvent = (event: Event) => {
  const eventDate = new Date(event.date)
  
  // Extract day number and day name from the actual event date
  const day = eventDate.getDate().toString()
  const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'short' })
  
  // Format full date for display
  const fullDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return {
    id: event._id,
    date: fullDate,
    title: `${event.eventTitle} (${event.eventType})`,
    description: event.description,
    day,
    dayName,
    image: event.image || '/images/auth-background.avif',
    canRegister: event.status === 'upcoming'
  }
}

// Filtered events based on search and filter selection
const events = computed(() => {
  if (!allEvents.value || !Array.isArray(allEvents.value)) return []
  let filtered = allEvents.value
  // Apply filter dropdown selection
  switch (selectedFilter.value) {
    case 'upcoming':
      filtered = filtered.filter(event => event.status === 'upcoming')
      break
    case 'completed':
      filtered = filtered.filter(event => event.status === 'completed')
      break
    case 'all':
      filtered = filtered
      break
    case 'open':
      filtered = filtered.filter(event => event.status === 'upcoming')
      break
    case 'closed':
      filtered = filtered.filter(event => event.status !== 'upcoming')
      break
    default:
      filtered = filtered
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => 
      event.eventTitle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.eventType.toLowerCase().includes(query)
    )
  }

  return filtered.map(transformEvent)
})

const handleEventRegister = (eventId: string | number) => {
  const id = eventId.toString()
  registerForEvent(id, {
    onSuccess: () => {
      toast.success('Successfully registered for event!')
      // console.log('Successfully registered for event:', id)
    },
    onError: (error: unknown) => {
      toast.error('Failed to register for event')
      console.error('Failed to register for event:', error)
    }
  })
}

const handleFilterChange = (option: { label: string; value: string | number }) => {
  console.log('Filter changed:', option)
}
</script>