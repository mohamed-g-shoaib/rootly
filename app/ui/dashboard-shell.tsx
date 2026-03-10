"use client"

import * as React from "react"

import {
  AiSearchIcon,
  Book01Icon,
  Calendar01Icon,
  Cancel01Icon,
  DatabaseLightningIcon,
  Home01Icon,
  NoteIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import RootlyLogo from "@/components/rootly-logo"
import { useIsMobile } from "@/hooks/use-media-query"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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

export function DashboardShell({
  children,
  streakDays,
  fab,
}: {
  children: React.ReactNode
  streakDays?: number
  fab?: ShellFab
}) {
  const isMobile = useIsMobile()
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
        link: "/daily-tracking",
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
            <RootlyLogo className="size-6" aria-hidden="true" />
          </div>

          {!isMobile && typeof streakDays === "number" ? (
            <div className="text-sm text-muted-foreground">
              <span aria-hidden="true">🔥</span> {streakDays} day streak
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setCommandOpen(true)}
              >
                <HugeiconsIcon icon={AiSearchIcon} size={18} />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="min-w-72 justify-between"
                onClick={() => setCommandOpen(true)}
              >
                <span className="text-muted-foreground">Search or jump to...</span>
                {shortcut ? <Kbd>{shortcut}</Kbd> : null}
              </Button>
            )}

            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
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
          className="fixed right-4 bottom-24 z-30 rounded-full"
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
            <div className="text-sm text-muted-foreground">rami@example.com</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">Theme</div>
            <Switch aria-label="Toggle theme" />
          </div>

          <Button variant="destructive-outline">Logout</Button>
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false}>
        <div className="flex items-center justify-between p-4">
          <div className="font-medium">Account</div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Button>
        </div>

        <div className="px-4 pb-5">
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-medium">Rami R</div>
              <div className="text-sm text-muted-foreground">rami@example.com</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Theme</div>
              <Switch aria-label="Toggle theme" />
            </div>

            <Button variant="destructive-outline">Logout</Button>
          </div>
        </div>
      </SheetContent>
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
        { value: "note-1", label: "React useEffect dependencies", shortcut: "↵" },
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
        <div className="text-xs text-muted-foreground">Press Esc to close</div>
      </CommandFooter>
    </Command>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showCloseButton={false}>
          <div className="flex items-center justify-between p-4">
            <div className="font-medium">Search</div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </div>
          <div className="px-4 pb-4">{content}</div>
        </SheetContent>
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
