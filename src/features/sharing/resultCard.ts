import logoUrl from "../../../assets/brand/logo.png"
import nationalDayLogoBlackUrl from "../../../assets/brand/national-day-96-logo-black.webp"

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
  const [logo, nationalLogo] = await Promise.all([
    loadImage(logoUrl),
    loadImage(nationalDayLogoBlackUrl),
  ])
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

  const cardWidth = 928
  const cardX = (canvas.width - cardWidth) / 2
  const cardY = (canvas.height - 1120) / 2
  context.fillStyle = "#ffffff"
  context.fillRect(cardX, cardY, cardWidth, 1120)
  context.strokeStyle = "#171717"
  context.lineWidth = 8
  context.strokeRect(cardX, cardY, cardWidth, 1120)

  const logoEdgeGap = 50
  const gameLogoWidth = 190
  const logoY = 157
  const logoHeight = 190
  const logoCenterY = logoY + logoHeight / 2
  const nationalLogoWidth = 220
  const nationalLogoHeight = 101
  context.drawImage(logo, cardX + logoEdgeGap, logoY, gameLogoWidth, logoHeight)
  context.drawImage(
    nationalLogo,
    cardX + cardWidth - logoEdgeGap - nationalLogoWidth,
    logoCenterY - nationalLogoHeight / 2,
    nationalLogoWidth,
    nationalLogoHeight,
  )

  context.fillStyle = "#006c35"
  context.fillRect(130, 405, 820, 300)
  context.strokeStyle = "#171717"
  context.lineWidth = 7
  context.strokeRect(130, 405, 820, 300)
  drawCenteredText(context, `${result.correct} / ${result.attempted}`, 540, "900 138px Alexandria", "#ffffff")
  drawCenteredText(context, `حللت ${result.correct} مرحلة خلال 96 ثانية`, 650, "600 40px Alexandria", "#ffffff")

  context.fillStyle = "#c4b5e8"
  context.fillRect(250, 755, 580, 220)
  context.strokeStyle = "#171717"
  context.strokeRect(250, 755, 580, 220)
  drawCenteredText(context, "أطول ستريك", 820, "600 34px Alexandria", "#171717")
  drawCenteredText(context, String(result.longestStreak), 910, "900 78px Alexandria", "#171717")

  drawCenteredText(context, "تقدر تجيب أعلى مني؟", 1065, "900 48px Alexandria", "#006c35")
  context.direction = "ltr"
  context.textAlign = "center"
  context.font = "600 28px Alexandria"
  context.fillStyle = "#4c514e"
  const displayUrl = window.location.host || window.location.href.replace(/^https?:\/\//, "").replace(/\/$/, "")
  context.fillText(displayUrl, 540, 1145)

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
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export async function shareResult(result: ShareResult) {
  const text = `حليت ${result.correct} مرحلة من ${result.attempted} خلال #96ـثانية
  تقدر تجيب أعلى مني؟`
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
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(window.location.href)
      return
    } catch {
      // Continue to the local fallback below.
    }
  }

  const input = document.createElement("textarea")
  input.value = window.location.href
  input.setAttribute("readonly", "")
  input.style.position = "fixed"
  input.style.opacity = "0"
  document.body.appendChild(input)
  input.select()
  const copied = document.execCommand("copy")
  input.remove()
  if (!copied) throw new Error("Copy is unavailable")
}
