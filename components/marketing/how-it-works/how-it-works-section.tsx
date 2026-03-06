"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { MarketingContainer } from "@/components/marketing/container";

const TransactionFlowAnimation = dynamic(
  () =>
    import("./animations/transaction-flow-animation").then(
      (module) => module.TransactionFlowAnimation,
    ),
  { ssr: false },
);

const InvoicePaymentAnimation = dynamic(
  () =>
    import("./animations/invoice-payment-animation").then(
      (module) => module.InvoicePaymentAnimation,
    ),
  { ssr: false },
);

const InboxMatchAnimation = dynamic(
  () =>
    import("./animations/inbox-match-animation").then(
      (module) => module.InboxMatchAnimation,
    ),
  { ssr: false },
);

const DashboardAnimation = dynamic(
  () =>
    import("./animations/dashboard-animation").then(
      (module) => module.DashboardAnimation,
    ),
  { ssr: false },
);

const AIAssistantAnimation = dynamic(
  () =>
    import("./animations/ai-assistant-animation").then(
      (module) => module.AIAssistantAnimation,
    ),
  { ssr: false },
);

type FeatureItem = {
  title: string;
  subtitle: string;
  mobileSubtitle: string;
  illustration: string;
};

const howItWorksFeatures: FeatureItem[] = [
  {
    title: "All your transactions, unified",
    subtitle:
      "Every payment in and out of the business is automatically synced from your connected accounts.",
    mobileSubtitle: "Every payment in and out is pulled in automatically.",
    illustration: "animation",
  },
  {
    title: "Invoices get paid",
    subtitle:
      "Customers can pay invoices online, with payments flowing straight into your finances.",
    mobileSubtitle:
      "Customers can pay invoices online with payments flowing straight into your finances.",
    illustration: "animation",
  },
  {
    title: "Reconciliation gets handled",
    subtitle:
      "Payments, receipts, and transactions are automatically matched so records stay accurate.",
    mobileSubtitle:
      "Transactions are categorized and reconciled automatically.",
    illustration: "animation",
  },
  {
    title: "Understand what's happening",
    subtitle:
      "Rootly explains changes in cash, revenue, and spending as they happen.",
    mobileSubtitle: "See what is changing and why.",
    illustration: "animation",
  },
  {
    title: "Stay updated and in control",
    subtitle:
      "Weekly summaries and notifications keep you on top without constant checking.",
    mobileSubtitle: "Weekly summaries keep you up to date.",
    illustration: "animation",
  },
];

function renderFeatureAnimation(
  activeFeature: number,
  onComplete?: () => void,
  shouldPlay = true,
) {
  if (activeFeature === 0) {
    return (
      <TransactionFlowAnimation
        onComplete={onComplete}
        shouldPlay={shouldPlay}
      />
    );
  }

  if (activeFeature === 1) {
    return (
      <InvoicePaymentAnimation
        onComplete={onComplete}
        shouldPlay={shouldPlay}
      />
    );
  }

  if (activeFeature === 2) {
    return (
      <InboxMatchAnimation onComplete={onComplete} shouldPlay={shouldPlay} />
    );
  }

  if (activeFeature === 3) {
    return (
      <DashboardAnimation onComplete={onComplete} shouldPlay={shouldPlay} />
    );
  }

  if (activeFeature === 4) {
    return (
      <AIAssistantAnimation onComplete={onComplete} shouldPlay={shouldPlay} />
    );
  }

  const fallback = howItWorksFeatures[activeFeature];

  return (
    <Image
      src={fallback?.illustration ?? ""}
      alt={fallback?.title ?? "Feature"}
      width={600}
      height={450}
      className="h-full w-full object-contain"
      loading="lazy"
    />
  );
}

export function HowItWorksSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const goToFeature = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  const moveToNextFeature = useCallback(() => {
    setActiveFeature((previous) => (previous + 1) % howItWorksFeatures.length);
  }, []);

  return (
    <section className="bg-background pb-20 pt-12 sm:pt-2 lg:pb-24 lg:pt-6 xl:pt-8 2xl:pt-12 3xl:pt-32">
      <MarketingContainer>
        <header className="mx-auto mb-12 max-w-xl space-y-4 px-2 text-center lg:mx-0 lg:mb-14 lg:max-w-2xl lg:px-0 lg:text-left">
          <h2 className="text-wrap-pretty font-sans text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
            <span className="text-foreground">How it works</span>
          </h2>
          <p className="text-wrap-pretty mx-auto max-w-md text-center font-sans text-base leading-normal text-muted-foreground lg:mx-0 lg:max-w-none lg:text-left">
            Five connected stages that continuously sync, organize, and explain
            your financial operations.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:hidden">
          {howItWorksFeatures.map((feature, index) => (
            <article key={feature.title} className="space-y-6 sm:space-y-8">
              <div className="space-y-2 text-center">
                <h3 className="text-wrap-pretty mx-auto max-w-md font-sans text-2xl text-foreground sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-wrap-pretty mx-auto max-w-md font-sans text-base leading-normal text-muted-foreground">
                  <span className="sm:hidden">
                    {feature.mobileSubtitle || feature.subtitle}
                  </span>
                  <span className="hidden sm:inline">{feature.subtitle}</span>
                </p>
              </div>

              <div className="relative w-full overflow-hidden border border-border p-1 sm:p-3">
                <div className="relative z-10 flex h-[520px] w-full items-center justify-center overflow-hidden sm:h-[620px]">
                  <div className="h-full w-full origin-center scale-[0.85] sm:scale-[0.9] lg:scale-[0.95]">
                    {renderFeatureAnimation(index, undefined, true)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden grid-cols-1 gap-8 lg:grid lg:h-[740px] lg:grid-cols-2 lg:gap-16">
          <div className="flex gap-6">
            <div className="relative flex shrink-0 flex-col items-center justify-center">
              <div className="mt-2 flex flex-col justify-center space-y-5 lg:mt-3 lg:space-y-6">
                {howItWorksFeatures.map((feature, index) => (
                  <div
                    key={`${feature.title}-timeline`}
                    className="relative flex items-start justify-center"
                    style={{ minHeight: "3.5rem" }}
                  >
                    <button
                      onClick={() => goToFeature(index)}
                      className="relative z-10 cursor-pointer"
                      style={{ marginTop: "0.125rem" }}
                      type="button"
                      aria-label={`Go to feature: ${feature.title}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-none transition-all duration-200 ease-out ${
                          activeFeature === index
                            ? "bg-primary scale-[1.2]"
                            : "bg-border scale-100 hover:bg-muted-foreground"
                        }`}
                      />
                    </button>

                    {index < howItWorksFeatures.length - 1 ? (
                      <div
                        className="absolute left-1/2 w-px -translate-x-1/2 border-l border-border"
                        style={{
                          height: "calc(3.5rem + 1.25rem - 0.25rem)",
                          top: "0.375rem",
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-5 lg:space-y-6">
              {howItWorksFeatures.map((feature, index) => (
                <button
                  key={feature.title}
                  className={`flex min-h-12 cursor-pointer items-start text-left transition-all duration-300 ${
                    activeFeature === index
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                  onClick={() => goToFeature(index)}
                  type="button"
                >
                  {activeFeature === index ? (
                    <div
                      className={`${prefersReducedMotion ? "" : "animate-[fadeInBlur_0.35s_ease-out_forwards]"} overflow-hidden`}
                    >
                      <h3 className="text-wrap-pretty max-w-md font-sans text-lg text-primary transition-colors duration-300 lg:text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-wrap-pretty mt-1 max-w-md font-sans text-sm leading-relaxed text-primary">
                        {feature.subtitle}
                      </p>
                    </div>
                  ) : (
                    <h3 className="text-wrap-pretty max-w-md font-sans text-lg text-muted-foreground transition-colors duration-300 lg:text-xl">
                      {feature.title}
                    </h3>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center overflow-hidden border border-border bg-background p-6 lg:p-8">
            <div
              key={activeFeature}
              className={`relative z-10 flex h-[500px] w-[400px] items-center justify-center overflow-hidden sm:h-[640px] sm:w-[520px] lg:h-[700px] lg:w-[600px] ${prefersReducedMotion ? "" : "animate-[fadeInScale_0.4s_ease-out_forwards]"}`}
              style={{ transformOrigin: "center" }}
            >
              <div
                className={`h-full w-full origin-center scale-[0.85] sm:scale-[0.9] lg:scale-[0.95] ${
                  activeFeature === 3 ? "lg:scale-[0.94]" : ""
                }`}
              >
                {renderFeatureAnimation(
                  activeFeature,
                  prefersReducedMotion ? undefined : moveToNextFeature,
                  true,
                )}
              </div>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
