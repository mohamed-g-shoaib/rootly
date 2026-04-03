function getOptionId(key, value) {
  return `select-${key}-option-${String(value).replace(/[^a-z0-9_-]/gi, "-")}`;
}

export function createSelectController({
  refs,
  selectRefs,
  state,
  understandingOptions,
  moodOptions,
  getBootstrapCourses,
  onValueChange,
}) {
  function getSelectOptions(key) {
    if (key === "noteCourse") {
      return [
        { value: "none", label: "No course", meta: "Optional" },
        ...getBootstrapCourses().map((course) => ({
          value: course.id,
          label: course.title,
          meta: "Course",
        })),
      ];
    }

    if (key === "noteUnderstanding") {
      return understandingOptions;
    }

    return moodOptions;
  }

  function getSelectValue(key) {
    return state.selectValues[key];
  }

  function getSelectOption(key, value = getSelectValue(key)) {
    return (
      getSelectOptions(key).find((option) => option.value === value) ?? null
    );
  }

  function ensureSelectValue(key) {
    const options = getSelectOptions(key);
    const currentValue = getSelectValue(key);

    if (!options.some((option) => option.value === currentValue)) {
      state.selectValues[key] = options[0]?.value ?? "";
    }
  }

  function setSelectValue(key, value, { close = true, quiet = false } = {}) {
    state.selectValues[key] = value;
    renderSelect(key);

    if (close) {
      closeSelects();
    }

    if (typeof onValueChange === "function") {
      onValueChange(key, state.selectValues[key], { quiet });
    }

    if (quiet) {
      return;
    }

    if (key === "noteCourse" || key === "noteUnderstanding") {
      refs.noteSaveStatus.textContent = "Ready";
      return;
    }

    if (key === "dailyMood") {
      refs.dailyLogStatus.textContent = "Ready";
      return;
    }

    if (
      key === "timerMood" &&
      (state.timer?.status === "paused" || state.timer?.status === "stopped")
    ) {
      refs.timerSaveHint.textContent =
        "Save this timer into today's Rootly total when you're ready.";
    }
  }

  function createOptionButton(key, option) {
    const button = document.createElement("button");
    const label = document.createElement("span");

    button.type = "button";
    button.id = getOptionId(key, option.value);
    button.className = "select-option";
    button.setAttribute("role", "option");
    button.setAttribute(
      "aria-selected",
      String(option.value === getSelectValue(key)),
    );
    button.classList.toggle("selected", option.value === getSelectValue(key));

    label.textContent = option.label;
    button.append(label);

    if (option.meta) {
      const meta = document.createElement("span");
      meta.className = "select-option-meta";
      meta.textContent = option.meta;
      button.append(meta);
    }

    button.addEventListener("click", () => {
      setSelectValue(key, option.value);
      selectRefs[key].trigger.focus();
    });
    button.addEventListener("keydown", (event) => {
      handleSelectOptionKeydown(event, key, button);
    });

    return button;
  }

  function renderSelect(key) {
    ensureSelectValue(key);

    const nodes = selectRefs[key];
    const options = getSelectOptions(key);
    const selected = getSelectOption(key);
    const isOpen = state.openSelect === key;

    nodes.label.textContent = selected?.label ?? "";
    nodes.trigger.setAttribute("aria-expanded", String(isOpen));
    nodes.list.setAttribute("aria-labelledby", nodes.trigger.id);

    if (selected) {
      nodes.trigger.setAttribute(
        "aria-activedescendant",
        getOptionId(key, selected.value),
      );
    } else {
      nodes.trigger.removeAttribute("aria-activedescendant");
    }

    if (nodes.chevron) {
      nodes.chevron.textContent = isOpen ? "-" : "+";
    }
    nodes.panel.classList.toggle("hidden", !isOpen);
    nodes.list.innerHTML = "";

    for (const option of options) {
      nodes.list.append(createOptionButton(key, option));
    }
  }

  function renderAllSelects() {
    renderSelect("noteCourse");
    renderSelect("noteUnderstanding");
    renderSelect("dailyMood");
    renderSelect("timerMood");
  }

  function closeSelects() {
    state.openSelect = null;
    renderAllSelects();
  }

  function toggleSelect(key) {
    state.openSelect = state.openSelect === key ? null : key;
    renderAllSelects();
  }

  function focusFirstSelectOption(key) {
    const selectedOption = selectRefs[key].list.querySelector(
      "button.select-option.selected",
    );

    if (selectedOption instanceof HTMLElement) {
      selectedOption.focus();
      return;
    }

    const firstOption = selectRefs[key].list.querySelector(
      "button.select-option",
    );
    if (firstOption instanceof HTMLElement) {
      firstOption.focus();
    }
  }

  function moveSelectOptionFocus(key, currentButton, direction) {
    const options = Array.from(
      selectRefs[key].list.querySelectorAll("button.select-option"),
    );
    const currentIndex = options.indexOf(currentButton);

    if (currentIndex === -1) {
      return;
    }

    const optionsLength = options.length;

    if (optionsLength === 0) {
      selectRefs[key].trigger.focus();
      return;
    }

    const wrappedIndex =
      (currentIndex + direction + optionsLength) % optionsLength;
    options[wrappedIndex]?.focus();
  }

  function focusBoundaryOption(key, boundary) {
    const options = Array.from(
      selectRefs[key].list.querySelectorAll("button.select-option"),
    );

    if (options.length === 0) {
      return;
    }

    if (boundary === "start") {
      options[0]?.focus();
      return;
    }

    options[options.length - 1]?.focus();
  }

  function handleSelectOptionKeydown(event, key, button) {
    if (event.key === "ArrowDown") {
      moveSelectOptionFocus(key, button, 1);
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      moveSelectOptionFocus(key, button, -1);
      event.preventDefault();
    }

    if (event.key === "Escape") {
      closeSelects();
      selectRefs[key].trigger.focus();
      event.preventDefault();
    }

    if (event.key === "Home") {
      focusBoundaryOption(key, "start");
      event.preventDefault();
    }

    if (event.key === "End") {
      focusBoundaryOption(key, "end");
      event.preventDefault();
    }

    if (event.key === "Tab") {
      closeSelects();
    }

    if (event.key === "Enter" || event.key === " ") {
      button.click();
      event.preventDefault();
    }
  }

  return {
    closeSelects,
    focusFirstSelectOption,
    renderAllSelects,
    renderSelect,
    setSelectValue,
    toggleSelect,
  };
}
