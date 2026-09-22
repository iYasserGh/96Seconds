import { RotateCcw, Share2, Trophy } from "lucide-react"

import logoUrl from "../../../assets/brand/logo.png"

import { Button } from "@/components/ui/Button"
import type { GameState } from "@/game/reducer"

interface ResultScreenProps {
  state: GameState
  onReplay(): void
}

export function ResultScreen({ state, onReplay }: ResultScreenProps) {
  const accuracy = state.attempted === 0 ? 0 : Math.round((state.correct / state.attempted) * 100)

  return (
    <section className="mx-auto grid min-h-dvh max-w-3xl place-items-center px-4 py-8">
      <article className="result-card w-full">
        <header className="flex items-center justify-between border-b-[3px] border-foreground p-4 sm:p-5">
          <img src={logoUrl} alt="96 ثانية" className="h-16 w-16 object-contain" />
          <div className="inline-flex items-center gap-2 bg-accent px-3 py-2 text-sm font-bold">
            <Trophy aria-hidden="true" size={18} />
            انتهى الوقت
          </div>
        </header>
        <div className="space-y-7 p-5 text-center sm:p-8">
          <div>
            <div className="result-score" dir="ltr">{state.correct} / {state.attempted}</div>
            <p className="mt-2 text-muted-foreground">حللت {state.correct} مرحلة من {state.attempted}</p>
          </div>
          <div className="result-stats">
            <div><span>أطول سلسلة</span><strong>{state.longestStreak}</strong></div>
            <div><span>الدقة</span><strong>{accuracy}%</strong></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={onReplay}>
              <RotateCcw aria-hidden="true" />
              العب من جديد
            </Button>
            <Button size="lg" variant="secondary" disabled>
              <Share2 aria-hidden="true" />
              شارك النتيجة
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}
