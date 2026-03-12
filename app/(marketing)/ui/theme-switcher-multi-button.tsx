"use client"

import * as React from "react"

import { ComputerIcon, Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeSwitcherMultiButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative isolate inline-flex h-8 cursor-pointer items-center rounded-full border border-dotted px-1",
          className
        )}
        {...props}
      >
        <div className="flex space-x-0">
          <div className="size-6 animate-pulse rounded-full bg-input" />
          <div className="size-6 animate-pulse rounded-full bg-input" />
          <div className="size-6 animate-pulse rounded-full bg-input" />
        </div>
      </div>
    )
  }

  const themes = [
    {
      value: "system",
      icon: ComputerIcon,
      label: "Switch to system theme",
    },
    {
      value: "light",
      icon: Sun01Icon,
      label: "Switch to light theme",
    },
    {
      value: "dark",
      icon: Moon02Icon,
      label: "Switch to dark theme",
    },
  ] as const

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 cursor-pointer items-center rounded-full border border-dotted px-1",
        className
      )}
      {...props}
    >
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          aria-label={label}
          title={label}
          type="button"
          onClick={() => setTheme(value)}
          className="group relative size-6 cursor-pointer rounded-full transition duration-200 ease-out"
        >
          {theme === value ? (
            <div className="absolute inset-0 rounded-full bg-muted" />
          ) : null}
          <HugeiconsIcon
            icon={icon}
            size={14}
            className={cn(
              "relative m-auto transition duration-200 ease-out",
              theme === value
                ? "text-foreground"
                : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground"
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  )
}
