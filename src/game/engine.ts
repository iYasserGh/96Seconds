import { challengeRegistry } from "@/challenges/registry"
import { chooseChallengeType } from "@/challenges/scheduler"
import { challengeTypes, type Challenge, type ChallengeType } from "@/challenges/types"
import { MAX_GENERATION_ATTEMPTS } from "@/game/constants"
import type { RandomSource } from "@/game/random"

export function generateNextChallenge(
  difficulty: number,
  recentTypes: readonly ChallengeType[],
  rng: RandomSource,
): Challenge {
  const attemptedTypes = new Set<ChallengeType>()

  for (let registryAttempt = 0; registryAttempt < challengeTypes.length; registryAttempt += 1) {
    const remaining = challengeTypes.filter((type) => !attemptedTypes.has(type))
    const type = chooseChallengeType(recentTypes, rng, remaining)
    attemptedTypes.add(type)
    const definition = challengeRegistry[type]

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const challenge = definition.generate(difficulty, rng)
      if (definition.validate(challenge)) return challenge
    }
  }

  throw new Error("تعذّر توليد تحدٍ صالح")
}
