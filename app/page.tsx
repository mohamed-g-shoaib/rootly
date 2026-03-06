import { HeroSection } from "@/components/marketing/hero/hero-section";
import { MarketingNavbar } from "@/components/marketing/navbar/navbar";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavbar />
      <HeroSection />
    </main>
  );
}
