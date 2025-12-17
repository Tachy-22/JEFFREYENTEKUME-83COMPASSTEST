<template>
  <!-- Calendar Container -->
  <div class="w-full h-fit bg-dashboard-card-content rounded-[3px] p-4">
    <!-- Calendar Header -->
    <div class="mb-4">
      <h3 class="text-white font-montserrat font-semibold text-[13.5px] leading-[16.5px] tracking-[0.32px]">
        Calendar
      </h3>
    </div>

    <!-- Month/Year Display with Navigation -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-[8.62px]">
        <span class="text-dashboard-text-muted font-montserrat font-semibold text-[11.33px] leading-[13.5px] tracking-[0.32px]">{{ monthName }}</span>
        <span class="text-dashboard-text-muted font-montserrat font-semibold text-[11.33px] leading-[13.5px] tracking-[0.32px]">{{ currentYear }}</span>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="flex items-center gap-[1.5px]">
        <!-- Previous Month Button -->
        <button 
          @click="previousMonth"
          class="w-[16.37px] h-[15.11px] bg-gray-400/60 rounded-[2.52px] flex items-center justify-center hover:bg-gray-400/80 transition-colors"
        >
          <svg class="w-[15.11px] h-[15.11px] text-dashboard-text-muted rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
        <!-- Next Month Button -->
        <button 
          @click="nextMonth"
          class="w-[16.37px] h-[15.11px] bg-gray-400/60 rounded-[2.52px] flex items-center justify-center hover:bg-gray-400/80 transition-colors"
        >
          <svg class="w-[15.11px] h-[15.11px] text-dashboard-text-muted -rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="space-y-1 ">
      <!-- Day Headers -->
      <div class="grid grid-cols-7 gap-4">
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Sun</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Mon</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Tue</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Wed</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Thu</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Fri</span>
        </div>
        <div class="text-left">
          <span class="text-dashboard-text-muted font-montserrat font-semibold text-[9.44px] leading-[11.25px] tracking-[0.32px]">Sat</span>
        </div>
      </div>

      <!-- Calendar Days Grid -->
      <div class="space-y-px">
        <!-- Calendar Rows -->
        <div v-for="(week, weekIndex) in calendarWeeks" :key="weekIndex" class="grid grid-cols-7 gap-4 ">
          <button 
            v-for="date in week" 
            :key="date.key"
            @click="selectDate(date)"
            :class="[getDateClasses(date), date.isToday ? 'bg-[#F3AA92] rounded-2xl' : '']"
            class="relative h-7 w-6 flex items-center justify-center font-montserrat font-semibold text-[9.44px] leading-[5.25px] tracking-[0.32px] cursor-pointer transition-colors"
            :aria-label="getAriaLabel(date)"
            :aria-pressed="date.isSelected"
            :aria-current="date.isToday ? 'date' : undefined"
            role="gridcell"
          >
            <!-- Highlight Background for Event Dates -->
            <div 
              v-if="date.hasHighlight" 
              :class="date.highlightClass"
              class="absolute inset-0 rounded-2xl"
            ></div>
            <span class="relative z-10">{{ date.day }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Event, User } from '@/types/api'

// Calendar date interface
interface CalendarDate {
  key: string
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  hasHighlight: boolean
  highlightClass: string
}

interface Props {
  events?: Event[]
}

const props = withDefaults(defineProps<Props>(), {
  events: () => []
})

const userStore = useUserStore()
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Start with current date/month
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

// Get current year and month name
const currentYear = computed(() => currentDate.value.getFullYear())
const monthName = computed(() => monthNames[currentDate.value.getMonth()])

// Navigation functions
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// Date selection function
const selectDate = (date: CalendarDate) => {
  if (!date.isCurrentMonth) return
  
  const newSelectedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date.day)
  selectedDate.value = newSelectedDate
}

// Check if date is today
const isToday = (day: number, month: number, year: number) => {
  const today = new Date()
  return day === today.getDate() && 
         month === today.getMonth() && 
         year === today.getFullYear()
}

// Check if date is selected
const isSelectedDate = (day: number, month: number, year: number) => {
  if (!selectedDate.value) return false
  return day === selectedDate.value.getDate() && 
         month === selectedDate.value.getMonth() && 
         year === selectedDate.value.getFullYear()
}

// Check if there are any events on a specific date
const hasEventsOnDate = (day: number, month: number, year: number) => {
  if (!props.events) return false
  
  return props.events.some((event: Event) => {
    const eventDate = new Date(event.date)
    const eventDay = eventDate.getDate()
    const eventMonth = eventDate.getMonth()
    const eventYear = eventDate.getFullYear()
    
    return eventDay === day && eventMonth === month && eventYear === year
  })
}

// Check if user is registered for an event on a specific date
const isUserRegisteredOnDate = (day: number, month: number, year: number) => {
  if (!props.events || !userStore.user?._id) return false
  
  return props.events.some((event: Event) => {
    const eventDate = new Date(event.date)
    const eventDay = eventDate.getDate()
    const eventMonth = eventDate.getMonth()
    const eventYear = eventDate.getFullYear()
    
    // Check if event is on this date and user is registered
    if (eventDay === day && eventMonth === month && eventYear === year) {
      // Check if current user is in registeredUsers array
      if (Array.isArray(event.registeredUsers)) {
        return event.registeredUsers.some((user: User | string) => {
          // Handle both populated user objects and string IDs
          const userId = typeof user === 'string' ? user : user._id
          return userId === userStore.user?._id
        })
      }
    }
    return false
  })
}

// Generate calendar weeks that only contain weeks with current month days
const calendarWeeks = computed(() => {
  const weeks = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  
  // Calculate the number of weeks needed
  const firstWeekDays = 7 - startDayOfWeek
  const remainingDays = daysInMonth - firstWeekDays
  const fullWeeks = Math.floor(remainingDays / 7)
  const lastWeekDays = remainingDays % 7
  const totalWeeks = 1 + fullWeeks + (lastWeekDays > 0 ? 1 : 0)
  
  // Previous/next month info for padding days
  const prevMonth = new Date(year, month - 1, 0)
  const prevMonthDays = prevMonth.getDate()
  const prevMonthYear = month === 0 ? year - 1 : year
  const prevMonthIndex = month === 0 ? 11 : month - 1
  const nextMonthYear = month === 11 ? year + 1 : year
  const nextMonthIndex = month === 11 ? 0 : month + 1
  
  let currentMonthDay = 1
  let nextMonthDay = 1
  
  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const week = []
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let day, displayMonth, displayYear, isCurrentMonth
      
      if (weekIndex === 0 && dayIndex < startDayOfWeek) {
        // Previous month days in first week
        day = prevMonthDays - (startDayOfWeek - 1 - dayIndex)
        displayMonth = prevMonthIndex
        displayYear = prevMonthYear
        isCurrentMonth = false
      } else if (currentMonthDay <= daysInMonth) {
        // Current month days
        day = currentMonthDay
        displayMonth = month
        displayYear = year
        isCurrentMonth = true
        currentMonthDay++
      } else {
        // Next month days in last week
        day = nextMonthDay
        displayMonth = nextMonthIndex
        displayYear = nextMonthYear
        isCurrentMonth = false
        nextMonthDay++
      }
      
      const hasEvents = hasEventsOnDate(day, displayMonth, displayYear)
      const isRegistered = isUserRegisteredOnDate(day, displayMonth, displayYear)
      
      week.push({
        key: `${weekIndex}-${dayIndex}-${day}`,
        day,
        month: displayMonth,
        year: displayYear,
        isCurrentMonth,
        isSelected: isSelectedDate(day, displayMonth, displayYear),
        isToday: isToday(day, displayMonth, displayYear),
        hasHighlight: hasEvents,
        highlightClass: hasEvents ? (isRegistered ? 'bg-[#F3AA92]' : 'bg-[#FBE3DB]') : ''
      })
    }
    
    weeks.push(week)
  }
  
  return weeks
})


// Get CSS classes for each date based on the design
const getDateClasses = (date: CalendarDate) => {
  const classes = []
  
  if (!date.isCurrentMonth) {
    classes.push('text-[#7A7474]') // Next/prev month dates
  } else if (date.isToday) {
    classes.push('text-white font-bold') // Today - white text on orange background
  } else if (date.day <= 7) {
    classes.push('text-[#4E4949]') // First week - darker color
  } else if (date.hasHighlight) {
    classes.push('text-[#A5A1A1]') // Registered event dates
  } else {
    classes.push('text-[#CFCECE]') // Default current month color
  }
  
  if (date.isSelected && !date.isToday) {
    classes.push('font-bold')
  }
  
  return classes.join(' ')
}

// Generate aria label for accessibility
const getAriaLabel = (date: CalendarDate) => {
  const dateObj = new Date(date.year, date.month, date.day)
  const dateString = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  let label = dateString
  
  if (date.isToday) {
    label += ', today'
  }
  
  if (date.hasHighlight) {
    label += ', has registered events'
  }
  
  if (!date.isCurrentMonth) {
    label += ', outside current month'
  }
  
  return label
}
</script>