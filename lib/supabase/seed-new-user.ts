import { createClient } from "@/lib/supabase/server"

export async function seedNewUser(userId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const now = new Date()

    const courses = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        title: "Advanced React Patterns",
        instructor: "Kent C. Dodds",
        course_link: "https://react.dev/learn",
        links: [
          "https://react.dev/learn",
          "https://nextjs.org/docs/app",
          "https://www.typescriptlang.org/docs/",
        ],
        topics: ["react", "patterns", "hooks", "composition"],
        progress: 42,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        title: "Postgres Performance",
        instructor: "Supabase",
        course_link: "https://supabase.com/docs/guides/database/overview",
        links: ["https://www.postgresql.org/docs/current/"],
        topics: ["postgres", "indexes", "query-plans"],
        progress: 10,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ]

    const primaryCourseId = courses[0]?.id

    const notes = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: "qa",
        course_id: primaryCourseId,
        question: "When should you use useMemo?",
        answer:
          "Use it to memoize expensive derived values and avoid recalculating on every render when inputs are stable.",
        body: null,
        understanding_level: 2,
        flag: true,
        code_snippet: null,
        code_language: "text",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: "qa",
        course_id: primaryCourseId,
        question: "What is a partial index?",
        answer:
          "A partial index indexes only the rows that match a WHERE predicate. It keeps indexes smaller and faster for hot subsets of data.",
        body: null,
        understanding_level: 1,
        flag: false,
        code_snippet:
          "CREATE INDEX CONCURRENTLY idx_orders_pending ON orders(customer_id) WHERE status = 'pending';",
        code_language: "sql",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: "freeform",
        course_id: primaryCourseId,
        question: null,
        answer: null,
        body: "Notes from today's session: keep client components small, avoid data waterfalls, and stream UI with Suspense boundaries.",
        understanding_level: null,
        flag: false,
        code_snippet: null,
        code_language: "text",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ]

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const entries = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        date: yesterday.toISOString().slice(0, 10),
        study_time_minutes: 75,
        mood: 3,
        notes:
          "Good momentum — refactored the card layouts and reviewed key concepts.",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        date: twoDaysAgo.toISOString().slice(0, 10),
        study_time_minutes: 45,
        mood: 2,
        notes: "Light session — mostly review.",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ]

    const { error: coursesError } = await supabase
      .from("courses")
      .insert(courses)
    if (coursesError) {
      console.error("seedNewUser: failed to insert courses", coursesError)
      return
    }

    const { error: notesError } = await supabase.from("notes").insert(notes)
    if (notesError) {
      console.error("seedNewUser: failed to insert notes", notesError)
    }

    const { error: entriesError } = await supabase
      .from("daily_entries")
      .insert(entries)
    if (entriesError) {
      console.error("seedNewUser: failed to insert daily entries", entriesError)
    }
  } catch (err) {
    console.error("seedNewUser: unexpected error", err)
  }
}
