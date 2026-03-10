"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetPanel, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import type { Note, NoteType } from "./notes-model"
import { toCodeBadgeLabel } from "./notes-model"

export function NoteViewerSheet({
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
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          {note ? (
            <div className="flex flex-col gap-4">
              <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                {note.body ?? note.answer ?? ""}
              </div>
              {note.codeSnippet ? (
                <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                  {note.codeSnippet}
                </pre>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  Edit Note
                </Button>
              </div>
            </div>
          ) : null}
        </SheetPanel>
      </SheetContent>
    </Sheet>
  )
}

export function CodeViewerSheet({
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
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          {note?.codeSnippet ? (
            <div className="flex flex-col gap-4">
              <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                {note.codeSnippet}
              </pre>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  Edit Note
                </Button>
              </div>
            </div>
          ) : null}
        </SheetPanel>
      </SheetContent>
    </Sheet>
  )
}

export function NoteEditorSheet({
  mode,
  note,
  courses,
  open,
  onOpenChange,
  isMobile,
}: {
  mode: "create" | "edit"
  note: Note | null
  courses: { id: string; title: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
}) {
  const [type, setType] = React.useState<NoteType | null>(
    mode === "edit" && note ? note.type : null
  )

  React.useEffect(() => {
    if (mode === "edit" && note) setType(note.type)
    if (mode === "create") setType(null)
  }, [mode, note])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "New Note" : "Edit Note"}</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          <div className="flex flex-col gap-4">
            {mode === "create" ? (
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Note type</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={type === "qa" ? "secondary" : "outline"}
                    onClick={() => setType("qa")}
                  >
                    Q&A
                  </Button>
                  <Button
                    variant={type === "freeform" ? "secondary" : "outline"}
                    onClick={() => setType("freeform")}
                  >
                    Freeform
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Type: {note?.type === "qa" ? "Q&A" : "Freeform"}
              </div>
            )}

            {type ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">Course (optional)</div>
                  <Select defaultValue={note?.courseId ?? "none"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectPopup>
                      <SelectItem value="none">No course</SelectItem>
                      {courses
                        .toSorted((a, b) => a.title.localeCompare(b.title))
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                    </SelectPopup>
                  </Select>
                </div>

                {type === "qa" ? (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">Question</div>
                      <Textarea
                        placeholder="What is the question?"
                        defaultValue={note?.question ?? ""}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Answer</div>
                      <Textarea
                        placeholder="Write the answer..."
                        defaultValue={note?.answer ?? ""}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Understanding Level</div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline">Confused</Button>
                        <Button variant="outline">Getting It</Button>
                        <Button variant="outline">Clear</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground">Note</div>
                    <Textarea
                      placeholder="Write your note..."
                      defaultValue={note?.body ?? ""}
                      className="min-h-40"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Flag for review</div>
                    <Switch
                      aria-label="Flag for review"
                      defaultChecked={note?.flag ?? false}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button disabled>Save Note</Button>
                </div>
              </>
            ) : null}
          </div>
        </SheetPanel>
      </SheetContent>
    </Sheet>
  )
}
