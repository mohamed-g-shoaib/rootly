import { createClient } from "@/lib/supabase/server"
import OverviewPageUI from "./ui/overview-page"

export default async function OverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <OverviewPageUI user={user} />
}
