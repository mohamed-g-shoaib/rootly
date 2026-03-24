import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LoginPageUI from "./ui/login-page"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Rootly to continue your learning notebook.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/overview")
  }

  return <LoginPageUI />
}
