import { Check, Copy, Download, RotateCcw, Share2, Trophy } from "lucide-react"
import { useState } from "react"

import logoUrl from "../../../assets/brand/logo.png"

import { Button } from "@/components/ui/Button"
import type { LocalStats } from "@/features/storage/localStats"
import {
  copyGameLink,
  downloadResultCard,
  shareResult,
} from "@/features/sharing/resultCard"
import type { GameState } from "@/game/reducer"

interface ResultScreenProps {
  state: GameState
  stats: LocalStats
  isNewBest: boolean
  onReplay(): void
}

export function ResultScreen({ state, stats, isNewBest, onReplay }: ResultScreenProps) {
  const accuracy = state.attempted === 0 ? 0 : Math.round((state.correct / state.attempted) * 100)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const result = {
    correct: state.correct,
    attempted: state.attempted,
    longestStreak: state.longestStreak,
  }

  const perform = async (action: () => Promise<unknown>, successMessage: string) => {
    setBusy(true)
    setStatus(null)
    try {
      await action()
      setStatus(successMessage)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setStatus("تعذّر إكمال المشاركة. جرّب خيارًا آخر.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-5 px-4 py-8">
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
            {isNewBest && (
              <div className="mx-auto mb-4 inline-flex items-center gap-2 border-2 border-foreground bg-accent px-3 py-2 text-sm font-bold shadow-[3px_3px_0_var(--foreground)]">
                <Trophy aria-hidden="true" size={18} />
                أفضل نتيجة جديدة
              </div>
            )}
            <div className="result-score" dir="ltr">{state.correct} / {state.attempted}</div>
            <p className="mt-2 text-muted-foreground">{state.correct > 25 && "يارهيب!"} حليت {state.correct} سؤال من {state.attempted}!</p>
          </div>
          <div className="result-stats">
            <div><span>أطول ستريك</span><strong>{state.longestStreak}</strong></div>
            <div><span>الدقة</span><strong>{accuracy}%</strong></div>
            <div><span>أفضل نتيجة</span><strong>{stats.bestCorrect}</strong></div>
            <div><span>عدد الجولات</span><strong>{stats.gamesPlayed}</strong></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={onReplay}>
              <RotateCcw aria-hidden="true" />
              العب من جديد
            </Button>
            <Button
              size="lg"
              variant="secondary"
              disabled={busy}
              onClick={() => perform(() => shareResult(result), "نتيجتك جاهزة للمشاركة.")}
            >
              <Share2 aria-hidden="true" />
              شارك النتيجة
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => perform(() => downloadResultCard(result), "تم تحميل صورة النتيجة، ننتظرك في هاشتاق #96ـثانية على تويتر!")}
            >
              <Download aria-hidden="true" size={18} />
              حمّل صورة النتيجة
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => perform(copyGameLink, "نُسخ رابط اللعبة.")}
            >
              <Copy aria-hidden="true" size={18} />
              انسخ الرابط
            </Button>
          </div>
          {status && (
            <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold" role="status">
              <Check aria-hidden="true" size={17} />
              {status}
            </p>
          )}
        </div>
      </article>
      <footer className="text-center text-sm font-semibold text-muted-foreground">
        <a
          href="https://ysg.sa"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-2 underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          ياسر الغامدي
        </a>
      </footer>
    </section>
  )
}
