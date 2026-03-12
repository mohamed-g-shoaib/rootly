"use client"

import * as React from "react"

import dynamic from "next/dynamic"

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
  MockSheetFooter as SheetFooter,
  MockSheetHeader as SheetHeader,
  MockSheetPanel as SheetPanel,
  MockSheetPopup as SheetPopup,
  MockSheetTitle as SheetTitle,
} from "./mock-sheet"
import { Textarea } from "@/components/ui/textarea"
import { SelectButton } from "@/components/ui/select"

import type { Note, NoteType } from "@/app/notes/ui/notes-model"

const CodeEditor = dynamic(
  () => import("@/components/ui/code-editor").then((m) => m.CodeEditor),
  { ssr: false }
)

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

export function MockNoteEditorSheet({
  mode,
  note,
  courses,
  open,
  onOpenChange,
  isMobile,
  lockedCourse,
  onSave,
}: {
  mode: "create" | "edit"
  note: Note | null
  courses: { id: string; title: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  lockedCourse?: { id: string; title: string }
  onSave: (note: Note) => void
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

  const [qaQuestion, setQaQuestion] = React.useState(note?.question ?? "")
  const [qaAnswer, setQaAnswer] = React.useState(note?.answer ?? "")
  const [freeformBody, setFreeformBody] = React.useState(note?.body ?? "")

  const [codeEnabled, setCodeEnabled] = React.useState(
    Boolean(note?.codeSnippet)
  )
  const [codeLanguage, setCodeLanguage] = React.useState(
    note?.codeLanguage?.trim() ? note.codeLanguage : "tsx"
  )
  const [codeValue, setCodeValue] = React.useState(note?.codeSnippet ?? "")

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
    if (!open) return

    if (mode === "edit" && note) {
      setType(note.type)
      setCourseId(lockedCourse ? lockedCourse.id : (note.courseId ?? "none"))
      setFlagged(note.flag)
      setUnderstandingLevel(note.understandingLevel ?? null)
      setQaQuestion(note.question ?? "")
      setQaAnswer(note.answer ?? "")
      setFreeformBody(note.body ?? "")
      const snippet = note.codeSnippet ?? ""
      setCodeEnabled(Boolean(snippet))
      setCodeLanguage(note.codeLanguage?.trim() ? note.codeLanguage : "tsx")
      setCodeValue(snippet)
      return
    }

    if (mode === "create") {
      setType(null)
      setCourseId(lockedCourse ? lockedCourse.id : "none")
      setFlagged(false)
      setUnderstandingLevel(null)
      setQaQuestion("")
      setQaAnswer("")
      setFreeformBody("")
      setCodeEnabled(false)
      setCodeLanguage("tsx")
      setCodeValue("")
    }
  }, [lockedCourse, mode, note, open])

  const canSave = Boolean(
    type &&
    (type === "qa"
      ? qaQuestion.trim() && qaAnswer.trim() && understandingLevel != null
      : freeformBody.trim())
  )

  function submit() {
    if (!type) return
    if (!canSave) return

    const now = new Date().toISOString()
    const id = mode === "edit" && note ? note.id : `note_${Date.now()}`
    const createdAt = mode === "edit" && note ? note.createdAt : now

    const effectiveCourseId = courseId === "none" ? null : courseId
    const courseTitle =
      effectiveCourseId == null
        ? null
        : (courses.find((c) => c.id === effectiveCourseId)?.title ?? null)

    const trimmedCode = codeEnabled ? codeValue.trim() : ""

    const next: Note =
      type === "qa"
        ? {
            id,
            type: "qa",
            courseId: effectiveCourseId,
            courseTitle,
            question: qaQuestion.trim(),
            answer: qaAnswer.trim(),
            body: null,
            understandingLevel: understandingLevel as 1 | 2 | 3,
            flag: flagged,
            codeSnippet: trimmedCode ? trimmedCode : null,
            codeLanguage: codeEnabled ? codeLanguage : "tsx",
            createdAt,
            updatedAt: now,
          }
        : {
            id,
            type: "freeform",
            courseId: effectiveCourseId,
            courseTitle,
            question: null,
            answer: null,
            body: freeformBody.trim(),
            understandingLevel: null,
            flag: flagged,
            codeSnippet: trimmedCode ? trimmedCode : null,
            codeLanguage: codeEnabled ? codeLanguage : "text",
            createdAt,
            updatedAt: now,
          }

    onSave(next)
  }

  const side = isMobile ? "bottom" : "right"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={side} variant="inset">
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
                      type="button"
                      variant={type === "qa" ? "secondary" : "outline"}
                      onClick={() => setType("qa")}
                    >
                      Q&amp;A
                    </Button>
                    <Button
                      type="button"
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
                          value={qaQuestion}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setQaQuestion(e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Answer
                        </div>
                        <Textarea
                          placeholder="Write the answer..."
                          value={qaAnswer}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setQaAnswer(e.target.value)}
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
                        value={freeformBody}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFreeformBody(e.target.value)
                        }
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

                      <CodeEditor
                        language={codeLanguage}
                        value={codeValue}
                        onChange={setCodeValue}
                        className="min-h-40"
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <Button disabled={!canSave} onClick={submit}>
              Save Note
            </Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}
