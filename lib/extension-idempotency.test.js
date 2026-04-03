import test from "node:test"
import assert from "node:assert/strict"

import {
  buildExtensionIdempotencyKey,
  createInMemoryIdempotencyStore,
} from "./extension-idempotency.js"

test("buildExtensionIdempotencyKey returns stable composite key", () => {
  assert.equal(
    buildExtensionIdempotencyKey({
      userId: "user-1",
      date: "2026-04-03",
      requestId: "req-1",
    }),
    "user-1:2026-04-03:req-1"
  )
})

test("buildExtensionIdempotencyKey returns null for missing values", () => {
  assert.equal(
    buildExtensionIdempotencyKey({
      userId: "",
      date: "2026-04-03",
      requestId: "req-1",
    }),
    null
  )
})

test("idempotency store expires entries by ttl", () => {
  const store = createInMemoryIdempotencyStore({ ttlMs: 100, maxEntries: 5 })

  store.set("k1", { ok: true }, 0)
  assert.deepEqual(store.get("k1", 50), { ok: true })
  assert.equal(store.get("k1", 101), null)
})

test("idempotency store prunes oldest entries past max size", () => {
  const store = createInMemoryIdempotencyStore({ ttlMs: 1000, maxEntries: 2 })

  store.set("a", 1, 0)
  store.set("b", 2, 1)
  store.set("c", 3, 2)

  assert.equal(store.get("a", 3), null)
  assert.equal(store.get("b", 3), 2)
  assert.equal(store.get("c", 3), 3)
})
