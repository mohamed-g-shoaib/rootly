"use client"

import * as React from "react"

import {
  CheckmarkCircle01Icon,
  CodeIcon,
  Flag01Icon,
  InformationCircleIcon,
  Search02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { SelectButton } from "@/components/ui/select"

import { CodeBlock } from "@/components/ui/code-block"

import type { Note, NoteType } from "./notes-model"
import { toCodeBadgeLabel } from "./notes-model"

type CodeLanguageOption = { value: string; label: string }

const CODE_LANGUAGE_OPTIONS: CodeLanguageOption[] = [
  { value: "tsx", label: "TypeScript / TSX" },
  { value: "jsx", label: "JavaScript / JSX" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash / Shell" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
]

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
          <SheetPanel className="min-h-0 flex-1 px-4 pb-5">
            {note?.codeSnippet ? (
              <div className="flex min-h-0 flex-col gap-4">
                <div className="h-[calc(100svh-14rem)] overflow-auto">
                  <CodeBlock
                    code={note.codeSnippet}
                    language={note.codeLanguage}
                  />
                </div>
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

  const [flagged, setFlagged] = React.useState(
    mode === "edit" ? (note?.flag ?? false) : false
  )

  const [understandingLevel, setUnderstandingLevel] = React.useState<
    1 | 2 | 3 | null
  >(mode === "edit" ? (note?.understandingLevel ?? null) : null)

  const [codeEnabled, setCodeEnabled] = React.useState(false)
  const [codeLanguage, setCodeLanguage] = React.useState("tsx")
  const [codeValue, setCodeValue] = React.useState("")

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

    setFlagged(mode === "edit" ? (note?.flag ?? false) : false)
    setUnderstandingLevel(
      mode === "edit" ? (note?.understandingLevel ?? null) : null
    )

    if (mode === "edit" && note) {
      const snippet = note.codeSnippet ?? ""
      setCodeEnabled(Boolean(snippet))
      setCodeLanguage(note.codeLanguage?.trim() ? note.codeLanguage : "tsx")
      setCodeValue(snippet)
    }

    if (mode === "create") {
      setCodeEnabled(false)
      setCodeLanguage("tsx")
      setCodeValue("")
    }
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
                          <Button
                            type="button"
                            variant={
                              understandingLevel === 1 ? "secondary" : "outline"
                            }
                            className="gap-2"
                            onClick={() => setUnderstandingLevel(1)}
                          >
                            <HugeiconsIcon
                              icon={AlertCircleIcon}
                              size={18}
                              color={
                                understandingLevel === 1
                                  ? "var(--warning)"
                                  : "currentColor"
                              }
                            />
                            Confused
                          </Button>
                          <Button
                            type="button"
                            variant={
                              understandingLevel === 2 ? "secondary" : "outline"
                            }
                            className="gap-2"
                            onClick={() => setUnderstandingLevel(2)}
                          >
                            <HugeiconsIcon
                              icon={InformationCircleIcon}
                              size={18}
                              color={
                                understandingLevel === 2
                                  ? "var(--info)"
                                  : "currentColor"
                              }
                            />
                            Getting It
                          </Button>
                          <Button
                            type="button"
                            variant={
                              understandingLevel === 3 ? "secondary" : "outline"
                            }
                            className="gap-2"
                            onClick={() => setUnderstandingLevel(3)}
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle01Icon}
                              size={18}
                              color={
                                understandingLevel === 3
                                  ? "var(--success)"
                                  : "currentColor"
                              }
                            />
                            Clear
                          </Button>
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

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant={flagged ? "secondary" : "outline"}
                      className="w-full justify-start gap-2"
                      onClick={() => setFlagged((v) => !v)}
                    >
                      <HugeiconsIcon
                        icon={Flag01Icon}
                        size={18}
                        color={flagged ? "var(--destructive)" : "currentColor"}
                      />
                      Flag for review
                    </Button>

                    <Button
                      type="button"
                      variant={codeEnabled ? "secondary" : "outline"}
                      className="w-full justify-start gap-2"
                      onClick={() => setCodeEnabled((v) => !v)}
                    >
                      <HugeiconsIcon
                        icon={CodeIcon}
                        size={18}
                        color={codeEnabled ? "var(--info)" : "currentColor"}
                      />
                      Add code snippet
                    </Button>
                  </div>

                  {codeEnabled ? (
                    <div className="flex flex-col gap-2">
                      <Combobox
                        items={[...CODE_LANGUAGE_OPTIONS]}
                        value={
                          CODE_LANGUAGE_OPTIONS.find(
                            (x) => x.value === codeLanguage
                          ) ?? CODE_LANGUAGE_OPTIONS[0]
                        }
                        onValueChange={(item) =>
                          setCodeLanguage(item?.value ?? "tsx")
                        }
                      >
                        <ComboboxTrigger
                          render={<SelectButton />}
                          aria-label="Code language"
                        >
                          <ComboboxValue placeholder="Language" />
                        </ComboboxTrigger>
                        <ComboboxPopup aria-label="Select language">
                          <div className="border-b p-2">
                            <ComboboxInput
                              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
                              placeholder="Search languages..."
                              showTrigger={false}
                              startAddon={
                                <HugeiconsIcon icon={Search02Icon} size={18} />
                              }
                            />
                          </div>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(opt) => (
                              <ComboboxItem key={opt.value} value={opt}>
                                {opt.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxPopup>
                      </Combobox>

                      <Textarea
                        placeholder="Paste your code here..."
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        className="min-h-40 font-mono"
                      />
                    </div>
                  ) : null}
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
