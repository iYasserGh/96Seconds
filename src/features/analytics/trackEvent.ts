export type UmamiEventData = Record<string, string | number | boolean>

interface PendingEvent {
  name: string
  data?: UmamiEventData
}

const MAX_PENDING_EVENTS = 25
const pendingEvents: PendingEvent[] = []

function isConfigured() {
  return Boolean(
    import.meta.env.VITE_UMAMI_SCRIPT_URL?.trim()
    && import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim(),
  )
}

function sendEvent(event: PendingEvent) {
  if (typeof window === "undefined" || !window.umami?.track) return false

  try {
    window.umami.track(event.name, event.data)
    return true
  } catch {
    return false
  }
}

export function trackUmamiEvent(name: string, data?: UmamiEventData) {
  if (!isConfigured()) return

  const event = { name, data }
  if (sendEvent(event)) return

  if (pendingEvents.length >= MAX_PENDING_EVENTS) pendingEvents.shift()
  pendingEvents.push(event)
}

export function flushPendingUmamiEvents() {
  if (typeof window === "undefined" || !window.umami?.track) return

  const events = pendingEvents.splice(0)
  for (const event of events) sendEvent(event)
}

export function clearPendingUmamiEvents() {
  pendingEvents.length = 0
}
