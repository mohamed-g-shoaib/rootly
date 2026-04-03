export function registerTabListeners({
  refs,
  state,
  tabOrder,
  setActivePanel,
}) {
  function moveTabFocus(currentPanel, direction) {
    const currentIndex = tabOrder.indexOf(currentPanel)
    const nextIndex =
      (currentIndex + direction + tabOrder.length) % tabOrder.length
    const nextPanel = tabOrder[nextIndex]
    const nextButton = document.getElementById(`tab-${nextPanel}`)

    if (nextButton) {
      setActivePanel(refs, state, nextPanel)
      nextButton.focus()
    }
  }

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

export function registerSelectListeners({
  selectRefs,
  state,
  selectController,
}) {
  for (const [key, nodes] of Object.entries(selectRefs)) {
    nodes.trigger.addEventListener("click", () => {
      selectController.toggleSelect(key)
    })

    nodes.trigger.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
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

export function registerInputListeners({
  refs,
  syncDraftState,
  clearFieldInvalid,
  clearDailyValidation,
}) {
  refs.noteQuestionInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    clearFieldInvalid(refs.noteQuestionInput)
    syncDraftState("note")
  })

  refs.noteAnswerInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    clearFieldInvalid(refs.noteAnswerInput)
    syncDraftState("note")
  })

  refs.noteBodyInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    clearFieldInvalid(refs.noteBodyInput)
    syncDraftState("note")
  })

  refs.noteCodeInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    clearFieldInvalid(refs.noteCodeInput)
    syncDraftState("note")
  })

  refs.noteCodeLanguageInput.addEventListener("input", () => {
    refs.noteSaveStatus.textContent = "Ready"
    syncDraftState("note")
  })

  refs.courseTitleInput.addEventListener("input", () => {
    refs.courseSaveStatus.textContent = "Ready"
    clearFieldInvalid(refs.courseTitleInput)
    syncDraftState("course")
  })

  for (const input of [refs.courseInstructorInput, refs.courseLinkInput]) {
    input.addEventListener("input", () => {
      refs.courseSaveStatus.textContent = "Ready"
      syncDraftState("course")
    })
  }

  for (const input of [refs.logHours, refs.logMinutes]) {
    input.addEventListener("input", () => {
      refs.dailyLogStatus.textContent = "Ready"
      clearDailyValidation(refs)
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

export function registerActionListeners({
  refs,
  state,
  setNoteType,
  setNoteFlagged,
  setNoteCodeOpen,
  setCoursePanelOpen,
  setSettingsOpen,
  syncDraftState,
  openLogin,
  openRootlyPath,
  handleEnvironmentChange,
  handleNoteSave,
  handleCourseSave,
  handleManualDailyLogSave,
  requestTimer,
  handleTimerSave,
}) {
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

  refs.noteFlagToggle.addEventListener("click", () => {
    setNoteFlagged(!state.noteFlagged)
  })

  refs.noteCodeToggle.addEventListener("click", () => {
    setNoteCodeOpen(!state.noteCodeOpen)
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

      void handleEnvironmentChange(nextBaseUrl, button)
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
    void requestTimer("timer:start", {
      button: refs.timerStart,
      loadingLabel: "Starting...",
    })
  })

  refs.timerPause.addEventListener("click", () => {
    void requestTimer("timer:pause", {
      button: refs.timerPause,
      loadingLabel: "Pausing...",
    })
  })

  refs.timerResume.addEventListener("click", () => {
    void requestTimer("timer:resume", {
      button: refs.timerResume,
      loadingLabel: "Resuming...",
    })
  })

  refs.timerStop.addEventListener("click", () => {
    void requestTimer("timer:stop", {
      button: refs.timerStop,
      loadingLabel: "Stopping...",
    })
  })

  refs.timerReset.addEventListener("click", () => {
    void requestTimer("timer:reset", {
      button: refs.timerReset,
      loadingLabel: "Resetting...",
    })
  })

  refs.timerSave.addEventListener("click", () => {
    void handleTimerSave()
  })
}

export function registerDocumentListeners({
  refs,
  selectRefs,
  state,
  selectController,
  setSettingsOpen,
  bootstrapPanel,
}) {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target
    const clickedInsideSelect = Object.values(selectRefs).some(
      (nodes) => nodes.root && nodes.root.contains(target)
    )

    if (!clickedInsideSelect && state.openSelect != null) {
      selectController.closeSelects()
    }

    const clickedInsideSettings =
      refs.settingsPanel.contains(target) ||
      refs.settingsToggle.contains(target)

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

export function registerRuntimeListeners({ refs, state, renderTimerState }) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "timer:updated" && message.state) {
      renderTimerState(refs, state, message.state)
    }
  })
}
