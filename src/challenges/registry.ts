import { colorClashGenerator } from "@/challenges/color-clash/generator"
import { countItGenerator } from "@/challenges/count-it/generator"
import { directionGenerator } from "@/challenges/direction/generator"
import { greaterSideGenerator } from "@/challenges/greater-side/generator"
import { memoryGridGenerator } from "@/challenges/memory-grid/generator"
import { missingPatternGenerator } from "@/challenges/missing-pattern/generator"
import { numberOrderGenerator } from "@/challenges/number-order/generator"
import { numberSequenceGenerator } from "@/challenges/number-sequence/generator"
import { oddOneOutGenerator } from "@/challenges/odd-one-out/generator"
import { quickMathGenerator } from "@/challenges/quick-math/generator"
import type { Challenge, ChallengeDefinition, ChallengeType } from "@/challenges/types"

export const challengeRegistry: Record<ChallengeType, ChallengeDefinition> = {
  "odd-one-out": oddOneOutGenerator as ChallengeDefinition<Challenge>,
  "color-clash": colorClashGenerator as ChallengeDefinition<Challenge>,
  "number-sequence": numberSequenceGenerator as ChallengeDefinition<Challenge>,
  "quick-math": quickMathGenerator as ChallengeDefinition<Challenge>,
  "memory-grid": memoryGridGenerator as ChallengeDefinition<Challenge>,
  "number-order": numberOrderGenerator as ChallengeDefinition<Challenge>,
  "count-it": countItGenerator as ChallengeDefinition<Challenge>,
  "greater-side": greaterSideGenerator as ChallengeDefinition<Challenge>,
  direction: directionGenerator as ChallengeDefinition<Challenge>,
  "missing-pattern": missingPatternGenerator as ChallengeDefinition<Challenge>,
}
