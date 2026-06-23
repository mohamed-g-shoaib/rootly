import Link from "next/link";

import RootlyLogo from "@/components/rootly-logo";
import { PageContainer } from "@/components/ui/page-container";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = [
  {
    title: "Source Code",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mohamedgshoaib/rootly",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;

export default function HomepageFooter() {
  return (
    <footer className="pt-0">
      <Separator />
      <div className="border-t bg-background">
        <PageContainer>
          <div className="flex flex-col gap-10 py-14 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <Link href="/" aria-label="Rootly" className="w-fit">
                <div className="flex items-center gap-2 text-foreground">
                  <RootlyLogo className="size-7" aria-hidden="true" />
                  <div className="text-lg font-semibold">Rootly</div>
                </div>
              </Link>
              <div>
                Capture notes, track progress, and review what you learn.
              </div>
              <div>© 2026 Rootly. All rights reserved.</div>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-10 sm:mt-0"
            >
              {FOOTER_LINKS.map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.links.map((l) => (
                      <li key={l.label}>
                        {"external" in l && l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-foreground"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="transition-colors hover:text-foreground"
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="pb-12">
            <div className="w-full overflow-hidden text-center text-[clamp(4.5rem,18vw,12rem)] leading-[0.82] font-black tracking-tight text-muted-foreground/25 uppercase select-none">
              Rootly
            </div>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
