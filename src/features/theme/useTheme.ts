import { useEffect, useState } from "react"

import type { ThemePreference } from "@/features/storage/localStats"

export function useTheme(preference: ThemePreference) {
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const resolved = preference === "system" ? (media.matches ? "dark" : "light") : preference
      document.documentElement.dataset.theme = resolved
      document.documentElement.style.colorScheme = resolved
      setResolvedTheme(resolved)
    }

    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [preference])

  return resolvedTheme
}
