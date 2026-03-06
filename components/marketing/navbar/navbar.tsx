"use client";

import { CaretDown } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarketingContainer } from "@/components/marketing/container";
import RootlyLogo from "@/components/rootly-logo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

type FeatureItem = {
  href: string;
  title: string;
  description: string;
};

type StoryPreview = {
  name: string;
  image?: string;
  quote: string;
};

const featureRoutes = [
  "/time-tracking",
  "/invoicing",
  "/customers",
  "/file-storage",
  "/pre-accounting",
];

const featureItems: FeatureItem[] = [
  {
    href: "/time-tracking",
    title: "Time tracking",
    description: "See where time goes",
  },
  {
    href: "/invoicing",
    title: "Invoicing",
    description: "Get paid faster",
  },
  {
    href: "/customers",
    title: "Customers",
    description: "Know your customers",
  },
  {
    href: "/file-storage",
    title: "Files",
    description: "Everything in one place",
  },
];

const desktopNavItems: NavItem[] = [
  { href: "/story", label: "Story" },
  { href: "/docs", label: "Documentation" },
  { href: "/sdks", label: "SDKs" },
  { href: "/app", label: "Dashboard" },
];

const mobileFeatureItems: NavItem[] = [
  { href: "/time-tracking", label: "Time tracking" },
  { href: "/invoicing", label: "Invoicing" },
  { href: "/customers", label: "Customers" },
  { href: "/file-storage", label: "Files" },
];

const headerStories: StoryPreview[] = [
  {
    name: "Vitalie Rosescu",
    image: "/stories/vitalie.jpg",
    quote:
      "All in one platform for freelancers looking to create clear insights on income and expenses.",
  },
  {
    name: "Nick Speer",
    image: "/stories/speer.jpeg",
    quote:
      "Rootly is bookkeeping software without the fluff. It's a ledger with modern tooling and integrations.",
  },
  {
    name: "Ivo Dukov",
    quote:
      "Everything lives in one place now — customers, invoices, documents, and financial analytics.",
  },
  {
    name: "Ciarán Harris",
    image: "/stories/ciaran.jpeg",
    quote:
      "Financial admin stopped being a source of friction. Rootly actually works the way you'd expect modern software to work.",
  },
];

export function MarketingNavbar({
  transparent = false,
  hideMenuItems = false,
}: {
  transparent?: boolean;
  hideMenuItems?: boolean;
}) {
  const router = useRouter();
  const featuresTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefetchedFeatures = useRef(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const hamburgerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 300, damping: 25 };

  const prefetchFeatures = useCallback(() => {
    if (prefetchedFeatures.current) return;

    prefetchedFeatures.current = true;
    for (const route of featureRoutes) {
      router.prefetch(route);
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (featuresTimeoutRef.current) {
        clearTimeout(featuresTimeoutRef.current);
      }
    };
  }, []);

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

  const activeStory = headerStories[storyIndex];
  const sentenceMatch = activeStory?.quote.match(/[.!?]\s/);
  const firstSentence = sentenceMatch
    ? activeStory.quote.slice(0, sentenceMatch.index! + 1)
    : activeStory?.quote;

  return (
    <>
      <div
        className={cn(
          "fixed top-18 right-0 bottom-0 left-0 z-40 bg-black/40 transition-opacity duration-150",
          isFeaturesOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      />

      <nav className="fixed top-0 right-0 left-0 z-50 w-full">
        <div
          className={cn(
            "relative w-full",
            isMenuOpen && "border-b border-border",
            !transparent && "backdrop-blur-md bg-background-semi-transparent",
            !transparent && isFeaturesOpen && "xl:bg-background",
          )}
        >
          <MarketingContainer className="flex items-center justify-between py-3 xl:gap-6 xl:py-4">
            <Link
              href="/"
              className="[webkit-tap-highlight-color:transparent] flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 active:opacity-80"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Rootly - Go to homepage"
            >
              <RootlyLogo className="size-6 text-foreground" />
              <span className="text-base text-foreground">Rootly</span>
            </Link>

            {!hideMenuItems ? (
              <div className="hidden items-center gap-6 xl:flex">
                <div
                  className="relative -mx-3 -my-2"
                  onMouseEnter={() => {
                    if (featuresTimeoutRef.current) {
                      clearTimeout(featuresTimeoutRef.current);
                    }
                    prefetchFeatures();
                    setStoryIndex(
                      (previous) => (previous + 1) % headerStories.length,
                    );
                    setIsFeaturesOpen(true);
                  }}
                  onMouseLeave={() => {
                    featuresTimeoutRef.current = setTimeout(() => {
                      setIsFeaturesOpen(false);
                    }, 200);
                  }}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Features
                    <CaretDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        isFeaturesOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isFeaturesOpen ? (
                    <div className="absolute right-0 left-0 h-4" />
                  ) : null}

                  {isFeaturesOpen ? (
                    <motion.div
                      data-features-dropdown
                      className="fixed top-18 right-0 left-0 z-50 overflow-hidden border-y border-border bg-background shadow-lg"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <MarketingContainer className="py-6 xl:py-8 2xl:py-10">
                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
                          <div className="lg:col-span-2 xl:max-w-xl 2xl:max-w-xl">
                            <div className="flex flex-col">
                              {featureItems.map((item, index) => (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: prefersReducedMotion ? 0 : 0.16,
                                    ease: "easeOut",
                                    delay: prefersReducedMotion
                                      ? 0
                                      : index * 0.03,
                                  }}
                                >
                                  <Link
                                    href={item.href}
                                    className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                    onClick={() => setIsFeaturesOpen(false)}
                                  >
                                    <div className="flex flex-col pl-2">
                                      <span className="mb-1 text-base text-foreground">
                                        {item.title}
                                      </span>
                                      <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                        {item.description}
                                      </span>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-nowrap items-start justify-end gap-4 lg:col-span-2">
                            <Link
                              href="/pre-accounting"
                              onClick={() => setIsFeaturesOpen(false)}
                              className="flex h-69.25 w-full max-w-[320px] shrink-0 flex-col overflow-hidden border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-87.5 2xl:w-100"
                            >
                              <div className="flex h-53.5 items-center justify-center bg-background p-4">
                                <Image
                                  src="/images/accounting-light.png"
                                  alt="Pre-accounting"
                                  width={112}
                                  height={400}
                                  className="h-auto max-h-20 w-auto object-contain dark:hidden"
                                />
                                <Image
                                  src="/images/accounting-dark.png"
                                  alt="Pre-accounting"
                                  width={112}
                                  height={400}
                                  className="hidden h-auto max-h-20 w-auto object-contain dark:block"
                                />
                              </div>
                              <div className="flex items-center justify-between gap-4 border-t border-border bg-background p-2.5">
                                <div className="flex-1">
                                  <span className="block text-xs text-foreground">
                                    Pre-accounting
                                  </span>
                                  <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                    Clean records ready for your accountant
                                  </span>
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5">
                                  <div className="flex size-6 items-center justify-center border border-border bg-background">
                                    <Image
                                      src="/images/xero.svg"
                                      alt="Xero"
                                      width={14}
                                      height={14}
                                      className="object-contain opacity-70"
                                    />
                                  </div>
                                  <div className="flex size-6 items-center justify-center border border-border bg-background">
                                    <Image
                                      src="/images/quickbooks.svg"
                                      alt="QuickBooks"
                                      width={14}
                                      height={14}
                                      className="object-contain opacity-70"
                                    />
                                  </div>
                                  <div className="flex size-6 items-center justify-center border border-border bg-background">
                                    <Image
                                      src="/images/fortnox.svg"
                                      alt="Fortnox"
                                      width={14}
                                      height={14}
                                      className="object-contain opacity-70"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <Link
                              href="/testimonials"
                              onClick={() => setIsFeaturesOpen(false)}
                              className="flex h-69.25 w-full max-w-[320px] shrink-0 flex-col overflow-visible border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-87.5 2xl:w-100"
                            >
                              <div className="relative flex flex-1 items-center justify-center overflow-visible bg-background p-4">
                                <span className="pointer-events-none absolute top-[89%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-sans text-[20rem] leading-none text-muted-foreground opacity-10 xl:text-[22rem] 2xl:text-[24rem]">
                                  &rdquo;
                                </span>
                                <div className="text-wrap-pretty relative z-10 line-clamp-3 w-full px-2 text-center font-sans text-sm leading-tight xl:text-base 2xl:text-lg">
                                  <span className="text-primary">
                                    &ldquo;{firstSentence}&rdquo;
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-4 border-t border-border bg-background p-2.5">
                                <div className="flex-1">
                                  <span className="block text-xs text-foreground">
                                    Customer Stories
                                  </span>
                                  <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                    See how founders use Rootly
                                  </span>
                                </div>
                                {activeStory?.image ? (
                                  <div className="flex shrink-0 items-center gap-1.5">
                                    <div className="flex size-6 items-center justify-center overflow-hidden bg-background">
                                      <Image
                                        src={activeStory.image}
                                        alt={activeStory.name}
                                        width={24}
                                        height={24}
                                        className="size-full object-cover opacity-70 grayscale"
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </Link>
                          </div>
                        </div>
                      </MarketingContainer>
                    </motion.div>
                  ) : null}
                </div>

                {desktopNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="border-l border-border pl-4">
                  <Link
                    href="/login"
                    className="text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="flex items-center xl:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="[webkit-tap-highlight-color:transparent] relative flex min-h-11 min-w-11 items-center justify-end p-2 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative flex size-5 flex-col items-center justify-center">
                  <motion.span
                    className="absolute h-[1.5px] w-4 rounded-none bg-current"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 0 : -4.5,
                    }}
                    transition={hamburgerTransition}
                  />
                  <motion.span
                    className="absolute h-[1.5px] w-4 rounded-none bg-current"
                    animate={{
                      opacity: isMenuOpen ? 0 : 1,
                      scaleX: isMenuOpen ? 0 : 1,
                    }}
                    transition={hamburgerTransition}
                  />
                  <motion.span
                    className="absolute h-[1.5px] w-4 rounded-none bg-current"
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? 0 : 4.5,
                    }}
                    transition={hamburgerTransition}
                  />
                </div>
              </button>
            </div>
          </MarketingContainer>
        </div>
      </nav>

      {isMenuOpen ? (
        <motion.div
          className="fixed inset-0 z-40 bg-background xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
        >
          <div className="px-6 pt-28">
            <div className="flex flex-col space-y-6 text-left">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileFeaturesOpen((previous) => !previous)
                  }
                  className="[webkit-tap-highlight-color:transparent] flex items-center justify-between py-2 text-2xl text-primary transition-colors hover:text-primary focus-visible:outline-none"
                >
                  <span>Features</span>
                  <CaretDown
                    className={cn(
                      "size-6 transition-transform duration-200",
                      isMobileFeaturesOpen && "rotate-180",
                    )}
                  />
                </button>

                {isMobileFeaturesOpen ? (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <div className="my-2 h-px w-full border-t border-border" />
                    <div className="flex flex-col space-y-4 pt-2">
                      {mobileFeatureItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileFeaturesOpen(false);
                          }}
                          className="[webkit-tap-highlight-color:transparent] text-left text-lg text-muted-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </div>

              <Link
                href="/login"
                className="[webkit-tap-highlight-color:transparent] py-2 text-2xl text-primary transition-colors hover:text-primary focus-visible:outline-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>

              <Link
                href="/app"
                className="[webkit-tap-highlight-color:transparent] py-2 text-2xl text-primary transition-colors hover:text-primary focus-visible:outline-none"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsMobileFeaturesOpen(false);
                }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
