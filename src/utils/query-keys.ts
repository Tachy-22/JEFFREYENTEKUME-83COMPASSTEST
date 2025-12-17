// Centralized query keys for better organization and type safety
export const QUERY_KEYS = {
  auth: {
    user: ['auth', 'user'] as const,
    status: ['auth', 'status'] as const,
  },
  events: {
    all: ['events'] as const,
    detail: (id: string) => ['events', id] as const,
    filtered: (status?: string) => ['events', 'filtered', status] as const,
  },
} as const

export type QueryKeys = typeof QUERY_KEYS