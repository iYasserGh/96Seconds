import logoUrl from "../../../assets/brand/logo.png"
import nationalDayLogoUrl from "../../../assets/brand/national-day-96-logo.webp"

export interface ShareResult {
  correct: number
  attempted: number
  longestStreak: number
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  y: number,
  font: string,
  color: string,
) {
  context.save()
  context.direction = "rtl"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = font
  context.fillStyle = color
  context.fillText(text, 540, y)
  context.restore()
}

export async function generateResultCard(result: ShareResult) {
  await document.fonts.load("900 96px Alexandria")
  const [logo, nationalLogo] = await Promise.all([loadImage(logoUrl), loadImage(nationalDayLogoUrl)])
  const canvas = document.createElement("canvas")
  canvas.width = 1080
  canvas.height = 1350
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas is unavailable")

  context.fillStyle = "#f7f7f2"
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.strokeStyle = "#171717"
  context.lineWidth = 5
  for (let x = 0; x <= canvas.width; x += 80) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, canvas.height)
    context.strokeStyle = "#e4e5df"
    context.stroke()
  }
  for (let y = 0; y <= canvas.height; y += 80) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)
    context.stroke()
  }

  context.fillStyle = "#171717"
  context.fillRect(76, 86, 928, 1120)
  context.fillStyle = "#c4b5e8"
  context.fillRect(58, 68, 928, 1120)
  context.fillStyle = "#ffffff"
  context.fillRect(40, 50, 928, 1120)
  context.strokeStyle = "#171717"
  context.lineWidth = 8
  context.strokeRect(40, 50, 928, 1120)

  context.drawImage(logo, 90, 92, 190, 190)
  context.drawImage(nationalLogo, 700, 125, 220, 101)

  context.fillStyle = "#006c35"
  context.fillRect(105, 345, 870, 320)
  context.strokeStyle = "#171717"
  context.lineWidth = 7
  context.strokeRect(105, 345, 870, 320)
  drawCenteredText(context, `${result.correct} / ${result.attempted}`, 500, "900 138px Alexandria", "#ffffff")
  drawCenteredText(context, `حللت ${result.correct} مرحلة خلال 96 ثانية`, 610, "600 40px Alexandria", "#ffffff")

  context.fillStyle = "#c4b5e8"
  context.fillRect(185, 735, 710, 205)
  context.strokeStyle = "#171717"
  context.strokeRect(185, 735, 710, 205)
  drawCenteredText(context, "أطول سلسلة", 795, "600 34px Alexandria", "#171717")
  drawCenteredText(context, String(result.longestStreak), 875, "900 78px Alexandria", "#171717")

  drawCenteredText(context, "هل تتجاوز نتيجتي؟", 1030, "900 48px Alexandria", "#006c35")
  context.direction = "ltr"
  context.textAlign = "center"
  context.font = "600 28px Alexandria"
  context.fillStyle = "#4c514e"
  context.fillText(window.location.origin, 540, 1100)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Result image could not be created"))
    }, "image/png")
  })
}

export async function downloadResultCard(result: ShareResult) {
  const blob = await generateResultCard(result)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `96-seconds-${result.correct}.png`
  link.click()
  URL.revokeObjectURL(url)
}

export async function shareResult(result: ShareResult) {
  const text = `حللت ${result.correct} مرحلة من ${result.attempted} خلال 96 ثانية. هل تتجاوز نتيجتي؟`
  const url = window.location.href

  try {
    const blob = await generateResultCard(result)
    const file = new File([blob], "96-seconds-result.png", { type: "image/png" })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, url, title: "96 ثانية" })
      return "shared" as const
    }
  } catch {
    // Continue to text sharing or download fallback.
  }

  if (navigator.share) {
    await navigator.share({ text, url, title: "96 ثانية" })
    return "shared" as const
  }

  await downloadResultCard(result)
  return "downloaded" as const
}

export async function copyGameLink() {
  await navigator.clipboard.writeText(window.location.href)
}
