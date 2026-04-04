"use client"

import * as React from "react"

import { Download01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const EXTENSION_DOWNLOAD_URL =
  "https://drive.google.com/file/d/1BVTrB47erypG3tevi1U9Fv6BbNUBEiuiX/view?usp=sharing"

const INSTALL_STEPS = [
  "Download the ZIP from Google Drive and unzip it on your computer.",
  "Open chrome://extensions/ and enable Developer mode (top right).",
  "Click Load unpacked (top left) and select the unzipped folder.",
  "Log in from the extension or the dashboard.",
] as const

type HomepageExtensionDialogProps = {
  buttonClassName?: string
  buttonLabel?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
}

export function HomepageExtensionDialog({
  buttonClassName,
  buttonLabel = "Download Extension",
  buttonVariant = "outline",
}: HomepageExtensionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={buttonVariant}
            className={buttonClassName}
            aria-label={buttonLabel}
          />
        }
      >
        <HugeiconsIcon icon={Download01Icon} size={18} />
        {buttonLabel}
      </DialogTrigger>

      <DialogPopup className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Install the Rootly extension</DialogTitle>
          <DialogDescription>
            Rootly&apos;s side panel keeps note capture, quick logging, and your
            study timer beside the page while you keep learning.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-5">
          <ol className="flex flex-col gap-3">
            {INSTALL_STEPS.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3"
              >
                <div className="flex size-7 items-center justify-center rounded-full border bg-muted text-sm font-medium tabular-nums">
                  {index + 1}
                </div>
                <div className="pt-1 text-sm text-pretty text-muted-foreground">
                  {step}
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-xl border bg-muted/35 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={LinkSquare02Icon} size={16} />
              Download URL
            </div>
            <a
              href={EXTENSION_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              {EXTENSION_DOWNLOAD_URL}
            </a>
          </div>
        </DialogPanel>

        <DialogFooter>
          <Button
            render={
              <a
                href={EXTENSION_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Download Rootly extension"
              />
            }
          >
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Open download
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export { EXTENSION_DOWNLOAD_URL }
