"use client";

import * as React from "react";

import {
  CheckmarkCircle02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Calcom from "@/components/theme-icons/calcom-coss-ui";
import { ClaudeAI } from "@/components/theme-icons/claude";
import { ClaudeBlue } from "@/components/theme-icons/claude-blue";
import { Discord } from "@/components/theme-icons/discord";
import { IBM } from "@/components/theme-icons/ibm";
import Milka from "@/components/theme-icons/milka";
import { Snapchat } from "@/components/theme-icons/snapchat";
import { PerplexityAI } from "@/components/theme-icons/perplexity";
import Sakura from "@/components/theme-icons/sakura";
import { Supabase } from "@/components/theme-icons/supabase";
import { Twitter } from "@/components/theme-icons/twitter";
import { Vercel } from "@/components/theme-icons/vercel";
import { Twitch } from "@/components/theme-icons/twitch";
import { Zed } from "@/components/theme-icons/zed";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { SelectButton } from "@/components/ui/select";
import { useColorTheme } from "@/hooks/use-color-theme";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

type ThemeOption = {
  label: string;
  value: string;
};

type ThemeIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const THEME_ITEMS: ThemeOption[] = [
  { label: "Claude Blue (Default)", value: "claude-blue" },
  { label: "Coss UI", value: "default" },
  ...THEMES.filter((theme) => theme.id !== "claude-blue").map((theme) => ({
    label: theme.label,
    value: theme.id,
  })),
];

const THEME_ITEMS_BY_ID = new Map(
  THEME_ITEMS.map((item) => [item.value, item]),
);

const THEME_ICONS: Record<string, ThemeIconComponent> = {
  default: Calcom,
  milka: Milka,
  claude: ClaudeAI,
  discord: Discord,
  ibm: IBM,
  twitter: Twitter,
  snapchat: Snapchat,
  supabase: Supabase,
  sakura: Sakura,
  perplexity: PerplexityAI,
  vercel: Vercel,
  twitch: Twitch,
  "claude-blue": ClaudeBlue,
  zed: Zed,
};

function ThemeIcon({ value }: { value: string }) {
  const Icon = THEME_ICONS[value] ?? Calcom;

  return (
    <span
      aria-hidden="true"
      className="flex h-5 max-w-8 min-w-5 shrink-0 items-center justify-center rounded-md px-1 [&_svg]:max-h-4 [&_svg]:w-auto [&_svg]:max-w-full"
    >
      <Icon />
    </span>
  );
}

function ThemeOptionContent({
  item,
  active = false,
  showCheck = false,
}: {
  item: ThemeOption;
  active?: boolean;
  showCheck?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <ThemeIcon value={item.value} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {showCheck ? (
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          size={18}
          className={cn(
            "shrink-0 transition-opacity",
            active ? "text-primary opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

export function ThemeSwitcher() {
  const { themeId, setThemeId } = useColorTheme();

  const selected = React.useMemo(
    () => THEME_ITEMS_BY_ID.get(themeId) ?? THEME_ITEMS[0],
    [themeId],
  );

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="shrink-0 text-sm">Appearance</div>
      <div className="max-w-56 min-w-0 flex-1">
        <Combobox
          items={THEME_ITEMS}
          value={selected}
          onValueChange={(value) =>
            setThemeId(value?.value ?? THEME_ITEMS[0]?.value)
          }
        >
          <ComboboxTrigger render={<SelectButton />}>
            <ComboboxValue placeholder="Select a theme">
              {(item: ThemeOption | null) =>
                item ? <ThemeOptionContent item={item} /> : null
              }
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxPopup aria-label="Select a theme">
            <div className="border-b p-2">
              <ComboboxInput
                className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
                placeholder="Search themes..."
                showTrigger={false}
                startAddon={<HugeiconsIcon icon={Search01Icon} size={18} />}
              />
            </div>
            <ComboboxEmpty>No themes found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => {
                const active = item.value === themeId;

                return (
                  <ComboboxItem
                    key={item.value}
                    value={item}
                    showIndicator={false}
                  >
                    <ThemeOptionContent item={item} active={active} showCheck />
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
      </div>
    </div>
  );
}
