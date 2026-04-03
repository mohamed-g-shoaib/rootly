export function normalizeText(value) {
  return value.trim()
}

export function parseClampedInteger(
  value,
  { min = 0, max = Number.MAX_SAFE_INTEGER } = {}
) {
  const parsed = Number.parseInt(value || "0", 10)

  if (Number.isNaN(parsed)) {
    return min
  }

  return Math.min(max, Math.max(min, parsed))
}

export function setFieldInvalid(node, isInvalid) {
  if (!node) {
    return
  }

  node.classList.toggle("is-invalid", isInvalid)

  if (typeof node.setAttribute === "function") {
    node.setAttribute("aria-invalid", String(isInvalid))
  }
}

export function clearFieldInvalid(node) {
  setFieldInvalid(node, false)
}

export function clearNoteValidation(refs) {
  ;[
    refs.noteQuestionInput,
    refs.noteAnswerInput,
    refs.noteBodyInput,
    refs.noteCodeInput,
  ].forEach(clearFieldInvalid)
}

export function clearCourseValidation(refs) {
  clearFieldInvalid(refs.courseTitleInput)
}

export function clearDailyValidation(refs) {
  clearFieldInvalid(refs.logHours)
  clearFieldInvalid(refs.logMinutes)
}

export function setButtonLoading(button, isLoading, loadingLabel) {
  if (!button) {
    return
  }

  if (isLoading) {
    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent ?? ""
    }

    if (loadingLabel) {
      button.textContent = loadingLabel
    }

    button.disabled = true
    button.classList.add("is-loading")
    button.setAttribute("aria-busy", "true")
    return
  }

  if (button.dataset.defaultLabel) {
    button.textContent = button.dataset.defaultLabel
  }

  button.classList.remove("is-loading")
  button.removeAttribute("aria-busy")
  button.disabled = false
}

export function getManualLogMinutes(refs) {
  const hours = parseClampedInteger(refs.logHours.value, { min: 0, max: 23 })
  const minutes = parseClampedInteger(refs.logMinutes.value, {
    min: 0,
    max: 59,
  })

  refs.logHours.value = String(hours)
  refs.logMinutes.value = String(minutes)

  return hours * 60 + minutes
}
