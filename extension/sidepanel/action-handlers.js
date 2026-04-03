import { normalizeText } from "./form-utils.js";

export function createActionHandlers({
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
  bootstrapPanel,
  renderEnvironmentSettings,
  updateBootstrapCourses,
  saveDailyEntry,
  requestTimer,
  broadcastNoteUpdate,
}) {
  function setNoteType(type) {
    state.noteType = type;
    clearNoteValidation(refs);
    renderNoteType(refs, state);
    refs.noteSaveStatus.textContent = "Ready";
    syncDraftState("note");
  }

  function setNoteFlagged(flagged) {
    state.noteFlagged = flagged;
    renderNoteOptions(refs, state);
    refs.noteSaveStatus.textContent = "Ready";
    syncDraftState("note");
  }

  function setNoteCodeOpen(isOpen) {
    state.noteCodeOpen = isOpen;

    if (!isOpen) {
      refs.noteCodeInput.value = "";
      refs.noteCodeLanguageInput.value = "";
      clearFieldInvalid(refs.noteCodeInput);
    }

    renderNoteOptions(refs, state);
    refs.noteSaveStatus.textContent = "Ready";
    syncDraftState("note");
  }

  function resetNoteForm() {
    state.noteType = "qa";
    state.pendingNoteCourseId = null;
    refs.noteQuestionInput.value = "";
    refs.noteAnswerInput.value = "";
    refs.noteBodyInput.value = "";
    refs.noteCodeInput.value = "";
    refs.noteCodeLanguageInput.value = "";
    state.noteFlagged = false;
    state.noteCodeOpen = false;
    clearNoteValidation(refs);
    selectController.setSelectValue("noteUnderstanding", "2", {
      close: false,
      quiet: true,
    });
    selectController.setSelectValue("noteCourse", "none", {
      close: false,
      quiet: true,
    });
    selectController.renderAllSelects();
    renderNoteType(refs, state);
    renderNoteOptions(refs, state);
  }

  function resetCourseForm() {
    clearCourseValidation(refs);
    refs.courseTitleInput.value = "";
    refs.courseInstructorInput.value = "";
    refs.courseLinkInput.value = "";
  }

  function resetDailyLogInputs() {
    clearDailyValidation(refs);
    refs.logHours.value = "0";
    refs.logMinutes.value = "0";
  }

  function resetTimerSaveForm() {
    selectController.setSelectValue("timerMood", "2", {
      close: false,
      quiet: true,
    });
    refs.timerNoteInput.value = "";
  }

  function buildNotePayload() {
    clearNoteValidation(refs);

    const question = refs.noteQuestionInput.value.trim();
    const answer = refs.noteAnswerInput.value.trim();
    const body = refs.noteBodyInput.value.trim();
    const codeSnippet = refs.noteCodeInput.value.trim();
    const codeLanguage = refs.noteCodeLanguageInput.value.trim();

    if (state.noteType === "qa") {
      let hasError = false;

      if (!question) {
        setFieldInvalid(refs.noteQuestionInput, true);
        hasError = true;
      }

      if (!answer) {
        setFieldInvalid(refs.noteAnswerInput, true);
        hasError = true;
      }

      if (hasError) {
        throw new Error("Add both a question and answer.");
      }

      if (state.noteCodeOpen && !codeSnippet) {
        setFieldInvalid(refs.noteCodeInput, true);
        throw new Error("Add a code snippet or turn the code option off.");
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
        flag: state.noteFlagged,
        codeSnippet: state.noteCodeOpen ? codeSnippet : null,
        codeLanguage,
      };
    }

    if (!body) {
      setFieldInvalid(refs.noteBodyInput, true);
      throw new Error("Write a quick note before saving.");
    }

    if (state.noteCodeOpen && !codeSnippet) {
      setFieldInvalid(refs.noteCodeInput, true);
      throw new Error("Add a code snippet or turn the code option off.");
    }

    return {
      type: "freeform",
      courseId:
        state.selectValues.noteCourse === "none"
          ? null
          : state.selectValues.noteCourse,
      body,
      flag: state.noteFlagged,
      codeSnippet: state.noteCodeOpen ? codeSnippet : null,
      codeLanguage,
    };
  }

  function buildCoursePayload() {
    clearCourseValidation(refs);

    const title = refs.courseTitleInput.value.trim();
    const instructor = refs.courseInstructorInput.value.trim();
    const courseLink = refs.courseLinkInput.value.trim();

    if (!title) {
      setFieldInvalid(refs.courseTitleInput, true);
      throw new Error("Add a course title.");
    }

    return {
      title,
      instructor: instructor || null,
      courseLink: normalizeText(courseLink) || null,
    };
  }

  async function handleManualDailyLogSave() {
    if (state.pendingActionLocks.has("save:daily")) {
      return;
    }

    await withActionLock("save:daily", async () => {
      setButtonLoading(refs.dailyLogSave, true, "Saving...");
      clearDailyValidation(refs);

      const addStudyTimeMinutes = getManualLogMinutes(refs);

      if (addStudyTimeMinutes <= 0) {
        refs.dailyLogStatus.textContent = "Enter time";
        setFieldInvalid(refs.logHours, true);
        setFieldInvalid(refs.logMinutes, true);
        setButtonLoading(refs.dailyLogSave, false);
        return;
      }

      refs.dailyLogStatus.textContent = "Saving";

      try {
        await saveDailyEntry({
          addStudyTimeMinutes,
          source: "manual",
        });

        resetDailyLogInputs();
        state.draftState.daily = false;
        syncDraftState("daily");
        refs.dailyLogStatus.textContent = "Saved";
      } catch (error) {
        refs.dailyLogStatus.textContent =
          error instanceof Error
            ? error.message
            : "Failed to save today's log.";
      } finally {
        setButtonLoading(refs.dailyLogSave, false);
      }
    });
  }

  async function handleNoteSave() {
    if (state.pendingActionLocks.has("save:note")) {
      return;
    }

    await withActionLock("save:note", async () => {
      setButtonLoading(refs.noteSave, true, "Saving...");
      refs.noteSaveStatus.textContent = "Saving";

      try {
        const payload = buildNotePayload();
        const result = await apiFetch("/api/extension/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (result?.note) {
          await broadcastNoteUpdate(result.note);
        }

        resetNoteForm();
        state.draftState.note = false;
        syncDraftState("note");
        refs.noteSaveStatus.textContent = "Saved";
      } catch (error) {
        refs.noteSaveStatus.textContent =
          error instanceof Error ? error.message : "Retry";
      } finally {
        setButtonLoading(refs.noteSave, false);
      }
    });
  }

  async function handleCourseSave() {
    if (state.pendingActionLocks.has("save:course")) {
      return;
    }

    await withActionLock("save:course", async () => {
      setButtonLoading(refs.courseSave, true, "Creating...");
      refs.courseSaveStatus.textContent = "Saving";

      try {
        const payload = buildCoursePayload();
        const result = await apiFetch("/api/extension/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const nextCourses = [result.course, ...getBootstrapCourses()]
          .filter(
            (course, index, allCourses) =>
              allCourses.findIndex((item) => item.id === course.id) === index,
          )
          .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, 8);

        updateBootstrapCourses(nextCourses);
        setCoursePanelOpen(refs, state, false);
        resetCourseForm();
        state.draftState.course = false;
        syncDraftState("course");
        refs.courseSaveStatus.textContent = "Saved";
      } catch (error) {
        refs.courseSaveStatus.textContent =
          error instanceof Error ? error.message : "Retry";
      } finally {
        setButtonLoading(refs.courseSave, false);
      }
    });
  }

  async function handleTimerSave() {
    if (
      !state.timer ||
      (state.timer.status !== "paused" && state.timer.status !== "stopped")
    ) {
      return;
    }

    const savableMinutes = getSavableTimerMinutes(
      getTimerElapsedMs(state.timer),
    );

    if (savableMinutes <= 0) {
      return;
    }

    if (state.pendingActionLocks.has("save:timer")) {
      return;
    }

    await withActionLock("save:timer", async () => {
      setButtonLoading(refs.timerSave, true, "Saving...");
      refs.timerSaveHint.textContent = `Saving ${formatStudyMinutes(savableMinutes)} into today's Rootly total...`;

      try {
        await saveDailyEntry({
          addStudyTimeMinutes: savableMinutes,
          source: "timer",
          mood: Number(state.selectValues.timerMood),
          notes: refs.timerNoteInput.value,
        });

        await requestTimer("timer:reset");
        resetTimerSaveForm();
        state.draftState.timer = false;
        syncDraftState("timer");
        refs.timerSaveHint.textContent = `Saved ${formatStudyMinutes(savableMinutes)} into today's Rootly total.`;
        refs.dailyLogStatus.textContent = "Saved";
      } catch (error) {
        refs.timerSaveHint.textContent =
          error instanceof Error ? error.message : "Failed to save timer.";
      } finally {
        setButtonLoading(refs.timerSave, false);
      }
    });
  }

  async function handleEnvironmentChange(nextBaseUrl, button) {
    setButtonLoading(button, true, "Switching...");
    refs.siteEnvButtons.forEach((node) => {
      if (node !== button) {
        node.disabled = true;
      }
    });
    refs.settingsHint.textContent = "Updating extension connection...";

    try {
      state.siteBaseUrl = await setSiteBaseUrl(nextBaseUrl);
      state.bootstrap = null;
      state.bootstrapCachedAt = null;
      renderEnvironmentSettings();
      await bootstrapPanel({ preferCache: true });
    } finally {
      refs.siteEnvButtons.forEach((node) => {
        node.disabled = false;
      });
      setButtonLoading(button, false);
    }
  }

  return {
    handleCourseSave,
    handleEnvironmentChange,
    handleManualDailyLogSave,
    handleNoteSave,
    handleTimerSave,
    setNoteCodeOpen,
    setNoteFlagged,
    setNoteType,
  };
}
