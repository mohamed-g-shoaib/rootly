import {
  formatStudyMinutes,
  formatTimerMs,
  getMsUntilNextMinute,
  getSavableTimerMinutes,
  moodLabel,
} from "../lib/time.js"

export function showSection(refs, section) {
  refs.loadingSection.classList.toggle("hidden", section !== "loading")
  refs.authSection.classList.toggle("hidden", section !== "auth")
  refs.appSection.classList.toggle("hidden", section !== "app")
  refs.errorSection.classList.toggle("hidden", section !== "error")
}

export function setError(refs, message) {
  refs.errorMessage.textContent = message
  showSection(refs, "error")
}

export function setSyncStatus(refs, message, tone = "neutral") {
  refs.syncStatus.textContent = message
  refs.syncStatus.dataset.tone = tone
}

export function formatTodayLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function getTimerElapsedMs(timerState, now = Date.now()) {
  if (
    timerState?.status === "running" &&
    typeof timerState.startedAt === "number"
  ) {
    return timerState.accumulatedMs + Math.max(0, now - timerState.startedAt)
  }

  if (typeof timerState?.elapsedMs === "number") {
    return timerState.elapsedMs
  }

  return timerState?.accumulatedMs ?? 0
}

function formatSecondsLabel(totalMs) {
  const totalSeconds = Math.ceil(totalMs / 1000)

  if (totalSeconds <= 1) {
    return "1 second"
  }

  return `${totalSeconds} seconds`
}

function getTimerSaveHint(timerState) {
  const elapsedMs = getTimerElapsedMs(timerState)
  const savableMinutes = getSavableTimerMinutes(elapsedMs)

  if (timerState.status === "running") {
    return "Pause or stop the timer, then save it into today's total."
  }

  if (savableMinutes <= 0) {
    return `This session becomes savable in ${formatSecondsLabel(getMsUntilNextMinute(elapsedMs))}.`
  }

  const saveCopy = `Saving now adds ${formatStudyMinutes(savableMinutes)} to today's Rootly total.`

  if (timerState.status === "paused") {
    return `${saveCopy} Session paused and ready to save.`
  }

  if (timerState.status === "stopped") {
    return `${saveCopy} Session stopped and ready to save.`
  }

  return saveCopy
}

export function setCoursePanelOpen(refs, state, isOpen) {
  state.coursePanelOpen = isOpen
  refs.coursePanel.classList.toggle("hidden", !isOpen)
  refs.courseDisclosure.setAttribute("aria-expanded", String(isOpen))
  refs.courseDisclosureIcon.textContent = isOpen ? "-" : "+"
}

export function setSettingsOpen(refs, state, isOpen) {
  state.settingsOpen = isOpen
  refs.settingsPanel.classList.toggle("hidden", !isOpen)
  refs.settingsToggle.setAttribute("aria-expanded", String(isOpen))
}

export function renderNoteType(refs, state) {
  const isQa = state.noteType === "qa"

  refs.noteTypeQa.classList.toggle("active", isQa)
  refs.noteTypeQa.classList.toggle("secondary-button", isQa)
  refs.noteTypeQa.classList.toggle("ghost-button", !isQa)
  refs.noteTypeQa.setAttribute("aria-pressed", String(isQa))

  refs.noteTypeFreeform.classList.toggle("active", !isQa)
  refs.noteTypeFreeform.classList.toggle("secondary-button", !isQa)
  refs.noteTypeFreeform.classList.toggle("ghost-button", isQa)
  refs.noteTypeFreeform.setAttribute("aria-pressed", String(!isQa))

  refs.qaFields.classList.toggle("hidden", !isQa)
  refs.freeformFields.classList.toggle("hidden", isQa)
}

export function setActivePanel(refs, state, panel) {
  state.activePanel = panel

  for (const button of refs.tabButtons) {
    const isActive = button.id === `tab-${panel}`
    button.classList.toggle("active", isActive)
    button.setAttribute("aria-selected", String(isActive))
    button.tabIndex = isActive ? 0 : -1
  }

  for (const [panelName, node] of Object.entries(refs.tabPanels)) {
    node.classList.toggle("hidden", panelName !== panel)
  }
}

export function getDisplayName(user) {
  return user.fullName || user.name || user.email || "there"
}

export function renderTodayEntry(refs, todayEntry, onDailyDraft, onTimerDraft) {
  if (!todayEntry) {
    refs.todayTime.textContent = "0m"
    refs.todayMood.textContent = "Not set"
    refs.todayNote.textContent = "No note logged yet for today."
    onDailyDraft(null)
    onTimerDraft(null)
    return
  }

  refs.todayTime.textContent = formatStudyMinutes(todayEntry.studyTimeMinutes)
  refs.todayMood.textContent = moodLabel(todayEntry.mood)
  refs.todayNote.textContent =
    todayEntry.notes && todayEntry.notes.trim().length > 0
      ? todayEntry.notes
      : "No note logged yet for today."

  onDailyDraft(todayEntry)
  onTimerDraft(todayEntry)
}

export function renderTimerState(refs, state, timerState) {
  state.timer = timerState
  refs.timerValue.textContent = formatTimerMs(getTimerElapsedMs(timerState))

  const labelByStatus = {
    idle: "Idle",
    running: "Running",
    paused: "Paused",
    stopped: "Stopped",
  }

  refs.timerStatus.textContent = labelByStatus[timerState.status] || "Idle"
  refs.timerStart.classList.toggle("hidden", timerState.status !== "idle")
  refs.timerPause.classList.toggle("hidden", timerState.status !== "running")
  refs.timerResume.classList.toggle("hidden", timerState.status !== "paused")
  refs.timerStop.classList.toggle(
    "hidden",
    timerState.status !== "running" && timerState.status !== "paused"
  )

  const elapsedMs = getTimerElapsedMs(timerState)
  const hasElapsedTime = elapsedMs > 0
  const savableMinutes = getSavableTimerMinutes(elapsedMs)
  const canSaveTimer =
    (timerState.status === "paused" || timerState.status === "stopped") &&
    savableMinutes > 0

  refs.timerSavePanel.classList.toggle("hidden", !hasElapsedTime)
  refs.timerSave.disabled = !canSaveTimer
  refs.timerSave.textContent =
    savableMinutes > 0 ? `Save ${formatStudyMinutes(savableMinutes)} to today` : "Save timer to today"
  refs.timerSaveHint.textContent = getTimerSaveHint(timerState)
}
