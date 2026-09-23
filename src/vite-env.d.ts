/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_SCRIPT_URL?: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  umami?: {
    track(eventName: string, eventData?: Record<string, string | number | boolean>): void
  }
}
