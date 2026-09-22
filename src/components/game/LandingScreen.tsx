import { Info, Moon, Volume2 } from "lucide-react"
import { useRef } from "react"

import logoUrl from "../../../assets/brand/logo.png"
import nationalDayLogoUrl from "../../../assets/brand/national-day-96-logo.webp"

import { HowToPlayDialog, type HowToPlayDialogHandle } from "@/components/game/HowToPlayDialog"
import { Button } from "@/components/ui/Button"

interface LandingScreenProps {
  onStart(): void
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const dialogRef = useRef<HowToPlayDialogHandle>(null)

  return (
    <section className="landing-screen relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-4 sm:px-8 sm:py-6">
      <header className="flex items-center justify-between gap-3">
        <img src={nationalDayLogoUrl} alt="عزنا بطبعنا" className="h-8 w-auto sm:h-10" />
        <nav aria-label="إعدادات سريعة" className="flex gap-2">
          <Button variant="secondary" size="icon" aria-label="تفعيل الصوت">
            <Volume2 aria-hidden="true" size={20} />
          </Button>
          <Button variant="secondary" size="icon" aria-label="تفعيل الوضع الداكن">
            <Moon aria-hidden="true" size={20} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="طريقة اللعب"
            onClick={() => dialogRef.current?.open()}
          >
            <Info aria-hidden="true" size={20} />
          </Button>
        </nav>
      </header>

      <div className="landing-grid flex flex-1 items-center py-8 sm:py-12">
        <div className="landing-copy relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 border-2 border-foreground bg-accent px-3 py-2 text-xs font-bold shadow-[3px_3px_0_var(--foreground)] sm:text-sm">
            <span className="h-2.5 w-2.5 bg-primary" aria-hidden="true" />
            تحديات سريعة، جولة واحدة
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.18] text-balance sm:text-6xl lg:text-7xl">
              كم مرحلة تحلّ
              <span className="text-primary"> في 96 ثانية؟</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-xl">
              اختبر سرعتك وتركيزك. كل إجابة صحيحة تقرّبك من تحدٍ أصعب.
            </p>
          </div>
          <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>
            ابدأ التحدي
          </Button>
        </div>

        <div className="logo-stage" aria-hidden="true">
          <div className="logo-stage__backdrop" />
          <img src={logoUrl} alt="" className="logo-stage__logo" />
          <span className="pixel pixel--one" />
          <span className="pixel pixel--two" />
          <span className="pixel pixel--three" />
        </div>
      </div>

      <footer className="flex items-center justify-between border-t-2 border-foreground pt-4 text-xs font-semibold text-muted-foreground sm:text-sm">
        <span>اليوم الوطني السعودي 96</span>
        <span>لا تسجيل، لا انتظار</span>
      </footer>
      <HowToPlayDialog ref={dialogRef} />
    </section>
  )
}
