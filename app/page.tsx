import { HeroSection } from "@/components/marketing/hero/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works/how-it-works-section";
import { MarketingNavbar } from "@/components/marketing/navbar/navbar";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavbar />
      <HeroSection />
      <HowItWorksSection />
    </main>
  );
}
