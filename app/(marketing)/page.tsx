import type { Metadata } from "next"
import HomepageFinalCta from "./ui/homepage-final-cta"
import HomepageFooter from "./ui/homepage-footer"
import HomepageHero from "./ui/homepage-hero"
import HomepageHowItWorks from "./ui/homepage-how-it-works"
import HomepageNav from "./ui/homepage-nav"
import { absoluteUrl, siteConfig } from "@/lib/site-config"

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
  url: siteConfig.url,
  image: absoluteUrl("/opengraph-image"),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export const metadata: Metadata = {
  title: "Developer learning notebook",
  description:
    "Capture notes, track progress, and review what you learn in one deliberate system built for self-taught developers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rootly | Developer learning notebook",
    description: siteConfig.ogDescription,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rootly | Developer learning notebook",
    description: siteConfig.ogDescription,
    images: ["/twitter-image"],
  },
}

export default function MarketingHomepage() {
  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify(homepageJsonLd)}
      </script>
      <HomepageNav />
      <main>
        <HomepageHero />
        <HomepageHowItWorks />
        <HomepageFinalCta />
      </main>
      <HomepageFooter />
    </div>
  )
}
