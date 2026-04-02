import {
  PROD_BASE_URL,
  getSiteEnvironmentLabel,
  openRootlyPath,
  resolveSiteBaseUrl,
  setSiteBaseUrl,
} from "../lib/config.js"
import { apiFetch } from "../lib/api.js"
import {
  readBootstrapCache,
  readDrafts,
  writeBootstrapCache,
  writeDrafts,
  clearBootstrapCache,
} from "../lib/persistence.js"
import {
  formatStudyMinutes,
  formatTimerMs,
  getSavableTimerMinutes,
  toDateInputValue,
} from "../lib/time.js"
import { refs, selectRefs } from "./dom.js"
import {
  formatTodayLabel,
  getDisplayName,
  getTimerElapsedMs,
  renderNoteType,
  renderTimerState,
  renderTodayEntry,
  setActivePanel,
  setCoursePanelOpen,
  setError,
  setSettingsOpen,
  setSyncStatus,
  showSection,
} from "./render.js"
import { createSelectController } from "./selects.js"
import {
  moodOptions,
  state,
  tabOrder,
  understandingOptions,
} from "./state.js"

function getBootstrapCourses() {
  return state.bootstrap?.courses ?? []
}

function normalizeText(value) {
  return value.trim()
}

function parseClampedInteger(value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number.parseInt(value || "0", 10)

  if (Number.isNaN(parsed)) {
    return min
  }

  return Math.min(max, Math.max(min, parsed))
}

function getTodayEntryBaseline() {
  return {
    mood: String(state.bootstrap?.todayEntry?.mood ?? 2),
    notes: normalizeText(state.bootstrap?.todayEntry?.notes ?? ""),
  }
}

function serializeNoteDraft() {
  const question = normalizeText(refs.noteQuestionInput.value)
  const answer = normalizeText(refs.noteAnswerInput.value)
  const body = normalizeText(refs.noteBodyInput.value)
  const noteCourse = state.selectValues.noteCourse
  const understanding = state.selectValues.noteUnderstanding

  const hasDraft =
    state.noteType !== "qa" ||
    noteCourse !== "none" ||
    understanding !== "2" ||
    question.length > 0 ||
    answer.length > 0 ||
    body.length > 0

  if (!hasDraft) {
    return null
  }

  return {
    noteType: state.noteType,
    courseId: noteCourse,
    understanding,
    question,
    answer,
    body,
  }
}

function serializeCourseDraft() {
  const title = normalizeText(refs.courseTitleInput.value)
  const instructor = normalizeText(refs.courseInstructorInput.value)
  const courseLink = normalizeText(refs.courseLinkInput.value)

  if (!state.coursePanelOpen && !title && !instructor && !courseLink) {
    return null
  }

  return {
    open: state.coursePanelOpen,
    title,
    instructor,
    courseLink,
  }
}

function serializeDailyDraft() {
  const hours = parseClampedInteger(refs.logHours.value, { min: 0, max: 23 })
  const minutes = parseClampedInteger(refs.logMinutes.value, { min: 0, max: 59 })
  const mood = state.selectValues.dailyMood
  const notes = normalizeText(refs.dailyNoteInput.value)
  const baseline = getTodayEntryBaseline()

  if (hours === 0 && minutes === 0 && mood === baseline.mood && notes === baseline.notes) {
    return null
  }

  return {
    hours,
    minutes,
    mood,
    notes,
  }
}

function serializeTimerDraft() {
  const mood = state.selectValues.timerMood
  const notes = normalizeText(refs.timerNoteInput.value)
  const baseline = getTodayEntryBaseline()

  if (mood === baseline.mood && notes === baseline.notes) {
    return null
  }

  return {
    mood,
    notes,
  }
}

const draftSerializers = {
  note: serializeNoteDraft,
  course: serializeCourseDraft,
  daily: serializeDailyDraft,
  timer: serializeTimerDraft,
}

function buildDraftPayload() {
  return {
    note: serializeNoteDraft(),
    course: serializeCourseDraft(),
    daily: serializeDailyDraft(),
    timer: serializeTimerDraft(),
  }
}

function scheduleDraftPersist() {
  if (state.draftPersistHandle != null) {
    clearTimeout(state.draftPersistHandle)
  }

  state.draftPersistHandle = setTimeout(() => {
    state.draftPersistHandle = null
    void writeDrafts(buildDraftPayload())
  }, 180)
}

function syncDraftState(section, { persist = true } = {}) {
  state.draftState[section] = draftSerializers[section]() != null

  if (persist) {
    scheduleDraftPersist()
  }
}

function refreshDraftStates({ persist = true } = {}) {
  for (const section of Object.keys(draftSerializers)) {
    state.draftState[section] = draftSerializers[section]() != null
  }

  if (persist) {
    scheduleDraftPersist()
  }
}

function applyPendingNoteCourseSelection() {
  if (!state.pendingNoteCourseId) {
    return
  }

  const hasPendingCourse = getBootstrapCourses().some(
    (course) => course.id === state.pendingNoteCourseId
  )

  if (!hasPendingCourse) {
    return
  }

  state.selectValues.noteCourse = state.pendingNoteCourseId
  state.pendingNoteCourseId = null
}

function handleSelectValueChange(key, _value, { quiet }) {
  if (quiet) {
    return
  }

  if (key === "noteCourse") {
    state.pendingNoteCourseId = null
    syncDraftState("note")
    return
  }

  if (key === "noteUnderstanding") {
    syncDraftState("note")
    return
  }

  if (key === "dailyMood") {
    syncDraftState("daily")
    return
  }

  if (key === "timerMood") {
    syncDraftState("timer")
  }
}

const selectController = createSelectController({
  refs,
  selectRefs,
  state,
  understandingOptions,
  moodOptions,
  getBootstrapCourses,
  onValueChange: handleSelectValueChange,
})

function setDailyDraftFromEntry(todayEntry) {
  if (state.draftState.daily) {
    return
  }

  selectController.setSelectValue("dailyMood", String(todayEntry?.mood ?? 2), {
    close: false,
    quiet: true,
  })
  refs.dailyNoteInput.value = todayEntry?.notes ?? ""
  refs.logHours.value = "0"
  refs.logMinutes.value = "0"
}

function setTimerDraftFromEntry(todayEntry) {
  if (state.draftState.timer) {
    return
  }

  selectController.setSelectValue("timerMood", String(todayEntry?.mood ?? 2), {
    close: false,
    quiet: true,
  })
  refs.timerNoteInput.value = todayEntry?.notes ?? ""
}

function setNoteType(nextType) {
  state.noteType = nextType
  renderNoteType(refs, state)
  refs.noteSaveStatus.textContent = "Ready"
  syncDraftState("note")
}

function resetNoteForm() {
  refs.noteQuestionInput.value = ""
  refs.noteAnswerInput.value = ""
  refs.noteBodyInput.value = ""
  selectController.setSelectValue("noteUnderstanding", "2", {
    close: false,
    quiet: true,
  })
  selectController.renderAllSelects()
  renderNoteType(refs, state)
}

function resetCourseForm() {
  refs.courseTitleInput.value = ""
  refs.courseInstructorInput.value = ""
  refs.courseLinkInput.value = ""
}

function renderEnvironmentSettings() {
  const activeBaseUrl = state.siteBaseUrl ?? PROD_BASE_URL
  refs.settingsStatus.textContent = getSiteEnvironmentLabel(activeBaseUrl)
  refs.settingsHint.textContent = `The extension is currently using ${activeBaseUrl}.`

  for (const button of refs.siteEnvButtons) {
    const isActive = button.dataset.siteBaseUrl === activeBaseUrl
    button.classList.toggle("active", isActive)
    button.setAttribute("aria-pressed", String(isActive))
  }
}

async function hydrateEnvironmentSettings() {
  state.siteBaseUrl = await resolveSiteBaseUrl()
  renderEnvironmentSettings()
}

function renderBootstrap(data, { cachedAt = null } = {}) {
  state.bootstrap = data
  state.bootstrapCachedAt = cachedAt
  refs.todayLabel.textContent = formatTodayLabel(new Date())
  refs.greeting.textContent = `Welcome back, ${getDisplayName(data.user)}`
  refs.noteSaveStatus.textContent = "Ready"
  refs.courseSaveStatus.textContent = "Ready"
  refs.dailyLogStatus.textContent = "Ready"

  renderTodayEntry(
    refs,
    data.todayEntry,
    setDailyDraftFromEntry,
    setTimerDraftFromEntry
  )
  applyPendingNoteCourseSelection()
  selectController.renderAllSelects()
  renderNoteType(refs, state)
  setActivePanel(refs, state, state.activePanel)
  showSection(refs, "app")
  refreshDraftStates()
}

function getManualLogMinutes() {
  const hours = parseClampedInteger(refs.logHours.value, { min: 0, max: 23 })
  const minutes = parseClampedInteger(refs.logMinutes.value, { min: 0, max: 59 })

  refs.logHours.value = String(hours)
  refs.logMinutes.value = String(minutes)

  return hours * 60 + minutes
}

function updateBootstrapTodayEntry(entry) {
  if (!state.bootstrap) {
    return
  }

  state.bootstrap = {
    ...state.bootstrap,
    todayEntry: entry,
  }

  renderTodayEntry(refs, entry, setDailyDraftFromEntry, setTimerDraftFromEntry)
  refreshDraftStates()
}

function updateBootstrapCourses(courses) {
  if (!state.bootstrap) {
    return
  }

  state.bootstrap = {
    ...state.bootstrap,
    courses,
  }

  applyPendingNoteCourseSelection()
  selectController.renderSelect("noteCourse")
  syncDraftState("note")
}

async function saveDailyEntry({ addStudyTimeMinutes, source, mood, notes }) {
  const payload = {
    date: toDateInputValue(new Date()),
    addStudyTimeMinutes,
    mood: mood ?? Number(state.selectValues.dailyMood),
    notes: notes ?? refs.dailyNoteInput.value,
  }

  const result = await apiFetch("/api/extension/daily-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (source === "manual") {
    refs.logHours.value = "0"
    refs.logMinutes.value = "0"
    state.draftState.daily = false
  }

  if (source === "timer") {
    state.draftState.timer = false
  }

  updateBootstrapTodayEntry(result.entry)

  if (state.siteBaseUrl) {
    await writeBootstrapCache(state.siteBaseUrl, state.bootstrap)
  }

  if (source === "manual") {
    refs.dailyLogStatus.textContent = "Saved"
  }

  return result.entry
}

function buildNotePayload() {
  if (state.noteType === "qa") {
    const question = refs.noteQuestionInput.value.trim()
    const answer = refs.noteAnswerInput.value.trim()

    if (!question || !answer) {
      throw new Error("Add both a question and answer.")
    }

    return {
      type: "qa",
      courseId:
        state.selectValues.noteCourse === "none"
          ? null
          : state.selectValues.noteCourse,
      question,
      answer,
      understandingLevel: Number(state.selectValues.noteUnderstanding),
    }
  }

  const body = refs.noteBodyInput.value.trim()

  if (!body) {
    throw new Error("Write a quick note before saving.")
  }

  return {
    type: "freeform",
    courseId:
      state.selectValues.noteCourse === "none"
        ? null
        : state.selectValues.noteCourse,
    body,
  }
}

function buildCoursePayload() {
  const title = refs.courseTitleInput.value.trim()
  const instructor = refs.courseInstructorInput.value.trim()
  const courseLink = refs.courseLinkInput.value.trim()

  if (!title) {
    throw new Error("Add a course title.")
  }

  return {
    title,
    instructor: instructor || null,
    courseLink: courseLink || null,
  }
}

async function requestTimer(messageType) {
  const response = await chrome.runtime.sendMessage({ type: messageType })

  if (!response?.ok) {
    throw new Error(response?.error ?? "Timer request failed.")
  }

  renderTimerState(refs, state, response.state)
}

function handleTimerStateError() {
  if (state.timer) {
    return
  }

  refs.timerStatus.textContent = "Unavailable"
  refs.timerSavePanel.classList.add("hidden")
  refs.timerSaveHint.textContent =
    "Timer is unavailable right now. Reopen the panel if this keeps happening."
}

async function syncTimerState() {
  const response = await chrome.runtime.sendMessage({ type: "timer:get-state" })

  if (!response?.ok) {
    throw new Error(response?.error ?? "Failed to load timer state.")
  }

  renderTimerState(refs, state, response.state)
}

async function loadBootstrap() {
  const today = toDateInputValue(new Date())
  return apiFetch(`/api/extension/bootstrap?today=${today}`)
}

async function openLogin() {
  await openRootlyPath("/login")
}

async function bootstrapPanel({ preferCache = true } = {}) {
  const activeBaseUrl = state.siteBaseUrl ?? PROD_BASE_URL
  let hasRenderableData = state.bootstrap != null

  if (preferCache) {
    const cachedEntry = await readBootstrapCache(activeBaseUrl)

    if (cachedEntry) {
      renderBootstrap(cachedEntry.data, { cachedAt: cachedEntry.cachedAt })
      setSyncStatus(refs, "Showing cached Rootly data while refreshing.", "warning")
      hasRenderableData = true
    }
  }

  if (!hasRenderableData) {
    showSection(refs, "loading")
  }

  const bootstrapTask = (async () => {
    try {
      const bootstrapData = await loadBootstrap()

      if (state.siteBaseUrl !== activeBaseUrl) {
        return
      }

      renderBootstrap(bootstrapData)
      setSyncStatus(refs, "Synced with Rootly.", "positive")
      await writeBootstrapCache(activeBaseUrl, bootstrapData)
    } catch (error) {
      if (state.siteBaseUrl !== activeBaseUrl) {
        return
      }

      if (error?.status === 401) {
        await clearBootstrapCache(activeBaseUrl)
        state.bootstrap = null
        state.bootstrapCachedAt = null
        showSection(refs, "auth")
        return
      }

      if (state.bootstrap) {
        showSection(refs, "app")
        setSyncStatus(
          refs,
          "Showing cached Rootly data while Rootly reconnects.",
          "warning"
        )
        return
      }

      setError(
        refs,
        error instanceof Error
          ? error.message
          : "Failed to load Rootly side panel."
      )
    }
  })()

  const timerTask = syncTimerState().catch(() => {
    handleTimerStateError()
  })

  await Promise.allSettled([bootstrapTask, timerTask])
}

function startTimerDisplayTicker() {
  if (state.timerDisplayHandle != null) {
    clearInterval(state.timerDisplayHandle)
  }

  state.timerDisplayHandle = setInterval(() => {
    if (!state.timer || state.timer.status !== "running") {
      return
    }

    refs.timerValue.textContent = formatTimerMs(getTimerElapsedMs(state.timer))
  }, 1000)
}

async function handleManualDailyLogSave() {
  const addStudyTimeMinutes = getManualLogMinutes()

  if (addStudyTimeMinutes <= 0) {
    refs.dailyLogStatus.textContent = "Enter time"
    return
  }

  refs.dailyLogStatus.textContent = "Saving"

  try {
    await saveDailyEntry({
      addStudyTimeMinutes,
      source: "manual",
    })
  } catch (error) {
    refs.dailyLogStatus.textContent = "Retry"
    setError(
      refs,
      error instanceof Error ? error.message : "Failed to save today's log."
    )
  }
}

async function handleNoteSave() {
  refs.noteSave.disabled = true
  refs.noteSaveStatus.textContent = "Saving"

  try {
    const payload = buildNotePayload()
    await apiFetch("/api/extension/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    resetNoteForm()
    syncDraftState("note")
    refs.noteSaveStatus.textContent = "Saved"
  } catch (error) {
    refs.noteSaveStatus.textContent =
      error instanceof Error ? error.message : "Retry"
  } finally {
    refs.noteSave.disabled = false
  }
}

async function handleCourseSave() {
  refs.courseSave.disabled = true
  refs.courseSaveStatus.textContent = "Saving"

  try {
    const payload = buildCoursePayload()
    const result = await apiFetch("/api/extension/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const nextCourses = [result.course, ...getBootstrapCourses()]
      .filter(
        (course, index, allCourses) =>
          allCourses.findIndex((item) => item.id === course.id) === index
      )
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8)

    updateBootstrapCourses(nextCourses)
    selectController.setSelectValue("noteCourse", result.course.id, {
      close: false,
    })
    setCoursePanelOpen(refs, state, false)
    resetCourseForm()
    syncDraftState("course")
    refs.courseSaveStatus.textContent = "Saved"
  } catch (error) {
    refs.courseSaveStatus.textContent =
      error instanceof Error ? error.message : "Retry"
  } finally {
    refs.courseSave.disabled = false
  }
}

async function handleTimerSave() {
  if (
    !state.timer ||
    (state.timer.status !== "paused" && state.timer.status !== "stopped")
  ) {
    return
  }

  const savableMinutes = getSavableTimerMinutes(getTimerElapsedMs(state.timer))

  if (savableMinutes <= 0) {
    return
  }

  refs.timerSave.disabled = true
  refs.timerSaveHint.textContent =
    `Saving ${formatStudyMinutes(savableMinutes)} into today's Rootly total...`

  try {
    await saveDailyEntry({
      addStudyTimeMinutes: savableMinutes,
      source: "timer",
      mood: Number(state.selectValues.timerMood),
      notes: refs.timerNoteInput.value,
    })
    await requestTimer("timer:reset")
    refs.timerSaveHint.textContent =
      `Saved ${formatStudyMinutes(savableMinutes)} into today's Rootly total.`
    refs.dailyLogStatus.textContent = "Saved"
  } catch (error) {
    renderTimerState(refs, state, state.timer)
    refs.timerSaveHint.textContent =
      error instanceof Error ? error.message : "Failed to save timer."
  }
}

async function handleEnvironmentChange(nextBaseUrl) {
  refs.settingsHint.textContent = "Updating extension connection..."
  state.siteBaseUrl = await setSiteBaseUrl(nextBaseUrl)
  state.bootstrap = null
  state.bootstrapCachedAt = null
  renderEnvironmentSettings()
  await bootstrapPanel({ preferCache: true })
}

function moveTabFocus(currentPanel, direction) {
  const currentIndex = tabOrder.indexOf(currentPanel)
  const nextIndex = (currentIndex + direction + tabOrder.length) % tabOrder.length
  const nextPanel = tabOrder[nextIndex]
  const nextButton = document.getElementById(`tab-${nextPanel}`)

  if (nextButton) {
    setActivePanel(refs, state, nextPanel)
    nextButton.focus()
  }
}

function registerTabListeners() {
  refs.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.id.replace("tab-", "")
      setActivePanel(refs, state, panel)
    })

    button.addEventListener("keydown", (event) => {
      const panel = button.id.replace("tab-", "")

      if (event.key === "ArrowRight") {
        moveTabFocus(panel, 1)
        event.preventDefault()
      }

      if (event.key === "ArrowLeft") {
        moveTabFocus(panel, -1)
        event.preventDefault()
      }

      if (event.key === "Home") {
        setActivePanel(refs, state, tabOrder[0])
        refs.tabButtons[0].focus()
        event.preventDefault()
      }

      if (event.key === "End") {
        setActivePanel(refs, state, tabOrder[tabOrder.length - 1])
        refs.tabButtons[refs.tabButtons.length - 1].focus()
        event.preventDefault()
      }
    })
  })
}

function registerSelectListeners() {
  for (const [key, nodes] of Object.entries(selectRefs)) {
    nodes.trigger.addEventListener("click", () => {
      selectController.toggleSelect(key)
    })

    nodes.trigger.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        if (state.openSelect !== key) {
          selectController.toggleSelect(key)
        }

        selectController.focusFirstSelectOption(key)
        event.preventDefault()
      }

      if (event.key === "Escape") {
        selectController.closeSelects()
        event.preventDefault()
      }
    })
  }
}

function registerInputListeners() {
  refs.noteQuestionInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    syncDraftState("note")
  })
  refs.noteAnswerInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    syncDraftState("note")
  })
  refs.noteBodyInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    syncDraftState("note")
  })

  for (const input of [
    refs.courseTitleInput,
    refs.courseInstructorInput,
    refs.courseLinkInput,
  ]) {
    input.addEventListener("input", () => {
      refs.courseSaveStatus.textContent = "Ready"
      syncDraftState("course")
    })
  }

  for (const input of [refs.logHours, refs.logMinutes]) {
    input.addEventListener("input", () => {
      refs.dailyLogStatus.textContent = "Ready"
      syncDraftState("daily")
    })
  }

  refs.dailyNoteInput.addEventListener("input", () => {
    refs.dailyLogStatus.textContent = "Ready"
    syncDraftState("daily")
  })

  refs.timerNoteInput.addEventListener("input", () => {
    syncDraftState("timer")
  })
}

function registerActionListeners() {
  refs.loginButton.addEventListener("click", () => {
    void openLogin()
  })

  refs.dashboardLink.addEventListener("click", () => {
    void openRootlyPath("/overview")
  })

  refs.noteTypeQa.addEventListener("click", () => {
    setNoteType("qa")
  })
  refs.noteTypeFreeform.addEventListener("click", () => {
    setNoteType("freeform")
  })

  refs.courseDisclosure.addEventListener("click", () => {
    setCoursePanelOpen(refs, state, !state.coursePanelOpen)
    syncDraftState("course")
  })

  refs.settingsToggle.addEventListener("click", () => {
    setSettingsOpen(refs, state, !state.settingsOpen)
  })

  refs.siteEnvButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextBaseUrl = button.dataset.siteBaseUrl

      if (!nextBaseUrl || nextBaseUrl === state.siteBaseUrl) {
        return
      }

      void handleEnvironmentChange(nextBaseUrl)
    })
  })

  refs.noteSave.addEventListener("click", () => {
    void handleNoteSave()
  })
  refs.courseSave.addEventListener("click", () => {
    void handleCourseSave()
  })
  refs.dailyLogSave.addEventListener("click", () => {
    void handleManualDailyLogSave()
  })
  refs.timerStart.addEventListener("click", () => {
    void requestTimer("timer:start")
  })
  refs.timerPause.addEventListener("click", () => {
    void requestTimer("timer:pause")
  })
  refs.timerResume.addEventListener("click", () => {
    void requestTimer("timer:resume")
  })
  refs.timerStop.addEventListener("click", () => {
    void requestTimer("timer:stop")
  })
  refs.timerReset.addEventListener("click", () => {
    void requestTimer("timer:reset")
  })
  refs.timerSave.addEventListener("click", () => {
    void handleTimerSave()
  })
}

function registerDocumentListeners() {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target
    const clickedInsideSelect = Object.values(selectRefs).some(
      (nodes) => nodes.root && nodes.root.contains(target)
    )

    if (!clickedInsideSelect && state.openSelect != null) {
      selectController.closeSelects()
    }

    const clickedInsideSettings =
      refs.settingsPanel.contains(target) || refs.settingsToggle.contains(target)

    if (!clickedInsideSettings && state.settingsOpen) {
      setSettingsOpen(refs, state, false)
    }
  })

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      return
    }

    if (
      !refs.authSection.classList.contains("hidden") ||
      !refs.errorSection.classList.contains("hidden")
    ) {
      void bootstrapPanel({ preferCache: false })
      return
    }

    void bootstrapPanel({ preferCache: false })
  })
}

function registerRuntimeListeners() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "timer:updated" && message.state) {
      renderTimerState(refs, state, message.state)
    }
  })
}

async function hydrateStoredDrafts() {
  const drafts = await readDrafts()

  if (!drafts) {
    return
  }

  if (drafts.note) {
    state.noteType = drafts.note.noteType === "freeform" ? "freeform" : "qa"
    state.pendingNoteCourseId = drafts.note.courseId ?? null
    state.selectValues.noteCourse = "none"
    state.selectValues.noteUnderstanding = drafts.note.understanding ?? "2"
    refs.noteQuestionInput.value = drafts.note.question ?? ""
    refs.noteAnswerInput.value = drafts.note.answer ?? ""
    refs.noteBodyInput.value = drafts.note.body ?? ""
  }

  if (drafts.course) {
    refs.courseTitleInput.value = drafts.course.title ?? ""
    refs.courseInstructorInput.value = drafts.course.instructor ?? ""
    refs.courseLinkInput.value = drafts.course.courseLink ?? ""
    setCoursePanelOpen(refs, state, Boolean(drafts.course.open))
  }

  if (drafts.daily) {
    refs.logHours.value = String(drafts.daily.hours ?? 0)
    refs.logMinutes.value = String(drafts.daily.minutes ?? 0)
    state.selectValues.dailyMood = drafts.daily.mood ?? "2"
    refs.dailyNoteInput.value = drafts.daily.notes ?? ""
  }

  if (drafts.timer) {
    state.selectValues.timerMood = drafts.timer.mood ?? "2"
    refs.timerNoteInput.value = drafts.timer.notes ?? ""
  }

  refreshDraftStates({ persist: false })
}

async function initializeSidePanel() {
  selectController.renderAllSelects()
  setCoursePanelOpen(refs, state, false)
  setSettingsOpen(refs, state, false)
  setActivePanel(refs, state, state.activePanel)
  renderNoteType(refs, state)
  setSyncStatus(refs, "Checking your Rootly session.")
  await hydrateEnvironmentSettings()
  await hydrateStoredDrafts()
  selectController.renderAllSelects()
  renderNoteType(refs, state)
  registerTabListeners()
  registerSelectListeners()
  registerInputListeners()
  registerActionListeners()
  registerDocumentListeners()
  registerRuntimeListeners()
  startTimerDisplayTicker()
}

document.addEventListener("DOMContentLoaded", async () => {
  await initializeSidePanel()
  await bootstrapPanel({ preferCache: true })
})

