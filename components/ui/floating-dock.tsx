"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Moon02Icon,
  Sun01Icon,
  VolumeHighIcon,
  VolumeOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";
import { switchOffSound } from "@/lib/audio/switch-off";
import { switchOnSound } from "@/lib/audio/switch-on";
import { playSound } from "@/lib/audio/sound-engine";
import { useAudioPreferences } from "@/components/theme-provider";

export type FloatingDockItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

function DockIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-5 place-items-center [&_svg]:block">
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
    <LazyMotion features={domAnimation}>
      <FloatingDockDesktop
        navigationItems={navigationItems}
        className={desktopClassName}
      />
      <FloatingDockMobile
        navigationItems={navigationItems}
        className={mobileClassName}
      />
    </LazyMotion>
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
  const { resolvedTheme, setTheme } = useTheme();
  const { muted, setMuted } = useAudioPreferences();

  function handleThemeToggle() {
    if (muted) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    if (resolvedTheme === "dark") {
      void playSound(switchOnSound.dataUri);
      setTheme("light");
      return;
    }

    void playSound(switchOffSound.dataUri);
    setTheme("dark");
  }

  function handleMuteToggle() {
    setMuted((previous) => !previous);
  }

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
        "fixed inset-x-0 bottom-0 z-30 flex justify-center md:hidden",
        className,
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        viewTransitionName: "dashboard-dock",
      }}
    >
      <nav className="mx-auto mb-3 flex items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm">
        {navigationItems.map((item) => {
          const isActive = isDockItemActive(pathname, item.link);
          const transitionTypes =
            item.link === "/overview" || pathname === "/overview"
              ? undefined
              : (["dashboard-lateral"] as string[]);

          return (
            <Link
              key={item.label}
              href={item.link}
              prefetch
              transitionTypes={transitionTypes}
              aria-label={item.label}
              onMouseEnter={() => prefetch(item.link)}
              onFocus={() => prefetch(item.link)}
              onTouchStart={() => prefetch(item.link)}
              className={cn(
                "flex size-11 items-center justify-center rounded-xl border transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-muted",
              )}
            >
              <DockIcon>{item.icon}</DockIcon>
            </Link>
          );
        })}

        <button
          type="button"
          data-click-sound="off"
          aria-label="Toggle theme"
          onClick={handleThemeToggle}
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-foreground transition-colors hover:bg-muted"
        >
          <DockIcon>
            <HugeiconsIcon
              icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
              size={18}
            />
          </DockIcon>
        </button>

        <button
          type="button"
          data-click-sound="off"
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          onClick={handleMuteToggle}
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-foreground transition-colors hover:bg-muted"
        >
          <DockIcon>
            <HugeiconsIcon
              icon={muted ? VolumeOffIcon : VolumeHighIcon}
              size={18}
            />
          </DockIcon>
        </button>
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
  const { resolvedTheme, setTheme } = useTheme();
  const { muted, setMuted } = useAudioPreferences();
  const mouseX = useMotionValue(Infinity);
  const shouldReduceMotion = Boolean(useReducedMotion());

  function handleThemeToggle() {
    if (muted) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    if (resolvedTheme === "dark") {
      void playSound(switchOnSound.dataUri);
      setTheme("light");
      return;
    }

    void playSound(switchOffSound.dataUri);
    setTheme("dark");
  }

  function handleMuteToggle() {
    setMuted((previous) => !previous);
  }

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
        "fixed inset-x-0 bottom-0 z-30 hidden justify-center md:flex",
        className,
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        viewTransitionName: "dashboard-dock",
      }}
    >
      <m.nav
        onMouseMove={
          shouldReduceMotion ? undefined : (e) => mouseX.set(e.pageX)
        }
        onMouseLeave={
          shouldReduceMotion ? undefined : () => mouseX.set(Infinity)
        }
        className="mx-auto mb-6 flex h-16 items-end gap-4 rounded-2xl border bg-background p-3 shadow-sm"
      >
        {navigationItems.map((item) => (
          <DesktopIconContainer
            key={item.label}
            mouseX={mouseX}
            label={item.label}
            icon={item.icon}
            link={item.link}
            active={isDockItemActive(pathname, item.link)}
            shouldReduceMotion={shouldReduceMotion}
            onPrefetch={prefetch}
            transitionTypes={
              item.link === "/overview" || pathname === "/overview"
                ? undefined
                : (["dashboard-lateral"] as string[])
            }
          />
        ))}

        <DesktopActionButton
          label="Toggle theme"
          icon={
            <HugeiconsIcon
              icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
              size={18}
            />
          }
          onClick={handleThemeToggle}
          shouldReduceMotion={shouldReduceMotion}
        />

        <DesktopActionButton
          label={muted ? "Unmute sounds" : "Mute sounds"}
          icon={
            <HugeiconsIcon
              icon={muted ? VolumeOffIcon : VolumeHighIcon}
              size={18}
            />
          }
          onClick={handleMuteToggle}
          shouldReduceMotion={shouldReduceMotion}
        />
      </m.nav>
    </div>
  );
}

function DesktopActionButton({
  label,
  icon,
  onClick,
  shouldReduceMotion,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shouldReduceMotion: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      data-click-sound="off"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={shouldReduceMotion ? undefined : () => setHovered(true)}
      onMouseLeave={shouldReduceMotion ? undefined : () => setHovered(false)}
      className="relative flex size-10 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors motion-reduce:transition-none hover:bg-muted"
    >
      <AnimatePresence>
        {!shouldReduceMotion && hovered ? (
          <m.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border bg-background px-2 py-0.5 text-xs text-foreground shadow-sm"
          >
            {label}
          </m.div>
        ) : null}
      </AnimatePresence>
      <DockIcon>{icon}</DockIcon>
    </button>
  );
}

function DesktopIconContainer({
  mouseX,
  label,
  icon,
  link,
  active,
  shouldReduceMotion,
  onPrefetch,
  transitionTypes,
}: {
  mouseX: MotionValue<number>;
  label: string;
  icon: React.ReactNode;
  link: string;
  active: boolean;
  shouldReduceMotion: boolean;
  onPrefetch: (href: string) => void;
  transitionTypes?: string[];
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let iconScaleTransform = useTransform(distance, [-150, 0, 150], [1, 2, 1]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let iconScale = useSpring(iconScaleTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = React.useState(false);
  const style = shouldReduceMotion ? undefined : { width, height };
  const iconStyle = shouldReduceMotion ? undefined : { scale: iconScale };

  return (
    <Link
      href={link}
      prefetch
      transitionTypes={transitionTypes}
      aria-label={label}
      onMouseEnter={() => onPrefetch(link)}
      onFocus={() => onPrefetch(link)}
      onTouchStart={() => onPrefetch(link)}
    >
      <m.div
        ref={ref}
        style={style}
        onMouseEnter={shouldReduceMotion ? undefined : () => setHovered(true)}
        onMouseLeave={shouldReduceMotion ? undefined : () => setHovered(false)}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full border transition-colors motion-reduce:transition-none",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted text-foreground hover:bg-muted",
        )}
      >
        <AnimatePresence>
          {!shouldReduceMotion && hovered && (
            <m.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border bg-background px-2 py-0.5 text-xs text-foreground shadow-sm"
            >
              {label}
            </m.div>
          )}
        </AnimatePresence>
        <m.div style={iconStyle} className="flex items-center justify-center">
          <DockIcon>{icon}</DockIcon>
        </m.div>
      </m.div>
    </Link>
  );
}
