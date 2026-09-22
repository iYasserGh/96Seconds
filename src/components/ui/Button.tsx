import type { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 border-[3px] border-foreground px-5 font-bold shadow-[4px_4px_0_var(--color-accent)] transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-strong",
        secondary: "bg-card text-foreground hover:bg-accent",
        ghost: "border-transparent bg-transparent shadow-none hover:bg-surface",
        danger: "bg-error text-white",
      },
      size: {
        default: "h-12 text-base",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-7 text-lg",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
