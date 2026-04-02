export function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function formatStudyMinutes(totalMinutes) {
  const minutes = Math.max(0, Math.floor(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  if (hours <= 0) return `${remainder}m`
  if (remainder <= 0) return `${hours}h`
  return `${hours}h ${remainder}m`
}

export function formatTimerMs(totalMs) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":")
}

export function getSavableTimerMinutes(totalMs) {
  return Math.max(0, Math.floor(totalMs / 60000))
}

export function getMsUntilNextMinute(totalMs) {
  const remainderMs = Math.max(0, totalMs % 60000)

  if (remainderMs === 0) {
    return 0
  }

  return 60000 - remainderMs
}

export function moodLabel(mood) {
  if (mood === 1) return "Burned Out"
  if (mood === 2) return "Neutral"
  if (mood === 3) return "Focused"
  return "Not set"
}

export function formatUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.host + parsed.pathname
  } catch {
    return url
  }
}
