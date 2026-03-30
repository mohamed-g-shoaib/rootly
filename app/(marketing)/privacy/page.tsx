import type { Metadata } from "next"
import { LegalPageShell } from "../ui/legal-page-shell"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Rootly handles account data, product content, and the basic choices you have around your information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Rootly",
    description:
      "Read how Rootly handles account data, product content, and the basic choices you have around your information.",
    url: "/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Rootly",
    description:
      "Read how Rootly handles account data, product content, and the basic choices you have around your information.",
  },
}

const PRIVACY_SECTIONS = [
  {
    title: "What Rootly collects",
    body: [
      "Rootly stores the account details needed to authenticate you and the product content you choose to add, such as courses, notes, review history, and daily entries.",
      "Basic technical information may also be processed to keep the service secure, reliable, and functional.",
    ],
  },
  {
    title: "How Rootly uses data",
    body: [
      "Your data is used to operate the product features you expect, including organizing learning materials, tracking progress, and saving review sessions.",
      "Rootly does not sell your personal study data. Data is used primarily to deliver and improve the product experience.",
    ],
  },
  {
    title: "How Rootly protects data",
    body: [
      "Rootly uses the service infrastructure and authentication tools needed to store data and control account access.",
      "No system can promise perfect security, but Rootly aims to minimize access, store only what is necessary, and handle data responsibly.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can edit or delete the content you create inside the product at any time through the available product controls.",
      "If you no longer want to use Rootly, you can stop using the service and request account-related help if needed.",
    ],
  },
  {
    title: "Policy updates",
    body: [
      "As Rootly evolves, this policy may be updated to reflect product, legal, or operational changes.",
      "When material updates are made, the published policy will reflect the current version used by the product.",
    ],
  },
] as const

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This page describes the kind of information Rootly stores, why it is used, and the basic choices you have around your data."
      sections={PRIVACY_SECTIONS.map((section) => ({
        ...section,
        body: [...section.body],
      }))}
    />
  )
}
