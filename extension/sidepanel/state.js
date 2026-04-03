export const state = {
  activePanel: "capture",
  bootstrap: null,
  bootstrapCachedAt: null,
  coursePanelOpen: false,
  draftPersistHandle: null,
  pendingActionLocks: new Set(),
  draftState: {
    note: false,
    course: false,
    daily: false,
    timer: false,
  },
  noteCodeOpen: false,
  noteFlagged: false,
  noteType: "qa",
  pendingNoteCourseId: null,
  openSelect: null,
  settingsOpen: false,
  siteBaseUrl: null,
  selectValues: {
    noteCourse: "none",
    noteUnderstanding: "2",
    dailyMood: "2",
    timerMood: "2",
  },
  timer: null,
  timerDisplayHandle: null,
}

export const tabOrder = ["capture", "timer", "log"]

export const understandingOptions = [
  { value: "1", label: "Confused" },
  { value: "2", label: "Getting It" },
  { value: "3", label: "Clear" },
]

export const moodOptions = [
  { value: "1", label: "Burned Out" },
  { value: "2", label: "Neutral" },
  { value: "3", label: "Focused" },
]
