export interface ApiResponse<T = unknown> {
  success: boolean
  msg: string
  data: T
  token?: string
}

export interface ApiError {
  success: false
  msg: string
  error?: string
  details?: unknown
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
  __v: number
  avatar?:string
  role?:string
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends ApiResponse<User> {
  token: string
  refresh_token?: string
}

export interface Event {
  _id: string
  eventType: string
  eventTitle: string
  description: string
  date: string
  image: string
  registeredUsers: User[] | string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdBy: User | string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateEventRequest {
  eventType: string
  eventTitle: string
  description: string
  date: string
}

export interface PaginatedEventsResponse {
  docs: Event[]
  pagination: {
    totalDocs: number
    perPage: number
    totalPages: number
    currentPage: number
    serialNo: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'