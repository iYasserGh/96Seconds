import type { RandomSource } from "@/game/random"

export const challengeTypes = [
  "odd-one-out",
  "color-clash",
  "number-sequence",
  "quick-math",
  "memory-grid",
  "number-order",
  "count-it",
  "greater-side",
  "direction",
  "missing-pattern",
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

export type SequenceFamily = "step" | "multiply" | "alternating"

export type NumberSequenceChallenge = ChallengeBase<
  "number-sequence",
  {
    sequence: number[]
    choices: number[]
    family: SequenceFamily
  },
  number
>

export type MemoryGridChallenge = ChallengeBase<
  "memory-grid",
  {
    columns: number
    total: number
    highlightedCells: number[]
    previewDuration: number
  },
  number[]
>

export type NumberOrderChallenge = ChallengeBase<
  "number-order",
  {
    values: number[]
  },
  number[]
>

export type ShapeName = "دائرة" | "مربع" | "مثلث" | "معيّن"

export interface ShapeToken {
  name: ShapeName
  glyph: string
}

export type CountItChallenge = ChallengeBase<
  "count-it",
  {
    target: ShapeToken
    gridItems: ShapeToken[]
    choices: number[]
    columns: number
  },
  number
>

export type Side = "right" | "left"

export type GreaterSideChallenge = ChallengeBase<
  "greater-side",
  {
    leftCount: number
    rightCount: number
    glyph: string
  },
  Side
>

export type Direction = "up" | "down" | "left" | "right"

export type DirectionChallenge = ChallengeBase<
  "direction",
  {
    instruction: "same" | "opposite"
    shownDirection: Direction
    choices: Direction[]
  },
  Direction
>

export type PatternFamily =
  | "abab"
  | "aabaab"
  | "rotation"
  | "increasing-count"
  | "alternating-fill"

export type MissingPatternChallenge = ChallengeBase<
  "missing-pattern",
  {
    family: PatternFamily
    items: string[]
    choices: string[]
  },
  string
>

export type Challenge =
  | OddOneOutChallenge
  | ColorClashChallenge
  | NumberSequenceChallenge
  | QuickMathChallenge
  | MemoryGridChallenge
  | NumberOrderChallenge
  | CountItChallenge
  | GreaterSideChallenge
  | DirectionChallenge
  | MissingPatternChallenge

export interface ChallengeGenerator<TChallenge extends Challenge> {
  type: TChallenge["type"]
  generate(difficulty: number, rng: RandomSource): TChallenge
  validate(challenge: TChallenge): boolean
}

export interface ChallengeDefinition<TChallenge extends Challenge = Challenge> {
  generate(difficulty: number, rng: RandomSource): TChallenge
  validate(challenge: TChallenge): boolean
}
