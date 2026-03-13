"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

export type FloatingDockItem = {
  label: string
  icon: React.ReactNode
  link: string
}

function isDockItemActive(pathname: string, link: string) {
  if (link === "/overview") return pathname === "/overview"
  return pathname === link
}

export function FloatingDock({
  navigationItems,
  desktopClassName,
  mobileClassName,
}: {
  navigationItems: FloatingDockItem[]
  desktopClassName?: string
  mobileClassName?: string
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
  )
}

function FloatingDockMobile({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[]
  className?: string
}) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex justify-center md:hidden",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="mx-auto mb-3 flex items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm">
        {navigationItems.map((item) => {
          const isActive = isDockItemActive(pathname, item.link)
          return (
            <Link
              key={item.label}
              href={item.link}
              aria-label={item.label}
              className={cn(
                "flex size-11 items-center justify-center rounded-xl border transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-muted"
              )}
            >
              <div className="size-5">{item.icon}</div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function FloatingDockDesktop({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[]
  className?: string
}) {
  const pathname = usePathname()
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 hidden justify-center md:flex",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto mb-6 flex h-16 items-end gap-4 rounded-2xl border bg-background px-4 pb-3 shadow-sm"
        )}
      >
        {navigationItems.map((item) => (
          <DesktopIconContainer
            key={item.label}
            mouseX={mouseX}
            label={item.label}
            icon={item.icon}
            link={item.link}
            active={isDockItemActive(pathname, item.link)}
          />
        ))}
      </motion.nav>
    </div>
  )
}

function DesktopIconContainer({
  mouseX,
  label,
  icon,
  link,
  active,
}: {
  mouseX: MotionValue<number>
  label: string
  icon: React.ReactNode
  link: string
  active: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let iconScaleTransform = useTransform(distance, [-150, 0, 150], [1, 2, 1]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
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

  const [hovered, setHovered] = React.useState(false)

  return (
    <Link href={link} aria-label={label}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full border transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted text-foreground hover:bg-muted"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border bg-background px-2 py-0.5 text-xs text-foreground shadow-sm"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ scale: iconScale }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  )
}
