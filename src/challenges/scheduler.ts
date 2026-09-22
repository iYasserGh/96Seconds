import { challengeTypes, type ChallengeType } from "@/challenges/types"
import { RECENT_CHALLENGE_LIMIT } from "@/game/constants"
import type { RandomSource } from "@/game/random"

export function chooseChallengeType(
  recentTypes: readonly ChallengeType[],
  rng: RandomSource,
  availableTypes: readonly ChallengeType[] = challengeTypes,
) {
  const excluded = new Set(recentTypes.slice(-RECENT_CHALLENGE_LIMIT))
  const candidates = availableTypes.filter((type) => !excluded.has(type))
  return rng.pick(candidates.length > 0 ? candidates : availableTypes)
}

export function appendRecentType(
  recentTypes: readonly ChallengeType[],
  nextType: ChallengeType,
) {
  return [...recentTypes, nextType].slice(-RECENT_CHALLENGE_LIMIT)
}
