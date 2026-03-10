"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
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
                  <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                    {note.codeSnippet}
                  </pre>
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
      <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            {note?.codeSnippet ? (
              <div className="flex flex-col gap-4">
                <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                  {note.codeSnippet}
                </pre>
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

export function NoteEditorSheet({
  mode,
  note,
  courses,
  open,
  onOpenChange,
  isMobile,
  lockedCourse,
}: {
  mode: "create" | "edit"
  note: Note | null
  courses: { id: string; title: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  lockedCourse?: { id: string; title: string }
}) {
  const [type, setType] = React.useState<NoteType | null>(
    mode === "edit" && note ? note.type : null
  )

  const [courseId, setCourseId] = React.useState<string>(
    lockedCourse ? lockedCourse.id : (note?.courseId ?? "none")
  )

  const courseItems = React.useMemo<{ value: string; label: string }[]>(
    () => [
      { value: "none", label: "No course" },
      ...courses
        .toSorted((a, b) => a.title.localeCompare(b.title))
        .map((c) => ({ value: c.id, label: c.title })),
    ],
    [courses]
  )

  const selectedCourse = React.useMemo(
    () => courseItems.find((item) => item.value === courseId) ?? courseItems[0],
    [courseId, courseItems]
  )

  React.useEffect(() => {
    if (mode === "edit" && note) setType(note.type)
    if (mode === "create") setType(null)

    setCourseId(lockedCourse ? lockedCourse.id : (note?.courseId ?? "none"))
  }, [lockedCourse, mode, note, note?.courseId])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>
              {mode === "create" ? "New Note" : "Edit Note"}
            </SheetTitle>
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
                    <div className="text-sm text-muted-foreground">
                      Course (optional)
                    </div>
                    {lockedCourse ? (
                      <div className="pt-1 text-sm">{lockedCourse.title}</div>
                    ) : (
                      <Combobox
                        items={courseItems}
                        value={selectedCourse}
                        onValueChange={(value) =>
                          setCourseId(value?.value ?? "none")
                        }
                      >
                        <ComboboxInput
                          placeholder="Course"
                          aria-label="Course"
                          showClear={courseId !== "none"}
                        />
                        <ComboboxPopup>
                          <ComboboxEmpty>No results found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                <span className="truncate">{item.label}</span>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxPopup>
                      </Combobox>
                    )}
                  </div>

                  {type === "qa" ? (
                    <>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Question
                        </div>
                        <Textarea
                          placeholder="What is the question?"
                          defaultValue={note?.question ?? ""}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Answer
                        </div>
                        <Textarea
                          placeholder="Write the answer..."
                          defaultValue={note?.answer ?? ""}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Understanding Level
                        </div>
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
                      <div className="text-sm text-muted-foreground">
                        Flag for review
                      </div>
                      <Switch
                        aria-label="Flag for review"
                        defaultChecked={note?.flag ?? false}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <Button disabled>Save Note</Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}
