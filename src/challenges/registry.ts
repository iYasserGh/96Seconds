import { colorClashGenerator } from "@/challenges/color-clash/generator"
import { oddOneOutGenerator } from "@/challenges/odd-one-out/generator"
import { quickMathGenerator } from "@/challenges/quick-math/generator"
import type { Challenge, ChallengeDefinition, ChallengeType } from "@/challenges/types"

export const challengeRegistry: Record<ChallengeType, ChallengeDefinition> = {
  "odd-one-out": oddOneOutGenerator as ChallengeDefinition<Challenge>,
  "color-clash": colorClashGenerator as ChallengeDefinition<Challenge>,
  "quick-math": quickMathGenerator as ChallengeDefinition<Challenge>,
}
