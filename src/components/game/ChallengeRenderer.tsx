import { useEffect, useState, type ReactNode } from "react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react"

import type {
  Challenge,
  Direction,
  MemoryGridChallenge,
  NumberOrderChallenge,
} from "@/challenges/types"
import { cn } from "@/lib/cn"

interface ChallengeRendererProps {
  challenge: Challenge
  disabled: boolean
  onAnswer(isCorrect: boolean): void
}

const directionIcons: Record<Direction, LucideIcon> = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
}

const directionLabels: Record<Direction, string> = {
  up: "أعلى",
  down: "أسفل",
  left: "يسار",
  right: "يمين",
}

function ChoiceButton({
  children,
  disabled,
  onClick,
  className,
  ariaLabel,
}: {
  children: ReactNode
  disabled: boolean
  onClick(): void
  className?: string
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn("choice-button", className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function MemoryGrid({ challenge, disabled, onAnswer }: {
  challenge: MemoryGridChallenge
  disabled: boolean
  onAnswer(isCorrect: boolean): void
}) {
  const [previewing, setPreviewing] = useState(true)
  const [selected, setSelected] = useState<number[]>([])
  const target = new Set(challenge.correctAnswer)

  useEffect(() => {
    const timeout = window.setTimeout(() => setPreviewing(false), challenge.data.previewDuration)
    return () => window.clearTimeout(timeout)
  }, [challenge.data.previewDuration])

  const choose = (index: number) => {
    if (disabled || previewing || selected.includes(index)) return
    if (!target.has(index)) {
      onAnswer(false)
      return
    }
    const next = [...selected, index]
    setSelected(next)
    if (next.length === challenge.correctAnswer.length) onAnswer(true)
  }

  return (
    <div className="space-y-4">
      <p className="challenge-helper">
        {previewing ? "احفظ أماكنها" : "اختر المربعات التي ظهرت"}
      </p>
      <div className="memory-grid mx-auto" style={{ gridTemplateColumns: `repeat(${challenge.data.columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: challenge.data.total }, (_, index) => {
          const active = previewing ? target.has(index) : selected.includes(index)
          return (
            <button
              key={index}
              type="button"
              disabled={disabled || previewing}
              aria-label={`المربع ${index + 1}`}
              className={cn("memory-cell", active && "memory-cell--active")}
              onClick={() => choose(index)}
            />
          )
        })}
      </div>
    </div>
  )
}

function NumberOrder({ challenge, disabled, onAnswer }: {
  challenge: NumberOrderChallenge
  disabled: boolean
  onAnswer(isCorrect: boolean): void
}) {
  const [progress, setProgress] = useState(0)
  const [chosen, setChosen] = useState<number[]>([])

  const choose = (value: number) => {
    if (value !== challenge.correctAnswer[progress]) {
      onAnswer(false)
      return
    }
    const nextChosen = [...chosen, value]
    setChosen(nextChosen)
    setProgress((current) => current + 1)
    if (nextChosen.length === challenge.correctAnswer.length) onAnswer(true)
  }

  return (
    <div className="choice-grid choice-grid--numbers">
      {challenge.data.values.map((value) => (
        <ChoiceButton
          key={value}
          disabled={disabled || chosen.includes(value)}
          className={chosen.includes(value) ? "choice-button--chosen" : ""}
          onClick={() => choose(value)}
        >
          {value}
        </ChoiceButton>
      ))}
    </div>
  )
}

export function ChallengeRenderer({ challenge, disabled, onAnswer }: ChallengeRendererProps) {
  switch (challenge.type) {
    case "odd-one-out":
      return (
        <div className="odd-grid mx-auto" style={{ gridTemplateColumns: `repeat(${challenge.data.columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: challenge.data.total }, (_, index) => (
            <ChoiceButton
              key={index}
              disabled={disabled}
              className="choice-button--glyph"
              ariaLabel={`العنصر ${index + 1}`}
              onClick={() => onAnswer(index === challenge.correctAnswer)}
            >
              {index === challenge.data.oddIndex ? challenge.data.oddGlyph : challenge.data.baseGlyph}
            </ChoiceButton>
          ))}
        </div>
      )
    case "color-clash":
      return (
        <div className="space-y-7 text-center">
          <div className="color-word" style={{ color: challenge.data.renderedColor.value }}>{challenge.data.word}</div>
          <div className="choice-grid">
            {challenge.data.choices.map((choice) => (
              <ChoiceButton key={choice.name} disabled={disabled} onClick={() => onAnswer(choice.name === challenge.correctAnswer)}>
                <span className="h-4 w-4 border-2 border-foreground" style={{ backgroundColor: choice.value }} aria-hidden="true" />
                {choice.name}
              </ChoiceButton>
            ))}
          </div>
        </div>
      )
    case "number-sequence":
      return (
        <div className="space-y-8">
          <div className="sequence-row" dir="ltr">
            {challenge.data.sequence.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
            <span className="sequence-missing">؟</span>
          </div>
          <div className="choice-grid">
            {challenge.data.choices.map((choice) => (
              <ChoiceButton key={choice} disabled={disabled} onClick={() => onAnswer(choice === challenge.correctAnswer)}>{choice}</ChoiceButton>
            ))}
          </div>
        </div>
      )
    case "quick-math":
      return (
        <div className="space-y-8">
          <div className="math-expression" dir="ltr">{challenge.data.expression}</div>
          <div className="choice-grid">
            {challenge.data.choices.map((choice) => (
              <ChoiceButton key={choice} disabled={disabled} onClick={() => onAnswer(choice === challenge.correctAnswer)}>{choice}</ChoiceButton>
            ))}
          </div>
        </div>
      )
    case "memory-grid":
      return <MemoryGrid challenge={challenge} disabled={disabled} onAnswer={onAnswer} />
    case "number-order":
      return <NumberOrder challenge={challenge} disabled={disabled} onAnswer={onAnswer} />
    case "count-it":
      return (
        <div className="space-y-7">
          <div className="shape-grid mx-auto" style={{ gridTemplateColumns: `repeat(${challenge.data.columns}, minmax(0, 1fr))` }} aria-label="مجموعة الأشكال">
            {challenge.data.gridItems.map((shape, index) => <span key={`${shape.name}-${index}`}>{shape.glyph}</span>)}
          </div>
          <div className="choice-grid">
            {challenge.data.choices.map((choice) => (
              <ChoiceButton key={choice} disabled={disabled} onClick={() => onAnswer(choice === challenge.correctAnswer)}>{choice}</ChoiceButton>
            ))}
          </div>
        </div>
      )
    case "greater-side":
      return (
        <div className="side-comparison">
          {(["right", "left"] as const).map((side) => {
            const count = side === "left" ? challenge.data.leftCount : challenge.data.rightCount
            return (
              <ChoiceButton
                key={side}
                disabled={disabled}
                className="side-choice"
                ariaLabel={side === "right" ? "الجهة اليمنى" : "الجهة اليسرى"}
                onClick={() => onAnswer(side === challenge.correctAnswer)}
              >
                <span className="side-choice__items" aria-hidden="true">
                  {Array.from({ length: count }, (_, index) => <i key={index}>{challenge.data.glyph}</i>)}
                </span>
                <b>{side === "right" ? "اليمين" : "اليسار"}</b>
              </ChoiceButton>
            )
          })}
        </div>
      )
    case "direction": {
      const ShownIcon = directionIcons[challenge.data.shownDirection]
      return (
        <div className="space-y-7 text-center">
          <ShownIcon className="mx-auto text-primary" size={88} strokeWidth={3} aria-label="السهم المعروض" />
          <div className="direction-grid" dir="ltr">
            {challenge.data.choices.map((direction) => {
              const Icon = directionIcons[direction]
              return (
                <ChoiceButton key={direction} disabled={disabled} ariaLabel={`اتجاه ${directionLabels[direction]}`} onClick={() => onAnswer(direction === challenge.correctAnswer)}>
                  <Icon aria-hidden="true" size={30} />
                </ChoiceButton>
              )
            })}
          </div>
        </div>
      )
    }
    case "missing-pattern":
      return (
        <div className="space-y-8">
          <div className="pattern-row" dir="ltr">
            {challenge.data.items.map((item, index) => (
              <span key={`${item}-${index}`} className={item === "?" ? "pattern-missing" : ""}>{item}</span>
            ))}
          </div>
          <div className="choice-grid">
            {challenge.data.choices.map((choice) => (
              <ChoiceButton key={choice} disabled={disabled} onClick={() => onAnswer(choice === challenge.correctAnswer)}>{choice}</ChoiceButton>
            ))}
          </div>
        </div>
      )
  }
}
