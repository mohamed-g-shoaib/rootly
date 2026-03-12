"use client"

import * as React from "react"

import {
  AiSearchIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Book01Icon,
  Calendar01Icon,
  DatabaseLightningIcon,
  Home01Icon,
  Moon01Icon,
  NoteIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { signOut } from "@/app/auth/actions"

import RootlyLogo from "@/components/rootly-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

import { FloatingDock } from "@/components/ui/floating-dock"

import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

type ShellFab = {
  ariaLabel: string
  icon: React.ReactNode
  onClick: () => void
}

function ThemeToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon icon={Sun01Icon} size={18} />
      <Switch
        aria-label="Toggle theme"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <HugeiconsIcon icon={Moon01Icon} size={18} />
    </div>
  )
}

export function DashboardShell({
  children,
  streakDays,
  fab,
}: {
  children: React.ReactNode
  streakDays?: number
  fab?: ShellFab
}) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    setIsMobile(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const [commandOpen, setCommandOpen] = React.useState(false)
  const [avatarOpen, setAvatarOpen] = React.useState(false)

  const shortcut = isMobile ? null : getDesktopShortcutLabel()

  const navigationItems = React.useMemo(
    () => [
      {
        label: "Overview",
        link: "/",
        icon: <HugeiconsIcon icon={Home01Icon} size={18} />,
      },
      {
        label: "Courses",
        link: "/courses",
        icon: <HugeiconsIcon icon={Book01Icon} size={18} />,
      },
      {
        label: "Notes",
        link: "/notes",
        icon: <HugeiconsIcon icon={NoteIcon} size={18} />,
      },
      {
        label: "Daily",
        link: "/daily-entries",
        icon: <HugeiconsIcon icon={Calendar01Icon} size={18} />,
      },
      {
        label: "Review",
        link: "/review",
        icon: <HugeiconsIcon icon={DatabaseLightningIcon} size={18} />,
      },
    ],
    []
  )

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey && !e.metaKey) return
      if (e.key.toLowerCase() !== "k") return
      e.preventDefault()
      setCommandOpen(true)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="min-h-svh">
      <header className="fixed inset-x-0 top-0 z-20 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Home">
              <RootlyLogo className="size-6" aria-hidden="true" />
            </Link>
          </div>

          {!isMobile && typeof streakDays === "number" ? (
            <div className="text-sm text-muted-foreground tabular-nums">
              <span aria-hidden="true">🔥</span> {streakDays} day streak
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="Search"
                onClick={() => setCommandOpen(true)}
              >
                <HugeiconsIcon icon={AiSearchIcon} size={18} />
              </Button>
            ) : (
              <Button
                variant="outline"
                type="button"
                className="min-w-72 justify-between"
                onClick={() => setCommandOpen(true)}
              >
                <span className="text-muted-foreground">
                  Search or jump to...
                </span>
                {shortcut ? <Kbd>{shortcut}</Kbd> : null}
              </Button>
            )}

            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="User menu"
                onClick={() => setAvatarOpen(true)}
              >
                <Avatar>
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>RR</AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <UserAvatarPopover />
            )}
          </div>
        </div>
      </header>

      <main className="min-h-svh pt-14 pb-28">{children}</main>

      <FloatingDock navigationItems={navigationItems} />

      {isMobile && fab ? (
        <Button
          size="icon-lg"
          type="button"
          className="fixed right-4 bottom-20 z-30 rounded-full"
          aria-label={fab.ariaLabel}
          onClick={fab.onClick}
        >
          {fab.icon}
        </Button>
      ) : null}

      <CommandPalette
        isMobile={isMobile}
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />

      <MobileAvatarSheet open={avatarOpen} onOpenChange={setAvatarOpen} />
    </div>
  )
}

function UserAvatarPopover() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" aria-label="User menu" />}
      >
        <Avatar>
          <AvatarImage src="" alt="" />
          <AvatarFallback>RR</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-72">
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-medium">Rami R</div>
            <div className="text-sm text-muted-foreground">
              rami@example.com
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">Theme</div>
            <ThemeToggle
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>

          <form action={signOut}>
            <Button
              variant="destructive-outline"
              className="w-full"
              type="submit"
            >
              Logout
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileAvatarSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-medium">Rami R</div>
              <div className="text-sm text-muted-foreground">
                rami@example.com
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Theme</div>
              <ThemeToggle
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <form action={signOut}>
              <Button
                variant="destructive-outline"
                className="w-full"
                type="submit"
              >
                Logout
              </Button>
            </form>
          </div>
        </SheetPanel>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}

function CommandPalette({
  isMobile,
  open,
  onOpenChange,
}: {
  isMobile: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  type Item = {
    value: string
    label: string
    shortcut?: string
  }

  type Group = {
    value: string
    items: Item[]
  }

  const groupedItems: Group[] = [
    {
      value: "Recent / Suggested",
      items: [
        { value: "log-daily", label: "Log today's entry" },
        { value: "start-review", label: "Start review session" },
        { value: "create-note", label: "Create new note" },
      ],
    },
    {
      value: "Notes",
      items: [
        {
          value: "note-1",
          label: "React useEffect dependencies",
          shortcut: "↵",
        },
        { value: "note-2", label: "SQL partial indexes", shortcut: "↵" },
      ],
    },
    {
      value: "Courses",
      items: [
        { value: "course-1", label: "Advanced React Patterns" },
        { value: "course-2", label: "Postgres Performance" },
      ],
    },
    {
      value: "Actions",
      items: [
        { value: "go-overview", label: "Go to Overview" },
        { value: "go-notes", label: "Go to Notes" },
      ],
    },
  ]

  const content = (
    <Command items={groupedItems}>
      <CommandInput placeholder="Search notes, courses, or run a command..." />

      <CommandPanel>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          {(group, index) => (
            <React.Fragment key={group.value}>
              <CommandGroup items={group.items}>
                <CommandGroupLabel>{group.value}</CommandGroupLabel>
                <CommandCollection>
                  {(item) => (
                    <CommandItem key={item.value} value={item.value}>
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut ? (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      ) : null}
                    </CommandItem>
                  )}
                </CommandCollection>
              </CommandGroup>
              {index < groupedItems.length - 1 ? <CommandSeparator /> : null}
            </React.Fragment>
          )}
        </CommandList>
      </CommandPanel>

      <CommandFooter>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>
                <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
              </Kbd>
              <Kbd>
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
              </Kbd>
            </KbdGroup>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>↵</Kbd>
            <span>Open</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Kbd>Esc</Kbd>
          <span>Close</span>
        </div>
      </CommandFooter>
    </Command>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetPopup side="bottom" variant="inset" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-4">{content}</SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    )
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandDialogPopup>{content}</CommandDialogPopup>
    </CommandDialog>
  )
}

function getDesktopShortcutLabel(): "⌘K" | "Ctrl K" {
  if (typeof navigator === "undefined") return "Ctrl K"
  const isMac = navigator.userAgentData?.platform
    ? navigator.userAgentData.platform.toLowerCase().includes("mac")
    : navigator.userAgent.toLowerCase().includes("mac")
  return isMac ? "⌘K" : "Ctrl K"
}
