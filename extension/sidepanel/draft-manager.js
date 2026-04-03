import { normalizeText, parseClampedInteger } from "./form-utils.js"

export function createDraftManager({
  refs,
  state,
  readDrafts,
  writeDrafts,
  selectController,
  getBootstrapCourses,
  setCoursePanelOpen,
}) {
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
    const codeSnippet = normalizeText(refs.noteCodeInput.value)
    const codeLanguage = normalizeText(refs.noteCodeLanguageInput.value)
    const noteCourse = state.selectValues.noteCourse
    const understanding = state.selectValues.noteUnderstanding

    const hasDraft =
      state.noteType !== "qa" ||
      state.noteFlagged ||
      state.noteCodeOpen ||
      noteCourse !== "none" ||
      understanding !== "2" ||
      question.length > 0 ||
      answer.length > 0 ||
      body.length > 0 ||
      codeSnippet.length > 0 ||
      codeLanguage.length > 0

    if (!hasDraft) {
      return null
    }

    return {
      noteType: state.noteType,
      flagged: state.noteFlagged,
      codeOpen: state.noteCodeOpen,
      courseId: noteCourse,
      understanding,
      question,
      answer,
      body,
      codeSnippet,
      codeLanguage,
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
    const minutes = parseClampedInteger(refs.logMinutes.value, {
      min: 0,
      max: 59,
    })
    const mood = state.selectValues.dailyMood
    const notes = normalizeText(refs.dailyNoteInput.value)
    const baseline = getTodayEntryBaseline()

    if (
      hours === 0 &&
      minutes === 0 &&
      mood === baseline.mood &&
      notes === baseline.notes
    ) {
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

  function setDailyDraftFromEntry(todayEntry) {
    if (state.draftState.daily) {
      return
    }

    selectController.setSelectValue(
      "dailyMood",
      String(todayEntry?.mood ?? 2),
      {
        close: false,
        quiet: true,
      }
    )
    refs.dailyNoteInput.value = todayEntry?.notes ?? ""
    refs.logHours.value = "0"
    refs.logMinutes.value = "0"
  }

  function setTimerDraftFromEntry(_todayEntry) {
    if (state.draftState.timer) {
      return
    }

    selectController.setSelectValue("timerMood", "2", {
      close: false,
      quiet: true,
    })
    refs.timerNoteInput.value = ""
  }

  async function hydrateStoredDrafts() {
    const drafts = await readDrafts()

    if (!drafts) {
      return
    }

    if (drafts.note) {
      state.noteType = drafts.note.noteType === "freeform" ? "freeform" : "qa"
      state.noteFlagged = Boolean(drafts.note.flagged)
      state.noteCodeOpen = Boolean(drafts.note.codeOpen)
      state.pendingNoteCourseId = drafts.note.courseId ?? null
      state.selectValues.noteCourse = "none"
      state.selectValues.noteUnderstanding = drafts.note.understanding ?? "2"
      refs.noteQuestionInput.value = drafts.note.question ?? ""
      refs.noteAnswerInput.value = drafts.note.answer ?? ""
      refs.noteBodyInput.value = drafts.note.body ?? ""
      refs.noteCodeInput.value = drafts.note.codeSnippet ?? ""
      refs.noteCodeLanguageInput.value = drafts.note.codeLanguage ?? ""
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

  return {
    applyPendingNoteCourseSelection,
    hydrateStoredDrafts,
    refreshDraftStates,
    setDailyDraftFromEntry,
    setTimerDraftFromEntry,
    syncDraftState,
  }
}
