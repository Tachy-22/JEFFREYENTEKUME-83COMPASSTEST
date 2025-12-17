<template>
  <div 
    @click="navigateToDetail"
    class="w-full h-fit bg-dashboard-card-content items-center rounded flex flex-col sm:flex-row p-2 sm:pr-5 gap-3 sm:gap-4 cursor-pointer hover:bg-dashboard-card-content/80 transition-colors"
  >
    <!-- Date Badge -->
    <div class="flex flex-col shrink-0 px-0 sm:px-6 self-start sm:self-center">
      <!-- Day Number -->
      <div class="w-8 sm:w-10 h-6 sm:h-7.5 bg-white rounded-t-xs flex items-center justify-center">
        <span class="font-lato font-medium text-lg sm:text-xl text-black">{{ event.day }}</span>
      </div>
      <!-- Day Name -->
      <div class="w-8 sm:w-10 h-6 sm:h-7.5 bg-red-300 rounded-b-xs flex items-center justify-center">
        <span class="font-inter font-medium text-sm sm:text-lg text-white">{{ event.dayName }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col justify-start w-full sm:w-auto">
      <!-- Time -->
      <p class="text-dashboard-text-primary font-open-sans text-xs mb-1 sm:mb-2">
        {{ event.date }}
      </p>

      <!-- Title -->
      <h3 class="text-dashboard-text-primary font-lato font-semibold text-sm sm:text-base mb-1 sm:mb-2">
        {{ event.title }}
      </h3>

      <!-- Description -->
      <p class="text-dashboard-text-primary font-open-sans text-xs leading-4 mb-3 sm:mb-4 max-w-none sm:max-w-82.75 line-clamp-2">
        {{ event.description }}
      </p>

      <!-- Register Button -->
      <Button 
        v-if="event.canRegister"
        @click.stop="$emit('register', event.id)"
        class="bg-figma-orange hover:bg-figma-orange/90 text-white px-4 sm:px-8 py-1 rounded-sm font-inter font-medium text-xs w-fit"
      >
        Register
      </Button>
    </div>

    <!-- Event Image -->
    <div class="shrink-0 w-full sm:w-[26%] h-32 sm:h-32 rounded overflow-hidden self-center order-first sm:order-last">
      <img
        :src="event.image"
        :alt="event.title"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'

const router = useRouter()

interface EventItem {
  id: string | number
  date: string
  title: string
  description: string
  day: string
  dayName: string
  image: string
  canRegister: boolean
}

const props = defineProps<{
  event: EventItem
}>()

defineEmits<{
  register: [eventId: string | number]
}>()

const navigateToDetail = () => {
  router.push(`/dashboard/events/${props.event.id}`)
}
</script>