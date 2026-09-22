export function createEndTime(now: number, durationSeconds: number) {
  return now + durationSeconds * 1000
}

export function getDisplayedSeconds(endAt: number, now: number) {
  return Math.max(0, Math.ceil((endAt - now) / 1000))
}
