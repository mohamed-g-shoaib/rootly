export function createBootstrapController({
  refs,
  state,
  selectController,
  applyPendingNoteCourseSelection,
  setDailyDraftFromEntry,
  setTimerDraftFromEntry,
  refreshDraftStates,
  renderEnvironmentLabel,
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
}) {
  function renderEnvironmentSettings() {
    const activeBaseUrl = state.siteBaseUrl ?? PROD_BASE_URL;

    refs.settingsStatus.textContent = renderEnvironmentLabel(activeBaseUrl);
    refs.settingsHint.textContent = `The extension is currently using ${activeBaseUrl}.`;

    for (const button of refs.siteEnvButtons) {
      const isActive = button.dataset.siteBaseUrl === activeBaseUrl;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }
  }

  async function hydrateEnvironmentSettings() {
    state.siteBaseUrl = await resolveSiteBaseUrl();
    renderEnvironmentSettings();
  }

  function renderBootstrap(data, { cachedAt = null } = {}) {
    state.bootstrap = data;
    state.bootstrapCachedAt = cachedAt;
    refs.todayLabel.textContent = formatTodayLabel(new Date());
    refs.greeting.textContent = `Hi, ${getDisplayName(data.user)}`;
    refs.noteSaveStatus.textContent = "Ready";
    refs.courseSaveStatus.textContent = "Ready";
    refs.dailyLogStatus.textContent = "Ready";

    renderTodayEntry(
      refs,
      data.todayEntry,
      setDailyDraftFromEntry,
      setTimerDraftFromEntry,
    );

    applyPendingNoteCourseSelection();
    selectController.renderAllSelects();
    renderNoteType(refs, state);
    renderNoteOptions(refs, state);
    setActivePanel(refs, state, state.activePanel);
    showSection(refs, "app");
    refreshDraftStates();
  }

  function updateBootstrapCourses(courses) {
    if (!state.bootstrap) {
      return;
    }

    state.bootstrap = {
      ...state.bootstrap,
      courses,
    };

    selectController.renderAllSelects();
  }

  function updateBootstrapTodayEntry(entry, { syncTimerDraft = true } = {}) {
    if (!state.bootstrap) {
      return;
    }

    if (!state.draftState.daily) {
      setDailyDraftFromEntry(entry);
    }

    if (syncTimerDraft && !state.draftState.timer) {
      setTimerDraftFromEntry(entry);
    }

    state.bootstrap = {
      ...state.bootstrap,
      todayEntry: entry,
    };

    renderTodayEntry(
      refs,
      entry,
      setDailyDraftFromEntry,
      setTimerDraftFromEntry,
    );
  }

  async function broadcastDailyEntryUpdate(entry) {
    try {
      await chrome.runtime.sendMessage({
        type: "broadcast:daily-entry-upsert",
        entry,
        siteBaseUrl: state.siteBaseUrl ?? PROD_BASE_URL,
      });
    } catch {}
  }

  async function broadcastNoteUpdate(note) {
    try {
      await chrome.runtime.sendMessage({
        type: "broadcast:note-upsert",
        note,
        siteBaseUrl: state.siteBaseUrl ?? PROD_BASE_URL,
      });
    } catch {}
  }

  function getDailyEntryRequestPayload({
    addStudyTimeMinutes,
    mood,
    notes,
    source,
  }) {
    const payload = {
      date: toDateInputValue(new Date()),
      addStudyTimeMinutes,
      clientRequestId: crypto.randomUUID(),
    };

    const resolvedMood = mood ?? Number(state.selectValues.dailyMood);
    const resolvedNotes =
      notes ??
      (source === "timer"
        ? refs.timerNoteInput.value
        : refs.dailyNoteInput.value);

    return {
      ...payload,
      mood: resolvedMood,
      notes: resolvedNotes,
    };
  }

  async function saveDailyEntry({ addStudyTimeMinutes, source, mood, notes }) {
    const payload = getDailyEntryRequestPayload({
      addStudyTimeMinutes,
      mood,
      notes,
      source,
    });

    const result = await apiFetch("/api/extension/daily-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (result?.entry) {
      updateBootstrapTodayEntry(result.entry, {
        syncTimerDraft: source !== "timer",
      });
      await broadcastDailyEntryUpdate(result.entry);

      if (state.siteBaseUrl && state.bootstrap) {
        await writeBootstrapCache(state.siteBaseUrl, state.bootstrap);
      }
    }

    return result?.entry ?? null;
  }

  async function requestTimer(
    messageType,
    { button = null, loadingLabel = null } = {},
  ) {
    const unlock = await withActionLock(`timer:${messageType}`, async () => {
      setButtonLoading(button, true, loadingLabel);

      try {
        const response = await chrome.runtime.sendMessage({
          type: messageType,
        });

        if (!response?.ok) {
          throw new Error(response?.error ?? "Timer request failed.");
        }

        renderTimerState(refs, state, response.state);
        return response.state;
      } finally {
        setButtonLoading(button, false);
      }
    });

    return unlock;
  }

  function handleTimerStateError() {
    if (state.timer) {
      return;
    }

    refs.timerStatus.textContent = "Unavailable";
    refs.timerSavePanel.classList.add("hidden");
    refs.timerSaveHint.textContent =
      "Timer is unavailable right now. Reopen the panel if this keeps happening.";
  }

  async function syncTimerState() {
    const response = await chrome.runtime.sendMessage({
      type: "timer:get-state",
    });

    if (!response?.ok) {
      throw new Error(response?.error ?? "Failed to load timer state.");
    }

    renderTimerState(refs, state, response.state);
  }

  async function loadBootstrap() {
    const today = toDateInputValue(new Date());
    return apiFetch(`/api/extension/bootstrap?today=${today}`);
  }

  async function openLogin() {
    await openRootlyPath("/login");
  }

  async function bootstrapPanel({ preferCache = true } = {}) {
    const activeBaseUrl = state.siteBaseUrl ?? PROD_BASE_URL;
    let hasRenderableData = state.bootstrap != null;

    if (preferCache) {
      const cachedEntry = await readBootstrapCache(activeBaseUrl);

      if (cachedEntry) {
        renderBootstrap(cachedEntry.data, { cachedAt: cachedEntry.cachedAt });
        setSyncStatus(refs, "Using cache", "warning");
        hasRenderableData = true;
      }
    }

    if (!hasRenderableData) {
      showSection(refs, "loading");
    }

    const bootstrapTask = (async () => {
      try {
        const bootstrapData = await loadBootstrap();

        if (state.siteBaseUrl !== activeBaseUrl) {
          return;
        }

        renderBootstrap(bootstrapData);
        setSyncStatus(refs, "", "positive");
        await writeBootstrapCache(activeBaseUrl, bootstrapData);
      } catch (error) {
        if (state.siteBaseUrl !== activeBaseUrl) {
          return;
        }

        if (error?.status === 401) {
          await clearBootstrapCache(activeBaseUrl);
          state.bootstrap = null;
          state.bootstrapCachedAt = null;
          showSection(refs, "auth");
          return;
        }

        if (state.bootstrap) {
          showSection(refs, "app");
          setSyncStatus(refs, "Offline", "warning");
          return;
        }

        setError(
          refs,
          error instanceof Error
            ? error.message
            : "Failed to load Rootly side panel.",
        );
      }
    })();

    const timerTask = syncTimerState().catch(() => {
      handleTimerStateError();
    });

    await Promise.allSettled([bootstrapTask, timerTask]);
  }

  function startTimerDisplayTicker() {
    if (state.timerDisplayHandle != null) {
      clearInterval(state.timerDisplayHandle);
    }

    state.timerDisplayHandle = setInterval(() => {
      if (!state.timer || state.timer.status !== "running") {
        return;
      }

      refs.timerValue.textContent = formatTimerMs(
        getTimerElapsedMs(state.timer),
      );
    }, 1000);
  }

  return {
    bootstrapPanel,
    broadcastNoteUpdate,
    hydrateEnvironmentSettings,
    openLogin,
    renderEnvironmentSettings,
    requestTimer,
    saveDailyEntry,
    startTimerDisplayTicker,
    updateBootstrapCourses,
  };
}
