import { get, post } from '@/lib/api-client'
import type {
  Event,
  CreateEventRequest,
  ApiResponse,
  PaginatedEventsResponse,
} from '@/types/api'

// Pure functions for event operations
export const createEvent = async (eventData: CreateEventRequest): Promise<ApiResponse<Event>> => {
  return post<Event, CreateEventRequest>('/event/create-event', eventData)
}

export const getAllEvents = async (): Promise<ApiResponse<PaginatedEventsResponse>> => {
  return get<PaginatedEventsResponse>('/event/all-events')
}

export const getEventById = async (eventId: string): Promise<ApiResponse<Event>> => {
  return get<Event>(`/event/${eventId}`)
}

export const registerForEvent = async (eventId: string): Promise<ApiResponse<Event>> => {
  return post<Event>(`/event/register/${eventId}`)
}

// Compose event functions
export const eventsService = {
  createEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
} as const