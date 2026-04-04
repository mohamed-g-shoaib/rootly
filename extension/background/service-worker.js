const TIMER_STATE_KEY = "rootly.timerState"
const DAILY_ENTRY_WINDOW_EVENT = "rootly:daily-entry-upsert"
const DAILY_ENTRY_WINDOW_SOURCE = "rootly-extension"
const NOTE_WINDOW_EVENT = "rootly:note-upsert"
const NOTE_WINDOW_SOURCE = "rootly-extension"
const ALLOWED_SITE_BASE_URLS = new Set([
  "http://localhost:3000",
  "https://rootlynotes.vercel.app",
  "https://www.rootlynotes.vercel.app",
])

const defaultTimerState = Object.freeze({
  status: "idle",
  startedAt: null,
  accumulatedMs: 0,
  updatedAt: null,
})

function isRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

function isAllowedSiteBaseUrl(value) {
  return typeof value === "string" && ALLOWED_SITE_BASE_URLS.has(value)
}

function isTrustedSidePanelSender(sender) {
  if (!sender || sender.id !== chrome.runtime.id) {
    return false
  }

  if (typeof sender.url !== "string") {
    return false
  }

  const expectedPrefix = `chrome-extension://${chrome.runtime.id}/sidepanel/`
  return sender.url.startsWith(expectedPrefix)
}

function isBroadcastDailyEntryPayload(payload) {
  if (!isRecord(payload)) {
    return false
  }

  return (
    typeof payload.id === "string" &&
    typeof payload.date === "string" &&
    typeof payload.studyTimeMinutes === "number" &&
    (payload.mood === 1 || payload.mood === 2 || payload.mood === 3) &&
    (payload.notes == null || typeof payload.notes === "string") &&
    typeof payload.createdAt === "string" &&
    typeof payload.updatedAt === "string"
  )
}

function isBroadcastNotePayload(payload) {
  if (!isRecord(payload)) {
    return false
  }

  return (
    typeof payload.id === "string" &&
    (payload.type === "qa" || payload.type === "freeform") &&
    (payload.courseId == null || typeof payload.courseId === "string") &&
    (payload.courseTitle == null || typeof payload.courseTitle === "string") &&
    (payload.question == null || typeof payload.question === "string") &&
    typeof payload.previewText === "string" &&
    (payload.answer == null || typeof payload.answer === "string") &&
    (payload.body == null || typeof payload.body === "string") &&
    (payload.understandingLevel == null ||
      payload.understandingLevel === 1 ||
      payload.understandingLevel === 2 ||
      payload.understandingLevel === 3) &&
    typeof payload.flag === "boolean" &&
    typeof payload.hasCodeSnippet === "boolean" &&
    (payload.codeSnippet == null || typeof payload.codeSnippet === "string") &&
    typeof payload.codeLanguage === "string" &&
    typeof payload.createdAt === "string" &&
    typeof payload.updatedAt === "string" &&
    typeof payload.detailsLoaded === "boolean"
  )
}

async function configureSidePanel() {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  } catch (error) {
    console.error("Failed to configure side panel behavior", error)
  }
}

function normalizeTimerState(value) {
  if (!value || typeof value !== "object") {
    return { ...defaultTimerState }
  }

  const status =
    value.status === "running" ||
    value.status === "paused" ||
    value.status === "stopped"
      ? value.status
      : "idle"
  const startedAt = typeof value.startedAt === "number" ? value.startedAt : null
  const accumulatedMs =
    typeof value.accumulatedMs === "number" && value.accumulatedMs > 0
      ? value.accumulatedMs
      : 0
  const updatedAt = typeof value.updatedAt === "number" ? value.updatedAt : null

  return {
    status,
    startedAt,
    accumulatedMs,
    updatedAt,
  }
}

function getElapsedMs(state, now = Date.now()) {
  if (state.status === "running" && typeof state.startedAt === "number") {
    return state.accumulatedMs + Math.max(0, now - state.startedAt)
  }

  return state.accumulatedMs
}

function toPublicTimerState(state) {
  return {
    ...state,
    elapsedMs: getElapsedMs(state),
  }
}

async function readTimerState() {
  const result = await chrome.storage.local.get(TIMER_STATE_KEY)
  return normalizeTimerState(result[TIMER_STATE_KEY])
}

async function writeTimerState(state) {
  const nextState = {
    ...state,
    updatedAt: Date.now(),
  }

  await chrome.storage.local.set({
    [TIMER_STATE_KEY]: nextState,
  })

  const publicState = toPublicTimerState(nextState)

  try {
    await chrome.runtime.sendMessage({
      type: "timer:updated",
      state: publicState,
    })
  } catch {}

  return publicState
}

async function startTimer() {
  return writeTimerState({
    status: "running",
    startedAt: Date.now(),
    accumulatedMs: 0,
  })
}

async function pauseTimer() {
  const state = await readTimerState()

  if (state.status !== "running") {
    return toPublicTimerState(state)
  }

  return writeTimerState({
    status: "paused",
    startedAt: null,
    accumulatedMs: getElapsedMs(state),
  })
}

async function stopTimer() {
  const state = await readTimerState()

  if (
    state.status === "idle" ||
    (state.accumulatedMs === 0 && state.startedAt == null)
  ) {
    return toPublicTimerState(state)
  }

  return writeTimerState({
    status: "stopped",
    startedAt: null,
    accumulatedMs: getElapsedMs(state),
  })
}

async function resumeTimer() {
  const state = await readTimerState()

  if (state.status !== "paused") {
    return toPublicTimerState(state)
  }

  return writeTimerState({
    status: "running",
    startedAt: Date.now(),
    accumulatedMs: state.accumulatedMs,
  })
}

async function resetTimer() {
  return writeTimerState({
    status: "idle",
    startedAt: null,
    accumulatedMs: 0,
  })
}

function getTabPatterns(siteBaseUrl) {
  if (siteBaseUrl === "http://localhost:3000") {
    return ["http://localhost:3000/*"]
  }

  return [
    "https://rootlynotes.vercel.app/*",
    "https://www.rootlynotes.vercel.app/*",
  ]
}

async function broadcastToRootlyTabs({ messageType, payload, siteBaseUrl }) {
  const tabs = await chrome.tabs.query({
    url: getTabPatterns(siteBaseUrl),
  })

  await Promise.allSettled(
    tabs
      .filter((tab) => typeof tab.id === "number")
      .map((tab) =>
        chrome.tabs.sendMessage(tab.id, {
          type: messageType,
          payload,
        })
      )
  )
}

async function broadcastDailyEntryUpsert({ entry, siteBaseUrl }) {
  await broadcastToRootlyTabs({
    messageType: "daily-entry:upsert",
    siteBaseUrl,
    payload: {
      source: DAILY_ENTRY_WINDOW_SOURCE,
      type: DAILY_ENTRY_WINDOW_EVENT,
      entry,
    },
  })
}

async function broadcastNoteUpsert({ note, siteBaseUrl }) {
  await broadcastToRootlyTabs({
    messageType: "note:upsert",
    siteBaseUrl,
    payload: {
      source: NOTE_WINDOW_SOURCE,
      type: NOTE_WINDOW_EVENT,
      note,
    },
  })
}

chrome.runtime.onInstalled.addListener(() => {
  void configureSidePanel()
})

chrome.runtime.onStartup.addListener(() => {
  void configureSidePanel()
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (
    !message ||
    typeof message !== "object" ||
    typeof message.type !== "string"
  ) {
    return false
  }

  void (async () => {
    try {
      const sender = _sender

      switch (message.type) {
        case "timer:get-state":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({
            ok: true,
            state: toPublicTimerState(await readTimerState()),
          })
          return
        case "timer:start":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({ ok: true, state: await startTimer() })
          return
        case "timer:pause":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({ ok: true, state: await pauseTimer() })
          return
        case "timer:stop":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({ ok: true, state: await stopTimer() })
          return
        case "timer:resume":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({ ok: true, state: await resumeTimer() })
          return
        case "timer:reset":
          if (!isTrustedSidePanelSender(sender)) {
            sendResponse({ ok: false, error: "Unauthorized sender." })
            return
          }

          sendResponse({ ok: true, state: await resetTimer() })
          return
        case "broadcast:daily-entry-upsert":
          if (
            !isTrustedSidePanelSender(sender) ||
            !isAllowedSiteBaseUrl(message.siteBaseUrl) ||
            !isBroadcastDailyEntryPayload(message.entry)
          ) {
            sendResponse({ ok: false, error: "Invalid broadcast payload." })
            return
          }

          await broadcastDailyEntryUpsert(message)
          sendResponse({ ok: true })
          return
        case "broadcast:note-upsert":
          if (
            !isTrustedSidePanelSender(sender) ||
            !isAllowedSiteBaseUrl(message.siteBaseUrl) ||
            !isBroadcastNotePayload(message.note)
          ) {
            sendResponse({ ok: false, error: "Invalid broadcast payload." })
            return
          }

          await broadcastNoteUpsert(message)
          sendResponse({ ok: true })
          return
        default:
          sendResponse({ ok: false, error: "Unknown message type." })
      }
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Unexpected timer error."

      sendResponse({ ok: false, error: messageText })
    }
  })()

  return true
})
