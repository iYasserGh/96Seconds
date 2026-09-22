import type { RandomSource } from "@/game/random"

export const challengeTypes = [
  "odd-one-out",
  "color-clash",
  "quick-math",
] as const

export type ChallengeType = (typeof challengeTypes)[number]

interface ChallengeBase<TType extends ChallengeType, TData, TAnswer> {
  id: string
  type: TType
  title: string
  data: TData
  correctAnswer: TAnswer
}

export type OddVariation = "shape" | "fill" | "rotation" | "size"

export type OddOneOutChallenge = ChallengeBase<
  "odd-one-out",
  {
    columns: number
    total: number
    oddIndex: number
    baseGlyph: string
    oddGlyph: string
    variation: OddVariation
  },
  number
>

export type ColorName = "أحمر" | "أخضر" | "أزرق" | "بنفسجي" | "برتقالي"

export interface ColorChoice {
  name: ColorName
  value: string
}

export type ColorClashChallenge = ChallengeBase<
  "color-clash",
  {
    word: ColorName
    renderedColor: ColorChoice
    choices: ColorChoice[]
  },
  ColorName
>

export type MathOperator = "+" | "−" | "×"

export type QuickMathChallenge = ChallengeBase<
  "quick-math",
  {
    expression: string
    choices: number[]
  },
  number
>

export type Challenge =
  | OddOneOutChallenge
  | ColorClashChallenge
  | QuickMathChallenge

export interface ChallengeGenerator<TChallenge extends Challenge> {
  type: TChallenge["type"]
  generate(difficulty: number, rng: RandomSource): TChallenge
  validate(challenge: TChallenge): boolean
}

export interface ChallengeDefinition<TChallenge extends Challenge = Challenge> {
  generate(difficulty: number, rng: RandomSource): TChallenge
  validate(challenge: TChallenge): boolean
}
