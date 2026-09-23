import { useEffect } from "react"

const SCRIPT_ID = "umami-analytics-script"

export function UmamiAnalytics() {
  useEffect(() => {
    const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL?.trim()
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim()

    if (!scriptUrl || !websiteId || document.getElementById(SCRIPT_ID)) return

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = scriptUrl
    script.async = true
    script.defer = true
    script.dataset.websiteId = websiteId
    script.dataset.autoTrack = "true"
    script.onerror = () => script.remove()
    document.head.appendChild(script)

    return () => script.remove()
  }, [])

  return null
}
