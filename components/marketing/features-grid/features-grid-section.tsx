import {
  ChartScatterIcon,
  FileTextIcon,
  FolderIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ComponentType } from "react";
import { MarketingContainer } from "@/components/marketing/container";

type FeatureCard = {
  href: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string; size?: number }>;
};

const featureCards: FeatureCard[] = [
  {
    href: "/time-tracking",
    title: "Time tracking",
    subtitle: "Project hours",
    icon: TimerIcon,
  },
  {
    href: "/invoicing",
    title: "Invoicing",
    subtitle: "Invoice management",
    icon: FileTextIcon,
  },
  {
    href: "/customers",
    title: "Customers",
    subtitle: "Customer performance",
    icon: ChartScatterIcon,
  },
  {
    href: "/file-storage",
    title: "Files",
    subtitle: "Document storage",
    icon: FolderIcon,
  },
];

export function FeaturesGridSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <MarketingContainer>
        <div className="mx-auto mb-12 max-w-xl space-y-4 px-2 text-center sm:mb-12 lg:mx-0 lg:mb-14 lg:max-w-2xl lg:px-0 lg:text-left">
          <h2 className="text-wrap-pretty font-sans text-3xl leading-tight md:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-[1.3] 2xl:text-3xl 3xl:text-4xl">
            <span className="text-foreground">
              Everything you need to run your business finances
            </span>
          </h2>
          <p className="text-wrap-pretty mx-auto hidden max-w-md px-0 font-sans text-base leading-normal text-muted-foreground sm:block lg:mx-0 lg:max-w-none lg:text-left">
            Dashboards, invoicing, time tracking, and files all connected in one
            system.
          </p>
        </div>

        <div className="mx-auto flex max-w-sm flex-col gap-8 sm:max-w-none sm:gap-10">
          <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
            {featureCards.map(({ href, title, subtitle, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex w-full flex-col items-center sm:w-37.5"
              >
                <div className="mb-4 flex size-15 items-center justify-center border border-border bg-secondary transition-all duration-200 group-hover:border-muted-foreground">
                  <Icon className="text-muted-foreground" size={24} />
                </div>

                <div className="flex flex-col items-center text-center">
                  <h3 className="text-sm leading-5.25 text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-5.25 text-muted-foreground">
                    {subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
