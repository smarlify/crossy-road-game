/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Main Firebase App
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_FIREBASE_DATABASE_URL?: string

  // Leaderboard Firebase App
  readonly VITE_LEADERBOARD_API_KEY: string
  readonly VITE_LEADERBOARD_AUTH_DOMAIN: string
  readonly VITE_LEADERBOARD_PROJECT_ID: string
  readonly VITE_LEADERBOARD_STORAGE_BUCKET: string
  readonly VITE_LEADERBOARD_MESSAGING_SENDER_ID: string
  readonly VITE_LEADERBOARD_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
