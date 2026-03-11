import HomepageFinalCta from "./ui/homepage-final-cta"
import HomepageFeatures from "./ui/homepage-features"
import HomepageFooter from "./ui/homepage-footer"
import HomepageHero from "./ui/homepage-hero"
import HomepageHowItWorks from "./ui/homepage-how-it-works"
import HomepageMockup from "./ui/homepage-mockup"
import HomepageNav from "./ui/homepage-nav"
import HomepageSocialProof from "./ui/homepage-social-proof"

export default function MarketingHomepage() {
  return (
    <div>
      <HomepageNav />
      <main>
        <HomepageHero />
        <HomepageMockup />
        <HomepageFeatures />
        <HomepageHowItWorks />
        <HomepageSocialProof />
        <HomepageFinalCta />
      </main>
      <HomepageFooter />
    </div>
  )
}
