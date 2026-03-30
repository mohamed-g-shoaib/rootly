import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import {
  createRootlySocialImage,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@/lib/og-image"

export const alt = socialImageAlt
export const size = socialImageSize
export const contentType = socialImageContentType

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  let title = "Course"

  if (userId) {
    const { data: courseRow } = await supabase
      .from("courses")
      .select("title")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle()

    title = courseRow?.title ?? title
  }

  return createRootlySocialImage({
    eyebrow: "Course",
    title,
    description:
      "Keep your learning notes, progress, and review context connected in one deliberate study system.",
    url: "rootly.vercel.app/courses",
  })
}
