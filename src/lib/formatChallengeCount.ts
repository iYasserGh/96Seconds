export function formatChallengeCount(count: number) {
  if (count === 1) return "تحدي واحد"
  if (count === 2) return "تحديين"
  if (count >= 3 && count <= 10) return `${count} تحديات`
  return `${count} تحدي`
}
