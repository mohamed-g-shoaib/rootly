const TIMER_STATE_KEY = "rootly.timerState"

const defaultTimerState = Object.freeze({
  status: "idle",
  startedAt: null,
  accumulatedMs: 0,
  updatedAt: null,
})

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

  if (state.status === "idle" || state.accumulatedMs === 0 && state.startedAt == null) {
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
      switch (message.type) {
        case "timer:get-state":
          sendResponse({
            ok: true,
            state: toPublicTimerState(await readTimerState()),
          })
          return
        case "timer:start":
          sendResponse({ ok: true, state: await startTimer() })
          return
        case "timer:pause":
          sendResponse({ ok: true, state: await pauseTimer() })
          return
        case "timer:stop":
          sendResponse({ ok: true, state: await stopTimer() })
          return
        case "timer:resume":
          sendResponse({ ok: true, state: await resumeTimer() })
          return
        case "timer:reset":
          sendResponse({ ok: true, state: await resetTimer() })
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
