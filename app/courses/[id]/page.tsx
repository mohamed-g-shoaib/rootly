import { createClient } from "@/lib/supabase/server"
import CourseDetailPageUI from "../ui/course-detail-page"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <CourseDetailPageUI courseId={id} user={user} />
}
