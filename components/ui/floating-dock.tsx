"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export type FloatingDockItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const DOCK_SURFACE_CLASS =
  "mx-auto flex items-center gap-1 rounded-[calc(var(--radius)+8px)] border border-border/70 bg-background/60 p-1.5 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/58";

function DockBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 hidden h-[calc(var(--dashboard-floating-gap-desktop)+var(--dashboard-dock-height-desktop)+0.75rem)] md:block"
    >
      <div className="absolute inset-0 z-[1] backdrop-blur-[0.5px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_0%,_rgba(0,0,0,1)_12.5%,_rgba(0,0,0,1)_25%,_rgba(0,0,0,0)_37.5%)]" />
      <div className="absolute inset-0 z-[2] backdrop-blur-[1px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_12.5%,_rgba(0,0,0,1)_25%,_rgba(0,0,0,1)_37.5%,_rgba(0,0,0,0)_50%)]" />
      <div className="absolute inset-0 z-[3] backdrop-blur-[2px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_25%,_rgba(0,0,0,1)_37.5%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,0)_62.5%)]" />
      <div className="absolute inset-0 z-[4] backdrop-blur-[3px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_37.5%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_62.5%,_rgba(0,0,0,0)_75%)]" />
      <div className="absolute inset-0 z-[5] backdrop-blur-[4px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_50%,_rgba(0,0,0,1)_62.5%,_rgba(0,0,0,1)_75%,_rgba(0,0,0,0)_87.5%)]" />
      <div className="absolute inset-0 z-[6] backdrop-blur-[5px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_62.5%,_rgba(0,0,0,1)_75%,_rgba(0,0,0,1)_87.5%,_rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-0 z-[7] backdrop-blur-[6px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_75%,_rgba(0,0,0,1)_87.5%,_rgba(0,0,0,1)_100%)]" />
      <div className="absolute inset-0 z-[8] backdrop-blur-[12px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_87.5%,_rgba(0,0,0,1)_100%)]" />
    </div>
  );
}

function DockIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-4.5 place-items-center [&_svg]:block">
      <div className="flex items-center justify-center translate-y-[0.5px]">
        {children}
      </div>
    </div>
  );
}

function isDockItemActive(pathname: string, link: string) {
  if (link === "/overview") return pathname === "/overview";
  return pathname === link;
}

export function FloatingDock({
  navigationItems,
  desktopClassName,
  mobileClassName,
}: {
  navigationItems: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) {
  return (
    <>
      <FloatingDockDesktop
        navigationItems={navigationItems}
        className={desktopClassName}
      />
      <FloatingDockMobile
        navigationItems={navigationItems}
        className={mobileClassName}
      />
    </>
  );
}

function FloatingDockMobile({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const prefetch = React.useCallback(
    (href: string) => {
      if (href === pathname) return;
      router.prefetch(href);
    },
    [pathname, router],
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const item of navigationItems) {
        prefetch(item.link);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [navigationItems, prefetch]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+var(--dashboard-floating-gap-mobile))] z-30 flex justify-center md:hidden",
        className,
      )}
    >
      <nav className={DOCK_SURFACE_CLASS}>
        {navigationItems.map((item) => {
          const isActive = isDockItemActive(pathname, item.link);

          return (
            <Link
              key={item.label}
              href={item.link}
              prefetch
              aria-label={item.label}
              onMouseEnter={() => prefetch(item.link)}
              onFocus={() => prefetch(item.link)}
              onTouchStart={() => prefetch(item.link)}
              className={cn(
                "inline-flex min-h-12 min-w-[3.5rem] flex-col items-center justify-center gap-1 rounded-[calc(var(--radius)+2px)] border px-2 pt-1.5 pb-1 text-[10px] font-medium tracking-[0.01em] transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent/80 hover:text-accent-foreground",
              )}
            >
              <DockIcon>{item.icon}</DockIcon>
              <span className="max-w-full leading-none whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function FloatingDockDesktop({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const prefetch = React.useCallback(
    (href: string) => {
      if (href === pathname) return;
      router.prefetch(href);
    },
    [pathname, router],
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const item of navigationItems) {
        prefetch(item.link);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [navigationItems, prefetch]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[var(--dashboard-floating-gap-desktop)] z-30 hidden justify-center md:flex",
        className,
      )}
    >
      <DockBackdrop />
      <div className="relative flex w-full max-w-7xl justify-center px-4 lg:px-6">
        <nav className={cn("relative z-10", DOCK_SURFACE_CLASS)}>
          {navigationItems.map((item) => (
            <DesktopDockItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              link={item.link}
              active={isDockItemActive(pathname, item.link)}
              onPrefetch={prefetch}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

function DesktopDockItem({
  label,
  icon,
  link,
  active,
  onPrefetch,
}: {
  label: string;
  icon: React.ReactNode;
  link: string;
  active: boolean;
  onPrefetch: (href: string) => void;
}) {
  return (
    <Link
      href={link}
      prefetch
      aria-label={label}
      onMouseEnter={() => onPrefetch(link)}
      onFocus={() => onPrefetch(link)}
      onTouchStart={() => onPrefetch(link)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[calc(var(--radius)+2px)] border px-3 text-sm font-medium tracking-[-0.01em] transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent/80 hover:text-accent-foreground",
      )}
    >
      <DockIcon>{icon}</DockIcon>
      <span className="leading-none whitespace-nowrap">{label}</span>
    </Link>
  );
}
