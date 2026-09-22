import type { Challenge, ChallengeType } from "@/challenges/types"
import { GAME_DURATION_SECONDS } from "@/game/constants"

export type GameStatus = "idle" | "countdown" | "playing" | "finished"
export type AnswerOutcome = "correct" | "wrong" | "skip"

export interface GameState {
  status: GameStatus
  correct: number
  attempted: number
  currentStreak: number
  longestStreak: number
  currentChallenge: Challenge | null
  previousChallengeTypes: ChallengeType[]
  startedAt: number | null
  endsAt: number | null
  displayedSeconds: number
  soundEnabled: boolean
  feedback: AnswerOutcome | null
  isLocked: boolean
}

export type GameAction =
  | { type: "START_COUNTDOWN" }
  | { type: "BEGIN_PLAYING"; challenge: Challenge; startedAt: number; endsAt: number }
  | { type: "TICK"; displayedSeconds: number }
  | { type: "ANSWER"; outcome: Exclude<AnswerOutcome, "skip"> }
  | { type: "SKIP" }
  | { type: "NEXT_CHALLENGE"; challenge: Challenge }
  | { type: "FINISH" }
  | { type: "RESET" }
  | { type: "SET_SOUND"; enabled: boolean }

export function createInitialGameState(soundEnabled = true): GameState {
  return {
    status: "idle",
    correct: 0,
    attempted: 0,
    currentStreak: 0,
    longestStreak: 0,
    currentChallenge: null,
    previousChallengeTypes: [],
    startedAt: null,
    endsAt: null,
    displayedSeconds: GAME_DURATION_SECONDS,
    soundEnabled,
    feedback: null,
    isLocked: false,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_COUNTDOWN":
      return { ...createInitialGameState(state.soundEnabled), status: "countdown" }
    case "BEGIN_PLAYING":
      return {
        ...state,
        status: "playing",
        currentChallenge: action.challenge,
        previousChallengeTypes: [action.challenge.type],
        startedAt: action.startedAt,
        endsAt: action.endsAt,
        displayedSeconds: GAME_DURATION_SECONDS,
      }
    case "TICK":
      if (state.status !== "playing") return state
      return { ...state, displayedSeconds: action.displayedSeconds }
    case "ANSWER": {
      if (state.status !== "playing" || state.isLocked) return state
      const isCorrect = action.outcome === "correct"
      const nextStreak = isCorrect ? state.currentStreak + 1 : 0
      return {
        ...state,
        correct: state.correct + (isCorrect ? 1 : 0),
        attempted: state.attempted + 1,
        currentStreak: nextStreak,
        longestStreak: Math.max(state.longestStreak, nextStreak),
        feedback: action.outcome,
        isLocked: true,
      }
    }
    case "SKIP":
      if (state.status !== "playing" || state.isLocked) return state
      return {
        ...state,
        attempted: state.attempted + 1,
        currentStreak: 0,
        feedback: "skip",
        isLocked: true,
      }
    case "NEXT_CHALLENGE":
      if (state.status !== "playing") return state
      return {
        ...state,
        currentChallenge: action.challenge,
        previousChallengeTypes: [...state.previousChallengeTypes, action.challenge.type].slice(-2),
        feedback: null,
        isLocked: false,
      }
    case "FINISH":
      return {
        ...state,
        status: "finished",
        currentChallenge: null,
        displayedSeconds: 0,
        feedback: null,
        isLocked: true,
      }
    case "RESET":
      return createInitialGameState(state.soundEnabled)
    case "SET_SOUND":
      return { ...state, soundEnabled: action.enabled }
    default:
      return state
  }
}
