import test from "node:test"
import assert from "node:assert/strict"

import {
  formatTimerMs,
  formatStudyMinutes,
  getMsUntilNextMinute,
  getSavableTimerMinutes,
} from "./time.js"

test("formatTimerMs renders HH:MM:SS", () => {
  assert.equal(formatTimerMs(0), "00:00:00")
  assert.equal(formatTimerMs(61_000), "00:01:01")
  assert.equal(formatTimerMs(3_661_000), "01:01:01")
})

test("getSavableTimerMinutes floors partial minutes", () => {
  assert.equal(getSavableTimerMinutes(59_999), 0)
  assert.equal(getSavableTimerMinutes(60_000), 1)
  assert.equal(getSavableTimerMinutes(125_000), 2)
})

test("getMsUntilNextMinute returns remaining milliseconds", () => {
  assert.equal(getMsUntilNextMinute(60_000), 0)
  assert.equal(getMsUntilNextMinute(61_500), 58_500)
})

test("formatStudyMinutes keeps compact formatting", () => {
  assert.equal(formatStudyMinutes(45), "45m")
  assert.equal(formatStudyMinutes(60), "1h")
  assert.equal(formatStudyMinutes(135), "2h 15m")
})
