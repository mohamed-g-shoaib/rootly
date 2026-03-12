import { createClient } from "@/lib/supabase/server"
import DailyEntriesPageUI from "./ui/daily-entries-page"

export default async function DailyEntriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <DailyEntriesPageUI user={user} />
}
