import type { Note } from "./notes-model"

export function buildMockCourses() {
  return [
    { id: "c1", title: "Advanced React Patterns" },
    { id: "c2", title: "Postgres Performance" },
    { id: "c3", title: "TypeScript Deep Dive" },
  ]
}

export function buildMockNotes(): Note[] {
  return [
    {
      id: "n1",
      type: "qa",
      courseId: "c1",
      courseTitle: "Advanced React Patterns",
      question: "When should you use useMemo?",
      answer:
        "Use it to memoize expensive derived values and avoid recalculating on every render.",
      body: null,
      understandingLevel: 2,
      flag: true,
      codeSnippet: null,
      codeLanguage: "text",
      createdAt: "2026-03-03T10:00:00Z",
      updatedAt: "2026-03-10T10:00:00Z",
    },
    {
      id: "n2",
      type: "qa",
      courseId: "c2",
      courseTitle: "Postgres Performance",
      question: "What is a partial index?",
      answer:
        "An index with a WHERE clause that only indexes a subset of rows, improving size and performance.",
      body: null,
      understandingLevel: 1,
      flag: false,
      codeSnippet:
        "CREATE INDEX CONCURRENTLY idx_orders_pending ON orders(customer_id) WHERE status = 'pending';",
      codeLanguage: "SQL",
      createdAt: "2026-03-04T10:00:00Z",
      updatedAt: "2026-03-08T10:00:00Z",
    },
    {
      id: "n3",
      type: "freeform",
      courseId: null,
      courseTitle: null,
      question: null,
      answer: null,
      body: "Notes from today's session: avoid data waterfalls by parallelizing independent requests. Suspense boundaries help stream UI progressively. Keep 'use client' low in the tree.",
      understandingLevel: null,
      flag: false,
      codeSnippet: "const [a, b] = await Promise.all([fetchA(), fetchB()])",
      codeLanguage: "TypeScript",
      createdAt: "2026-03-02T10:00:00Z",
      updatedAt: "2026-03-06T12:00:00Z",
    },
    {
      id: "n4",
      type: "freeform",
      courseId: "c3",
      courseTitle: "TypeScript Deep Dive",
      question: null,
      answer: null,
      body: "Reminder: prefer unknown over any. Narrow with type guards. Use discriminated unions instead of optional fields when modeling UI states.",
      understandingLevel: null,
      flag: true,
      codeSnippet: null,
      codeLanguage: "text",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z",
    },
  ]
}
