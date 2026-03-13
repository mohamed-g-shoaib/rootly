"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CodeBlock } from "@/components/ui/code-block"

import {
  Sheet,
  SheetClose,
  MockSheetFooter as SheetFooter,
  MockSheetHeader as SheetHeader,
  MockSheetPanel as SheetPanel,
  MockSheetPopup as SheetPopup,
  MockSheetTitle as SheetTitle,
} from "./mock-sheet"

import type { Note } from "@/app/notes/ui/notes-model"
import { toCodeBadgeLabel } from "@/app/notes/ui/notes-model"

export function MockNoteViewerSheet({
  note,
  open,
  onOpenChange,
  isMobile,
  onEdit,
}: {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  onEdit: () => void
}) {
  const title = note?.body
    ? note.body.split(" ").slice(0, 6).join(" ") +
      (note.body.split(" ").length > 6 ? "..." : "")
    : "Note"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            {note ? (
              <div className="flex flex-col gap-4">
                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {note.body ?? note.answer ?? ""}
                </div>
                {note.codeSnippet ? (
                  <CodeBlock
                    code={note.codeSnippet}
                    language={note.codeLanguage}
                  />
                ) : null}
              </div>
            ) : null}
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
            <Button variant="outline" onClick={onEdit}>
              Edit Note
            </Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}

export function MockCodeViewerSheet({
  note,
  open,
  onOpenChange,
  isMobile,
  onEdit,
}: {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  onEdit: () => void
}) {
  const title = note ? toCodeBadgeLabel(note.codeLanguage) : "Code Snippet"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="min-h-0 flex-1 px-4 pb-5">
            {note?.codeSnippet ? (
              <div className="flex min-h-0 flex-col gap-4">
                <ScrollArea
                  className="max-h-[calc(100svh-14rem)]"
                  scrollbarGutter
                >
                  <div className="pb-6">
                    <CodeBlock
                      code={note.codeSnippet}
                      language={note.codeLanguage}
                    />
                  </div>
                </ScrollArea>
              </div>
            ) : null}
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
            <Button variant="outline" onClick={onEdit}>
              Edit Note
            </Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}
