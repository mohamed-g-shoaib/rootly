import { createClient } from "@/lib/supabase/server"
import CoursesPageUI from "./ui/courses-page"

export default async function CoursesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <CoursesPageUI user={user} />
}
