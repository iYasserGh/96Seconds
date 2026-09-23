import { Info, Moon, Sun, Volume2, VolumeX } from "lucide-react"
import { useRef } from "react"

import logoUrl from "../../../assets/brand/logo.png"
import nationalDayLogoBlackUrl from "../../../assets/brand/national-day-96-logo-black.webp"
import nationalDayLogoUrl from "../../../assets/brand/national-day-96-logo.webp"

import { HowToPlayDialog, type HowToPlayDialogHandle } from "@/components/game/HowToPlayDialog"
import { Button } from "@/components/ui/Button"

interface LandingScreenProps {
  onStart(): void
  soundEnabled: boolean
  onToggleSound(): void
  resolvedTheme: "light" | "dark"
  onToggleTheme(): void
}

export function LandingScreen({
  onStart,
  soundEnabled,
  onToggleSound,
  resolvedTheme,
  onToggleTheme,
}: LandingScreenProps) {
  const dialogRef = useRef<HowToPlayDialogHandle>(null)

  return (
    <section className="landing-screen relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-4 sm:px-8 sm:py-6">
      <header className="flex items-center justify-between gap-3">
        <img
          src={resolvedTheme === "dark" ? nationalDayLogoUrl : nationalDayLogoBlackUrl}
          alt="اليوم الوطني السعودي، عزنا بطبعنا"
          className="h-10 w-auto sm:h-12"
        />
        <nav aria-label="إعدادات سريعة" className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label={soundEnabled ? "إيقاف الصوت" : "تفعيل الصوت"}
            aria-pressed={soundEnabled}
            onClick={onToggleSound}
          >
            {soundEnabled ? <Volume2 aria-hidden="true" size={20} /> : <VolumeX aria-hidden="true" size={20} />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={resolvedTheme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            onClick={onToggleTheme}
          >
            {resolvedTheme === "dark" ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={20} />}
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
          {/* <div className="inline-flex items-center gap-2 border-2 border-foreground bg-accent px-3 py-2 text-xs font-bold shadow-[3px_3px_0_var(--foreground)] sm:text-sm">
            <span className="h-2.5 w-2.5 bg-primary" aria-hidden="true" />
            تحديات سريعة، جولة واحدة
          </div> */}
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.18] text-balance sm:text-6xl lg:text-7xl">
              كم تقدر تحل في
              <span className="text-primary"> 96 ثانية؟</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-xl">
              ورينا شطارتك، وحل اكبر عدد من التحديات قبل انتهاء الوقت
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

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-foreground pt-4 text-xs font-semibold text-muted-foreground sm:text-sm">
        <span>اليوم الوطني السعودي 96</span>
        <a
          href="https://ysg.sa"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-2 underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          ياسر الغامدي
        </a>
        {/* <span>لا تسجيل، لا انتظار</span> */}
      </footer>
      <HowToPlayDialog ref={dialogRef} />
    </section>
  )
}
