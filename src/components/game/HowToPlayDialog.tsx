import { forwardRef, useImperativeHandle, useRef } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/Button"

export interface HowToPlayDialogHandle {
  open(): void
}

export const HowToPlayDialog = forwardRef<HowToPlayDialogHandle>(function HowToPlayDialog(
  _,
  forwardedRef,
) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useImperativeHandle(forwardedRef, () => ({
    open() {
      dialogRef.current?.showModal()
    },
  }))

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="how-to-play-title"
      className="how-to-dialog m-auto w-[min(92vw,34rem)] border-[3px] border-foreground bg-card p-0 text-foreground shadow-[8px_8px_0_var(--color-accent)] backdrop:bg-[#171717b8]"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
    >
      <div className="flex items-center justify-between border-b-[3px] border-foreground bg-primary px-5 py-4 text-white">
        <h2 id="how-to-play-title" className="text-xl font-black">طريقة اللعب</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/15"
          aria-label="إغلاق"
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <ol className="grid gap-4 p-5 text-sm leading-7 sm:text-base">
        <li className="instruction-row"><b>1</b><span>حل أكبر عدد ممكن قبل انتهاء 96 ثانية.</span></li>
        <li className="instruction-row"><b>2</b><span>الإجابة الخاطئة أو التخطي يقطع السلسلة.</span></li>
        <li className="instruction-row"><b>3</b><span>تزداد صعوبة التحديات كلما تقدمت.</span></li>
      </ol>
    </dialog>
  )
})
