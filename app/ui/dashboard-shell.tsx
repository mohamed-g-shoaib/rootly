"use client";

import * as React from "react";

import {
  AiBrain01Icon,
  Search02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Calendar01Icon,
  Home01Icon,
  LibraryIcon,
  Loading01Icon,
  Moon02Icon,
  Note05Icon,
  Logout01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "@/app/auth/actions";

import RootlyLogo from "@/components/rootly-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import { FloatingDock } from "@/components/ui/floating-dock";

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
} from "@/components/ui/command";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { DashboardShellUser } from "@/lib/dashboard-session";

type ShellFab = {
  ariaLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type DashboardShellContextValue = {
  registerFab: (pathname: string, fab?: ShellFab) => void;
  unregisterFab: (pathname: string) => void;
};

const DashboardShellContext =
  React.createContext<DashboardShellContextValue | null>(null);

function ThemeToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon icon={Sun01Icon} size={18} />
      <Switch
        aria-label="Toggle theme"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <HugeiconsIcon icon={Moon02Icon} size={18} />
    </div>
  );
}

export function DashboardShell({
  children,
  fab,
  user,
}: {
  children: React.ReactNode;
  fab?: ShellFab;
  user: DashboardShellUser | null;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  const [commandOpen, setCommandOpen] = React.useState(false);
  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const [fabRegistry, setFabRegistry] = React.useState<Record<string, ShellFab>>(
    {}
  );

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "You";

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? "";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navigationItems = React.useMemo(
    () => [
      {
        label: "Overview",
        link: "/overview",
        icon: <HugeiconsIcon icon={Home01Icon} size={18} />,
      },
      {
        label: "Notes",
        link: "/notes",
        icon: <HugeiconsIcon icon={Note05Icon} size={18} />,
      },
      {
        label: "Courses",
        link: "/courses",
        icon: <HugeiconsIcon icon={LibraryIcon} size={18} />,
      },
      {
        label: "Daily",
        link: "/daily-entries",
        icon: <HugeiconsIcon icon={Calendar01Icon} size={18} />,
      },
      {
        label: "Review",
        link: "/review",
        icon: <HugeiconsIcon icon={AiBrain01Icon} size={18} />,
      },
    ],
    [],
  );

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey && !e.metaKey) return;
      if (e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      setCommandOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const registerFab = React.useCallback((targetPathname: string, nextFab?: ShellFab) => {
    setFabRegistry((current) => {
      if (!nextFab) {
        if (!(targetPathname in current)) {
          return current;
        }

        const next = { ...current };
        delete next[targetPathname];
        return next;
      }

      return {
        ...current,
        [targetPathname]: nextFab,
      };
    });
  }, []);

  const unregisterFab = React.useCallback((targetPathname: string) => {
    setFabRegistry((current) => {
      if (!(targetPathname in current)) {
        return current;
      }

      const next = { ...current };
      delete next[targetPathname];
      return next;
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({ registerFab, unregisterFab }),
    [registerFab, unregisterFab]
  );

  const activeFab = fabRegistry[pathname] ?? fab;

  return (
    <DashboardShellContext.Provider value={contextValue}>
      <div className="min-h-svh">
        <header className="fixed inset-x-0 top-0 z-20 border-b bg-background">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <Link href="/" aria-label="Home">
                <RootlyLogo className="size-6" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                aria-label="Open search"
                onClick={() => setCommandOpen(true)}
                className="gap-2 md:hidden"
              >
                <HugeiconsIcon icon={Search02Icon} size={18} />
                Search
              </Button>

              <Button
                variant="outline"
                type="button"
                className="hidden min-w-72 justify-between md:inline-flex"
                onClick={() => setCommandOpen(true)}
              >
                <span className="text-muted-foreground">
                  Search or jump to...
                </span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="User menu"
                className="rounded-full md:hidden"
                onClick={() => setAvatarOpen(true)}
              >
                <Avatar>
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>

              <div className="hidden md:block">
                <UserAvatarPopover user={user} />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-svh pt-14 pb-28">{children}</main>

        <FloatingDock navigationItems={navigationItems} />

        {activeFab ? (
          <Button
            size="icon-lg"
            type="button"
            className="fixed right-4 bottom-20 z-30 rounded-full md:hidden"
            aria-label={activeFab.ariaLabel}
            onClick={activeFab.onClick}
          >
            {activeFab.icon}
          </Button>
        ) : null}

        <CommandPalette
          isMobile={isMobile}
          open={commandOpen}
          onOpenChange={setCommandOpen}
        />

        <MobileAvatarSheet
          open={avatarOpen}
          onOpenChange={setAvatarOpen}
          user={user}
        />
      </div>
    </DashboardShellContext.Provider>
  );
}

export function useDashboardShellFab(fab?: ShellFab) {
  const pathname = usePathname();
  const context = React.useContext(DashboardShellContext);

  React.useEffect(() => {
    if (!context) {
      return;
    }

    context.registerFab(pathname, fab);

    return () => {
      context.unregisterFab(pathname);
    };
  }, [context, fab, pathname]);
}

function UserAvatarPopover({ user }: { user: DashboardShellUser | null }) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "You";

  const displayEmail = user?.email ?? "";

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? "";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="User menu"
            className="rounded-full"
          />
        }
      >
        <Avatar>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-72">
        <div className="flex flex-col gap-4 p-2">
          <div>
            <div className="font-medium">{displayName}</div>
            <div className="text-sm text-muted-foreground">{displayEmail}</div>
          </div>

          <DropdownMenuSeparator />
          <ThemeSwitcher />

          <div className="flex items-center justify-between">
            <div className="text-sm">Theme</div>
            <ThemeToggle
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            disabled={loggingOut}
            className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
            onClick={async () => {
              if (loggingOut) return;
              setLoggingOut(true);
              try {
                await signOut();
                router.push("/login");
              } finally {
                setLoggingOut(false);
              }
            }}
          >
            <HugeiconsIcon
              icon={loggingOut ? Loading01Icon : Logout01Icon}
              size={18}
              className={loggingOut ? "animate-spin" : undefined}
            />
            {loggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileAvatarSheet({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DashboardShellUser | null;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "You";

  const displayEmail = user?.email ?? "";

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? "";

  void avatarUrl;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-medium">{displayName}</div>
              <div className="text-sm text-muted-foreground">
                {displayEmail}
              </div>
            </div>

            <ThemeSwitcher />

            <div className="flex items-center justify-between">
              <div className="text-sm">Theme</div>
              <ThemeToggle
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <Button
              variant="destructive-outline"
              className="w-full"
              type="button"
              disabled={loggingOut}
              onClick={async () => {
                if (loggingOut) return;
                setLoggingOut(true);
                try {
                  await signOut();
                  router.push("/login");
                } finally {
                  setLoggingOut(false);
                }
              }}
            >
              <HugeiconsIcon
                icon={loggingOut ? Loading01Icon : Logout01Icon}
                size={18}
                className={loggingOut ? "animate-spin" : undefined}
              />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </SheetPanel>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  );
}

function CommandPalette({
  isMobile,
  open,
  onOpenChange,
}: {
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  type Item = {
    value: string;
    label: string;
    shortcut?: string;
  };

  type Group = {
    value: string;
    items: Item[];
  };

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
  ];

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

      {!isMobile ? (
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
      ) : null}
    </Command>
  );

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
    );
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandDialogPopup>{content}</CommandDialogPopup>
    </CommandDialog>
  );
}
