import HomepageFinalCta from "./ui/homepage-final-cta"
import HomepageFooter from "./ui/homepage-footer"
import HomepageHero from "./ui/homepage-hero"
import HomepageHowItWorks from "./ui/homepage-how-it-works"
import HomepageNav from "./ui/homepage-nav"

export default function MarketingHomepage() {
  return (
    <div>
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
