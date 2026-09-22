import { DIFFICULTY_CAP } from "@/game/constants"

export function getDifficulty(correct: number) {
  return Math.min(Math.max(correct, 0) / DIFFICULTY_CAP, 1)
}

export function scaleDifficulty(
  difficulty: number,
  minimum: number,
  maximum: number,
) {
  const clamped = Math.min(Math.max(difficulty, 0), 1)
  return minimum + (maximum - minimum) * clamped
}
