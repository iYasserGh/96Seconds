import logoUrl from "../../assets/brand/logo.png"

import { Button } from "@/components/ui/Button"

export function App() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-8 px-5 py-10 text-center">
        <img src={logoUrl} alt="96 ثانية" className="h-48 w-48 object-contain" />
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary">جاهز للتحدي؟</p>
          <h1 className="text-4xl font-black sm:text-6xl">كم مرحلة تحلّ في 96 ثانية؟</h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            اختبر سرعتك وتركيزك قبل انتهاء الوقت.
          </p>
        </div>
        <Button size="lg">ابدأ التحدي</Button>
      </section>
    </main>
  )
}
