import { afterEach, describe, expect, it, vi } from "vitest"

import {
  clearPendingUmamiEvents,
  flushPendingUmamiEvents,
  trackUmamiEvent,
} from "@/features/analytics/trackEvent"

afterEach(() => {
  clearPendingUmamiEvents()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function configureUmami() {
  vi.stubEnv("VITE_UMAMI_SCRIPT_URL", "https://analytics.example/script.js")
  vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "website-id")
}

describe("Umami event tracking", () => {
  it("does nothing when analytics is not configured", () => {
    const track = vi.fn()
    vi.stubGlobal("window", { umami: { track } })

    trackUmamiEvent("start_game")

    expect(track).not.toHaveBeenCalled()
  })

  it("tracks event data when Umami is ready", () => {
    configureUmami()
    const track = vi.fn()
    vi.stubGlobal("window", { umami: { track } })

    trackUmamiEvent("share", { action: "copy_link" })

    expect(track).toHaveBeenCalledWith("share", { action: "copy_link" })
  })

  it("flushes events triggered before the tracker loads", () => {
    configureUmami()
    const track = vi.fn()
    vi.stubGlobal("window", {})

    trackUmamiEvent("start_game")
    window.umami = { track }
    flushPendingUmamiEvents()

    expect(track).toHaveBeenCalledWith("start_game", undefined)
  })
})
