"use client";

import Link from "next/link";
import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MarketingContainer } from "@/components/marketing/container";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm text-foreground">{title}</h3>
      <div className="space-y-2.5">
        {links.map((link) => (
          <Link
            key={`${title}-${link.href}`}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FooterSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-background">
      <div className="h-px w-full border-t border-border" />

      <MarketingContainer className="relative z-10 pt-16 pb-40 sm:pb-80">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-3 lg:items-start lg:gap-3">
            <p className="text-left text-base text-foreground sm:text-xl lg:text-left">
              Business finances that explain themselves.
            </p>
            <p className="text-left text-sm text-muted-foreground lg:text-left">
              {year} Rootly Labs AB. All rights reserved.
            </p>

            <div className="mt-1 inline-flex items-center rounded-none border border-border bg-background p-0.5">
              {(["dark", "light", "system"] as const).map((mode) => {
                const active = mounted ? theme === mode : mode === "system";

                const Icon =
                  mode === "dark"
                    ? MoonIcon
                    : mode === "light"
                      ? SunIcon
                      : MonitorIcon;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 ${
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-pressed={active}
                  >
                    <Icon className="size-3.5" weight="fill" />
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 md:grid-cols-5 lg:order-2 lg:col-span-1">
            <FooterColumn
              title="Features"
              links={[
                { href: "/time-tracking", label: "Time tracking" },
                { href: "/invoicing", label: "Invoicing" },
                { href: "/customers", label: "Customers" },
                { href: "/file-storage", label: "Files" },
              ]}
            />

            <FooterColumn
              title="Product"
              links={[
                { href: "/pre-accounting", label: "Pre-accounting" },
                { href: "/#testimonials", label: "Customer Stories" },
              ]}
            />

            <div className="hidden md:block">
              <FooterColumn
                title="Compare"
                links={[
                  {
                    href: "/compare/quickbooks-alternative",
                    label: "vs QuickBooks",
                  },
                  { href: "/compare/xero-alternative", label: "vs Xero" },
                  {
                    href: "/compare/freshbooks-alternative",
                    label: "vs FreshBooks",
                  },
                  { href: "/compare/wave-alternative", label: "vs Wave" },
                  { href: "/compare/bench-alternative", label: "vs Bench" },
                  { href: "/compare/qonto-alternative", label: "vs Qonto" },
                  { href: "/compare/pleo-alternative", label: "vs Pleo" },
                  { href: "/compare", label: "View all" },
                ]}
              />
            </div>

            <FooterColumn
              title="Company"
              links={[
                { href: "/story", label: "Story" },
                { href: "/updates", label: "Updates" },
                {
                  href: "https://x.com/rootlyai",
                  label: "X / Twitter",
                  external: true,
                },
                {
                  href: "https://www.linkedin.com/company/rootly-ai",
                  label: "LinkedIn",
                  external: true,
                },
              ]}
            />

            <FooterColumn
              title="Resources"
              links={[
                { href: "/docs", label: "Documentation" },
                { href: "/sdks", label: "SDKs" },
                { href: "/policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ]}
            />
          </div>
        </div>
      </MarketingContainer>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center translate-y-[25%] overflow-hidden bg-background sm:translate-y-[35%]">
        <h1
          className="select-none text-[clamp(6.5rem,28vw,12.5rem)] leading-none text-secondary sm:text-[508px]"
          style={{
            WebkitTextStroke: "1px var(--color-muted-foreground)",
            color: "var(--color-secondary)",
          }}
        >
          rootly
        </h1>
      </div>
    </footer>
  );
}
