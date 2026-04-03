import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import NotesPageUI from "@/app/notes/ui/notes-page";
import { buildNotePreview, type Note } from "@/app/notes/ui/notes-model";
import { getDashboardUserId } from "@/lib/dashboard-session";
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notes",
};

async function getInitialNotesData(userId: string) {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`notes:user:${userId}`);
  cacheTag(`courses:user:${userId}`);

  const supabase = await createClient();

  type NoteRow = {
    id: string;
    type: "qa" | "freeform";
    course_id: string | null;
    question: string | null;
    answer: string | null;
    body: string | null;
    understanding_level: 1 | 2 | 3 | null;
    flag: boolean;
    code_snippet: string | null;
    code_language: string;
    created_at: string;
    updated_at: string;
    courses: { title: string }[] | { title: string } | null;
  };

  const [{ data: noteRows }, { data: courseRows }] = await Promise.all([
    supabase
      .from("notes")
      .select(
        "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)",
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id,title")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
  ]);

  const initialNotes: Note[] =
    (noteRows as NoteRow[] | null)?.map((row) => ({
      id: row.id,
      type: row.type,
      courseId: row.course_id,
      courseTitle: Array.isArray(row.courses)
        ? (row.courses[0]?.title ?? null)
        : (row.courses?.title ?? null),
      question: row.question,
      previewText: buildNotePreview({
        type: row.type,
        answer: row.answer,
        body: row.body,
      }),
      answer: null,
      body: null,
      understandingLevel: row.understanding_level,
      flag: row.flag,
      hasCodeSnippet: Boolean(row.code_snippet),
      codeSnippet: null,
      codeLanguage: row.code_language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      detailsLoaded: false,
    })) ?? [];

  const initialCourses: { id: string; title: string }[] =
    (courseRows as Array<{ id: string; title: string }> | null)?.map((c) => ({
      id: c.id,
      title: c.title,
    })) ?? [];

  return { initialNotes, initialCourses };
}

export default async function NotesPage() {
  const perf = createDashboardRoutePerf("/notes");
  const notesPerf = perf.createScope("notes");
  const userId = await perf.measure(
    "session",
    () => getDashboardUserId(),
    (currentUserId) => ({
      authenticated: Boolean(currentUserId),
    }),
  );

  const { initialNotes, initialCourses } = userId
    ? await notesPerf.measure(
        "query-notes",
        () => getInitialNotesData(userId),
        (result) => ({
          rows: result.initialNotes.length,
          courses: result.initialCourses.length,
        }),
      )
    : {
        initialNotes: [] as Note[],
        initialCourses: [] as { id: string; title: string }[],
      };

  perf.finish({
    notes: initialNotes.length,
    courses: initialCourses.length,
  });

  return (
    <NotesPageUI
      userId={userId}
      initialNotes={initialNotes}
      initialCourses={initialCourses}
    />
  );
}
