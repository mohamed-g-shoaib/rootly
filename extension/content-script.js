const FORWARDED_MESSAGE_TYPES = new Set(["daily-entry:upsert", "note:upsert"])

function isRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

function isDailyEntryPayload(payload) {
  if (!isRecord(payload)) {
    return false
  }

  if (
    payload.source !== "rootly-extension" ||
    payload.type !== "rootly:daily-entry-upsert"
  ) {
    return false
  }

  const entry = payload.entry

  if (!isRecord(entry)) {
    return false
  }

  return (
    typeof entry.id === "string" &&
    typeof entry.date === "string" &&
    typeof entry.studyTimeMinutes === "number" &&
    (entry.mood === 1 || entry.mood === 2 || entry.mood === 3) &&
    (entry.notes == null || typeof entry.notes === "string") &&
    typeof entry.createdAt === "string" &&
    typeof entry.updatedAt === "string"
  )
}

function isNotePayload(payload) {
  if (!isRecord(payload)) {
    return false
  }

  if (
    payload.source !== "rootly-extension" ||
    payload.type !== "rootly:note-upsert"
  ) {
    return false
  }

  const note = payload.note

  if (!isRecord(note)) {
    return false
  }

  return (
    typeof note.id === "string" &&
    (note.type === "qa" || note.type === "freeform") &&
    (note.courseId == null || typeof note.courseId === "string") &&
    (note.courseTitle == null || typeof note.courseTitle === "string") &&
    typeof note.previewText === "string" &&
    typeof note.flag === "boolean" &&
    typeof note.hasCodeSnippet === "boolean" &&
    typeof note.codeLanguage === "string" &&
    typeof note.createdAt === "string" &&
    typeof note.updatedAt === "string" &&
    typeof note.detailsLoaded === "boolean"
  )
}

chrome.runtime.onMessage.addListener((message) => {
  if (
    !message?.type ||
    !FORWARDED_MESSAGE_TYPES.has(message.type) ||
    !message.payload
  ) {
    return
  }

  if (
    message.type === "daily-entry:upsert" &&
    !isDailyEntryPayload(message.payload)
  ) {
    return
  }

  if (message.type === "note:upsert" && !isNotePayload(message.payload)) {
    return
  }

  if (window.top !== window) {
    return
  }

  window.postMessage(message.payload, window.location.origin)
})
