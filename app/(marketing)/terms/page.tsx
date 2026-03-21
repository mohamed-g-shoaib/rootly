import { LegalPageShell } from "../ui/legal-page-shell"

const TERMS_SECTIONS = [
  {
    title: "Using Rootly",
    body: [
      "Rootly is provided to help you organize courses, capture notes, track daily learning, and review what you have studied.",
      "You may use the product only in lawful ways and only for content you have the right to store, review, and share through your account.",
    ],
  },
  {
    title: "Your content",
    body: [
      "You keep ownership of the notes, course links, study logs, and other material you add to Rootly.",
      "By using the service, you give Rootly only the limited permission needed to store, process, and display that content so the product works for you.",
    ],
  },
  {
    title: "Account responsibility",
    body: [
      "You are responsible for the activity that happens through your account and for keeping your sign-in access secure.",
      "If you believe your account has been used without permission, you should stop using the service and contact support as soon as possible.",
    ],
  },
  {
    title: "Service changes",
    body: [
      "Rootly may evolve over time, which means features may be improved, changed, or removed as the product grows.",
      "The service is provided on an as-is basis, and Rootly cannot guarantee uninterrupted availability at all times.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "You may not use Rootly to store unlawful, abusive, harmful, or infringing material, or to interfere with the service or other users.",
      "Rootly may suspend or terminate access when these rules are violated or when continued access would create security, legal, or operational risk.",
    ],
  },
] as const

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description="These terms explain the basic rules for using Rootly and what both you and the product can expect from that relationship."
      sections={TERMS_SECTIONS.map((section) => ({
        ...section,
        body: [...section.body],
      }))}
    />
  )
}
