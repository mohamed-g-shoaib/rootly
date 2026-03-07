import { FAQSection } from "@/components/marketing/faq/faq-section";
import { FooterSection } from "@/components/marketing/footer/footer-section";
import { FeaturesGridSection } from "@/components/marketing/features-grid/features-grid-section";
import { HeroSection } from "@/components/marketing/hero/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works/how-it-works-section";
import { MarketingNavbar } from "@/components/marketing/navbar/navbar";
import { PreAccountingSection } from "@/components/marketing/pre-accounting/pre-accounting-section";
import { TestimonialsSection } from "@/components/marketing/testimonials/testimonials-section";
import { TimeSavingsSection } from "@/components/marketing/time-savings/time-savings-section";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesGridSection />
      <TimeSavingsSection />
      <PreAccountingSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
