import {
  PROD_BASE_URL,
  getSiteEnvironmentLabel,
  openRootlyPath,
  resolveSiteBaseUrl,
  setSiteBaseUrl,
} from "../lib/config.js";
import { apiFetch } from "../lib/api.js";
import {
  readBootstrapCache,
  readDrafts,
  writeBootstrapCache,
  writeDrafts,
  clearBootstrapCache,
} from "../lib/persistence.js";
import {
  formatStudyMinutes,
  formatTimerMs,
  getSavableTimerMinutes,
  toDateInputValue,
} from "../lib/time.js";
import { refs, selectRefs } from "./dom.js";
import {
  formatTodayLabel,
  getDisplayName,
  getTimerElapsedMs,
  renderNoteOptions,
  renderNoteType,
  renderTimerState,
  renderTodayEntry,
  setActivePanel,
  setCoursePanelOpen,
  setError,
  setSettingsOpen,
  setSyncStatus,
  showSection,
} from "./render.js";
import { createSelectController } from "./selects.js";
import {
  clearCourseValidation,
  clearDailyValidation,
  clearFieldInvalid,
  clearNoteValidation,
  getManualLogMinutes,
  setButtonLoading,
  setFieldInvalid,
} from "./form-utils.js";
import { createDraftManager } from "./draft-manager.js";
import {
  registerActionListeners,
  registerDocumentListeners,
  registerInputListeners,
  registerRuntimeListeners,
  registerSelectListeners,
  registerTabListeners,
} from "./listeners.js";
import { moodOptions, state, tabOrder, understandingOptions } from "./state.js";
import { createBootstrapController } from "./bootstrap-controller.js";
import { createActionHandlers } from "./action-handlers.js";

function getBootstrapCourses() {
  return state.bootstrap?.courses ?? [];
}

async function withActionLock(lockKey, task) {
  if (state.pendingActionLocks.has(lockKey)) {
    return null;
  }

  state.pendingActionLocks.add(lockKey);

  try {
    return await task();
  } finally {
    state.pendingActionLocks.delete(lockKey);
  }
}

let draftManager = null;

function syncDraftState(section, options) {
  draftManager?.syncDraftState(section, options);
}

function refreshDraftStates(options) {
  draftManager?.refreshDraftStates(options);
}

function applyPendingNoteCourseSelection() {
  draftManager?.applyPendingNoteCourseSelection();
}

function setDailyDraftFromEntry(todayEntry) {
  draftManager?.setDailyDraftFromEntry(todayEntry);
}

function setTimerDraftFromEntry(todayEntry) {
  draftManager?.setTimerDraftFromEntry(todayEntry);
}

function handleSelectValueChange(key, _value, { quiet }) {
  if (quiet) {
    return;
  }

  if (key === "noteCourse" || key === "noteUnderstanding") {
    if (key === "noteCourse") {
      state.pendingNoteCourseId = null;
    }

    syncDraftState("note");
    return;
  }

  if (key === "dailyMood") {
    syncDraftState("daily");
    return;
  }

  if (key === "timerMood") {
    syncDraftState("timer");
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
});

draftManager = createDraftManager({
  refs,
  state,
  readDrafts,
  writeDrafts,
  selectController,
  getBootstrapCourses,
  setCoursePanelOpen,
});

const bootstrapController = createBootstrapController({
  refs,
  state,
  selectController,
  applyPendingNoteCourseSelection,
  setDailyDraftFromEntry,
  setTimerDraftFromEntry,
  refreshDraftStates,
  renderEnvironmentLabel: getSiteEnvironmentLabel,
  resolveSiteBaseUrl,
  PROD_BASE_URL,
  openRootlyPath,
  apiFetch,
  toDateInputValue,
  readBootstrapCache,
  writeBootstrapCache,
  clearBootstrapCache,
  formatTodayLabel,
  getDisplayName,
  renderTodayEntry,
  renderNoteType,
  renderNoteOptions,
  setActivePanel,
  showSection,
  setSyncStatus,
  setError,
  renderTimerState,
  formatTimerMs,
  getTimerElapsedMs,
  withActionLock,
  setButtonLoading,
});

const actionHandlers = createActionHandlers({
  refs,
  state,
  selectController,
  syncDraftState,
  clearNoteValidation,
  clearCourseValidation,
  clearDailyValidation,
  clearFieldInvalid,
  setFieldInvalid,
  getManualLogMinutes,
  setButtonLoading,
  renderNoteType,
  renderNoteOptions,
  setCoursePanelOpen,
  apiFetch,
  formatStudyMinutes,
  getBootstrapCourses,
  getSavableTimerMinutes,
  getTimerElapsedMs,
  withActionLock,
  setSiteBaseUrl,
  bootstrapPanel: bootstrapController.bootstrapPanel,
  renderEnvironmentSettings: bootstrapController.renderEnvironmentSettings,
  updateBootstrapCourses: bootstrapController.updateBootstrapCourses,
  saveDailyEntry: bootstrapController.saveDailyEntry,
  requestTimer: bootstrapController.requestTimer,
  broadcastNoteUpdate: bootstrapController.broadcastNoteUpdate,
});

async function initializeSidePanel() {
  selectController.renderAllSelects();
  setCoursePanelOpen(refs, state, false);
  setSettingsOpen(refs, state, false);
  setActivePanel(refs, state, state.activePanel);
  renderNoteType(refs, state);
  renderNoteOptions(refs, state);
  setSyncStatus(refs, "");

  await bootstrapController.hydrateEnvironmentSettings();
  await draftManager.hydrateStoredDrafts();

  selectController.renderAllSelects();
  renderNoteType(refs, state);
  renderNoteOptions(refs, state);

  registerTabListeners({
    refs,
    state,
    tabOrder,
    setActivePanel,
  });

  registerSelectListeners({
    selectRefs,
    state,
    selectController,
  });

  registerInputListeners({
    refs,
    syncDraftState,
    clearFieldInvalid,
    clearDailyValidation,
  });

  registerActionListeners({
    refs,
    state,
    setNoteType: actionHandlers.setNoteType,
    setNoteFlagged: actionHandlers.setNoteFlagged,
    setNoteCodeOpen: actionHandlers.setNoteCodeOpen,
    setCoursePanelOpen,
    setSettingsOpen,
    syncDraftState,
    openLogin: bootstrapController.openLogin,
    openRootlyPath,
    handleEnvironmentChange: actionHandlers.handleEnvironmentChange,
    handleNoteSave: actionHandlers.handleNoteSave,
    handleCourseSave: actionHandlers.handleCourseSave,
    handleManualDailyLogSave: actionHandlers.handleManualDailyLogSave,
    requestTimer: bootstrapController.requestTimer,
    handleTimerSave: actionHandlers.handleTimerSave,
  });

  registerDocumentListeners({
    refs,
    selectRefs,
    state,
    selectController,
    setSettingsOpen,
    bootstrapPanel: bootstrapController.bootstrapPanel,
  });

  registerRuntimeListeners({
    refs,
    state,
    renderTimerState,
  });

  bootstrapController.startTimerDisplayTicker();
}

document.addEventListener("DOMContentLoaded", async () => {
  await initializeSidePanel();
  await bootstrapController.bootstrapPanel({ preferCache: true });
});
