import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import CoursesPageUI from "@/app/courses/ui/courses-page";
import type { Course } from "@/app/courses/ui/courses-model";
import { getDashboardUserId } from "@/lib/dashboard-session";
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Courses",
};

const COURSES_PAGE_SIZE = 12;

async function getInitialCoursesData(userId: string) {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`courses:user:${userId}`);

  const supabase = await createClient();
  const initialCourses: Course[] = [];
  let initialCoursesTotal = 0;
  const initialTopicItems: string[] = [];

  const [{ data, count }, { data: topicRows }] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id,title,instructor,course_link,links,topics,progress,created_at,updated_at",
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .range(0, COURSES_PAGE_SIZE - 1),
    supabase.from("courses").select("topics").eq("user_id", userId),
  ]);

  initialCoursesTotal = count ?? 0;

  if (data) {
    for (const row of data as Array<{
      id: string;
      title: string;
      instructor: string | null;
      course_link: string | null;
      links: string[];
      topics: string[];
      progress: number;
      created_at: string;
      updated_at: string;
    }>) {
      initialCourses.push({
        id: row.id,
        title: row.title,
        instructor: row.instructor,
        courseLink: row.course_link,
        links: row.links,
        topics: row.topics,
        progress: row.progress,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }
  }

  if (topicRows) {
    for (const row of topicRows as Array<{ topics: string[] }>) {
      for (const topic of row.topics ?? []) {
        initialTopicItems.push(topic);
      }
    }
  }

  const uniqueTopicItems = Array.from(new Set(initialTopicItems)).toSorted(
    (a, b) => a.localeCompare(b),
  );

  return {
    initialCourses,
    initialCoursesTotal,
    uniqueTopicItems,
  };
}

export default async function CoursesPage() {
  const perf = createDashboardRoutePerf("/courses");
  const userId = await perf.measure(
    "session",
    () => getDashboardUserId(),
    (currentUserId) => ({
      authenticated: Boolean(currentUserId),
    }),
  );

  const { initialCourses, initialCoursesTotal, uniqueTopicItems } = userId
    ? await perf.measure(
        "courses-query",
        () => getInitialCoursesData(userId),
        (result) => ({
          rows: result.initialCourses.length,
        }),
      )
    : {
        initialCourses: [] as Course[],
        initialCoursesTotal: 0,
        uniqueTopicItems: [] as string[],
      };

  perf.finish({
    courses: initialCourses.length,
  });

  return (
    <CoursesPageUI
      userId={userId}
      initialCourses={initialCourses}
      initialCoursesTotal={initialCoursesTotal}
      coursesPageSize={COURSES_PAGE_SIZE}
      initialTopicItems={uniqueTopicItems}
    />
  );
}
