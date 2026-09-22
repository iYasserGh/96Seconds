import { useCallback, useEffect, useRef } from "react"

import correctUrl from "../../../assets/sfx/correct.mp3"
import countdownUrl from "../../../assets/sfx/countdown.mp3"
import streakUrl from "../../../assets/sfx/streak.mp3"
import wrongUrl from "../../../assets/sfx/wrong.mp3"

export type SoundEvent = "correct" | "wrong" | "skip" | "streak" | "countdown"

const soundUrls: Record<SoundEvent, string> = {
  correct: correctUrl,
  wrong: wrongUrl,
  skip: wrongUrl,
  streak: streakUrl,
  countdown: countdownUrl,
}

export function useGameAudio(enabled: boolean) {
  const audio = useRef<Map<SoundEvent, HTMLAudioElement>>(new Map())

  const prepare = useCallback(() => {
    if (audio.current.size > 0) return
    for (const [event, url] of Object.entries(soundUrls) as [SoundEvent, string][]) {
      const element = new Audio(url)
      element.preload = "auto"
      audio.current.set(event, element)
    }
  }, [])

  const play = useCallback((event: SoundEvent) => {
    if (!enabled) return
    prepare()
    const element = audio.current.get(event)
    if (!element) return
    element.currentTime = 0
    void element.play().catch(() => undefined)
  }, [enabled, prepare])

  const stop = useCallback((event: SoundEvent) => {
    const element = audio.current.get(event)
    if (!element) return
    element.pause()
    element.currentTime = 0
  }, [])

  useEffect(() => () => {
    audio.current.forEach((element) => element.pause())
  }, [])

  return { play, prepare, stop }
}
