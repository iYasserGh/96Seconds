import { SkipForward } from "lucide-react"

import { ChallengeRenderer } from "@/components/game/ChallengeRenderer"
import { GameHeader } from "@/components/game/GameHeader"
import { Button } from "@/components/ui/Button"
import type { GameState } from "@/game/reducer"

interface GameScreenProps {
  state: GameState
  onAnswer(isCorrect: boolean): void
  onSkip(): void
}

export function GameScreen({ state, onAnswer, onSkip }: GameScreenProps) {
  if (!state.currentChallenge) return null

  return (
    <section className="mx-auto flex h-dvh max-h-dvh w-full max-w-4xl flex-col overflow-y-auto px-4 py-3 sm:px-7 sm:py-6">
      <GameHeader seconds={state.displayedSeconds} correct={state.correct} streak={state.currentStreak} />
      <div className="flex flex-1 flex-col justify-center gap-3 py-3 sm:gap-5 sm:py-8">
        <article className={`challenge-card feedback-${state.feedback ?? "idle"}`} aria-live="polite">
          <div className="challenge-index" aria-hidden="true">
            {String(state.attempted + 1).padStart(2, "0")}
          </div>
          <h1 className="challenge-title">{state.currentChallenge.title}</h1>
          {state.feedback && (
            <div className={`feedback-label feedback-label--${state.feedback}`} role="status">
              {state.feedback === "correct"
                ? "إجابة صحيحة"
                : state.feedback === "wrong"
                  ? "إجابة غير صحيحة"
                  : "تخطيت التحدي"}
            </div>
          )}
          <ChallengeRenderer
            key={state.currentChallenge.id}
            challenge={state.currentChallenge}
            disabled={state.isLocked}
            onAnswer={onAnswer}
          />
        </article>
        <div className="flex shrink-0 justify-center">
          <Button variant="secondary" size="sm" disabled={state.isLocked} onClick={onSkip}>
            <SkipForward aria-hidden="true" size={18} />
            تخطَّ
          </Button>
        </div>
      </div>
    </section>
  )
}
