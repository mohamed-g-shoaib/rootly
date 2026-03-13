"use server"

import { createClient } from "@/lib/supabase/server"

import type { Course } from "./courses-model"

type DbCourseRow = {
  id: string
  user_id: string
  title: string
  instructor: string | null
  course_link: string | null
  links: string[]
  topics: string[]
  progress: number
  created_at: string
  updated_at: string
}

function fromDb(row: DbCourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    instructor: row.instructor,
    courseLink: row.course_link,
    links: row.links,
    topics: row.topics,
    progress: row.progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDbInsert(course: Course, userId: string): DbCourseRow {
  return {
    id: course.id,
    user_id: userId,
    title: course.title,
    instructor: course.instructor,
    course_link: course.courseLink,
    links: course.links,
    topics: course.topics,
    progress: course.progress,
    created_at: course.createdAt,
    updated_at: course.updatedAt,
  }
}

export async function createCourse({
  course,
  userId,
}: {
  course: Course
  userId: string
}): Promise<{ success: true; data: Course } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .insert([toDbInsert(course, userId)])
    .select(
      "id,user_id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to create course" }
  }

  return { success: true, data: fromDb(data as DbCourseRow) }
}

export async function updateCourse({
  courseId,
  patch,
  userId,
}: {
  courseId: string
  patch: Partial<Course>
  userId: string
}): Promise<{ success: true; data: Course } | { success: false; error: string }> {
  const supabase = await createClient()

  const updatedAt = new Date().toISOString()

  const updatePayload: Partial<DbCourseRow> = {
    title: patch.title,
    instructor: patch.instructor,
    course_link: patch.courseLink,
    links: patch.links,
    topics: patch.topics,
    progress: patch.progress,
    updated_at: updatedAt,
  }

  const { data, error } = await supabase
    .from("courses")
    .update(updatePayload)
    .eq("id", courseId)
    .eq("user_id", userId)
    .select(
      "id,user_id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to update course" }
  }

  return { success: true, data: fromDb(data as DbCourseRow) }
}

export async function deleteCourse({
  courseId,
  userId,
}: {
  courseId: string
  userId: string
}): Promise<{ success: true; data: Course } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("user_id", userId)
    .select(
      "id,user_id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to delete course" }
  }

  return { success: true, data: fromDb(data as DbCourseRow) }
}
