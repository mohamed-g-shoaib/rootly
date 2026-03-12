import { createClient } from "@/lib/supabase/server"
import ReviewPageUI from "./ui/review-page"

export default async function ReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <ReviewPageUI user={user} />
}
