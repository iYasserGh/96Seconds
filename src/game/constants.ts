export const GAME_DURATION_SECONDS = 96
export const DIFFICULTY_CAP = 15
export const MAX_GENERATION_ATTEMPTS = 10
export const RECENT_CHALLENGE_LIMIT = 2

export const FEEDBACK_DURATION_MS = {
  correct: 180,
  wrong: 220,
  skip: 40,
} as const

export const STREAK_MILESTONES = [5, 10, 15, 20] as const
