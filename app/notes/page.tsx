import { createClient } from "@/lib/supabase/server"
import NotesPageUI from "./ui/notes-page"

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <NotesPageUI user={user} />
}
