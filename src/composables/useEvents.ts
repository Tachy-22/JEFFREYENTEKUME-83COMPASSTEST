import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { eventsService } from '@/services/events.service'
import type { Event, CreateEventRequest } from '@/types/api'

import { QUERY_KEYS } from '@/utils/query-keys'

// Get all events
export const useEvents = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.events.all,
    queryFn: () => eventsService.getAllEvents(),
    select: (data) => data.data.docs, // Access the docs array
  })
  
  return {
    events: computed(() => query.data.value || []),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// Get single event
export const useEvent = (eventId: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId),
    queryFn: () => eventsService.getEventById(eventId),
    select: (data) => data.data,
    enabled: computed(() => Boolean(eventId)),
  })
  
  return {
    event: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// Create event mutation
export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (eventData: CreateEventRequest) => eventsService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all })
    },
  })
}

// Register for event mutation
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (eventId: string) => eventsService.registerForEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(eventId) })
    },
  })
}

// Filter events by status
export const useFilteredEvents = (status?: Event['status']) => {
  const { events, ...rest } = useEvents()
  
  const filteredEvents = computed(() => {
    if (!status) return events.value
    return events.value.filter((event) => event.status === status)
  })
  
  return {
    events: filteredEvents,
    ...rest,
  }
}

// Main events composable
export const useEventsOperations = () => {
  const createEvent = useCreateEvent()
  const registerForEvent = useRegisterForEvent()
  
  return {
    createEvent,
    registerForEvent,
  }
}