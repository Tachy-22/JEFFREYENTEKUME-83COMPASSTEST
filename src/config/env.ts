interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://eight3compass-test.onrender.com/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'Frontend Interview',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isDev: import.meta.env.VITE_APP_ENV === 'development',
  isProd: import.meta.env.VITE_APP_ENV === 'production',
} as const

export type AppConfig = typeof env