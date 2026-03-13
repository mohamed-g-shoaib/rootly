"use client"

import * as React from "react"

import { CheckmarkCircle01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { SelectButton } from "@/components/ui/select"
import { useColorTheme } from "@/hooks/use-color-theme"
import { THEMES } from "@/lib/themes"

export function ThemeSwitcher() {
  const { themeId, setThemeId } = useColorTheme()

  const items = React.useMemo(
    () => [
      { label: "Coss UI (Default)", value: "default" },
      ...THEMES.map((t) => ({ label: t.label, value: t.id })),
    ],
    []
  )

  const selected = React.useMemo(
    () => items.find((i) => i.value === themeId) ?? items[0],
    [items, themeId]
  )

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm">Appearance</div>
      <div className="w-56">
        <Combobox
          items={items}
          value={selected}
          onValueChange={(value) => setThemeId(value?.value ?? items[0]?.value)}
        >
          <ComboboxTrigger render={<SelectButton />}>
            <ComboboxValue placeholder="Select a theme" />
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
                const theme = THEMES.find((t) => t.id === item.value)
                const active = item.value === themeId

                return (
                  <ComboboxItem key={item.value} value={item}>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              item.value === "default"
                                ? "var(--color-neutral-800)"
                                : (theme?.light.primary ?? "transparent"),
                          }}
                        />
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              item.value === "default"
                                ? "var(--color-white)"
                                : (theme?.light.background ?? "transparent"),
                          }}
                        />
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              item.value === "default"
                                ? "rgb(0 0 0 / 0.04)"
                                : (theme?.light.accent ?? "transparent"),
                          }}
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className={active ? "opacity-100" : "opacity-0"}
                      />
                    </div>
                  </ComboboxItem>
                )
              }}
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
      </div>
    </div>
  )
}
