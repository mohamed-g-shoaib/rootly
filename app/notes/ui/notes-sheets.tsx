"use client"

import * as React from "react"

import dynamic from "next/dynamic"

import { CodeIcon, Flag01Icon, Search02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormSection,
  FormSectionDescription,
  FormSectionTitle,
} from "@/components/ui/form"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

import { CodeBlock } from "@/components/ui/code-block"

const CodeEditor = dynamic(
  () => import("@/components/ui/code-editor").then((m) => m.CodeEditor),
  { ssr: false }
)

import type { Note, NoteType } from "./notes-model"
import {
  understandingColor,
  understandingIcon,
  toCodeBadgeLabel,
} from "./notes-model"

type CodeLanguageOption = { value: string; label: string }

type NoteEditorSheetProps = {
  mode: "create" | "edit"
  note: Note | null
  courses: { id: string; title: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  lockedCourse?: { id: string; title: string }
  onSave?: (note: Note) => void
}

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
            <SheetClose render={<Button variant="ghost" type="button" />}>
              Close
            </SheetClose>
            <Button variant="outline" type="button" onClick={onEdit}>
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
            <SheetClose render={<Button variant="ghost" type="button" />}>
              Close
            </SheetClose>
            <Button variant="outline" type="button" onClick={onEdit}>
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
  onSave,
}: NoteEditorSheetProps) {
  const editorKey = mode === "edit" ? `edit-${note?.id ?? "missing"}` : "create"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? (
        <NoteEditorSheetBody
          key={`${editorKey}-${lockedCourse?.id ?? "unlocked"}`}
          mode={mode}
          note={note}
          courses={courses}
          onOpenChange={onOpenChange}
          isMobile={isMobile}
          lockedCourse={lockedCourse}
          onSave={onSave}
        />
      ) : null}
    </Sheet>
  )
}

function NoteEditorSheetBody({
  mode,
  note,
  courses,
  isMobile,
  lockedCourse,
  onSave,
}: Omit<NoteEditorSheetProps, "open">) {
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

  const [codeEnabled, setCodeEnabled] = React.useState(
    mode === "edit" ? Boolean(note?.codeSnippet ?? "") : false
  )
  const [codeLanguage, setCodeLanguage] = React.useState(
    mode === "edit" && note?.codeLanguage?.trim() ? note.codeLanguage : "tsx"
  )
  const [codeValue, setCodeValue] = React.useState(
    mode === "edit" ? (note?.codeSnippet ?? "") : ""
  )

  const [question, setQuestion] = React.useState(
    mode === "edit" ? (note?.question ?? "") : ""
  )
  const [answer, setAnswer] = React.useState(
    mode === "edit" ? (note?.answer ?? "") : ""
  )
  const [body, setBody] = React.useState(
    mode === "edit" ? (note?.body ?? "") : ""
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

  const canSave = React.useMemo(() => {
    if (!onSave) return false
    if (!type) return false

    if (type === "qa") {
      return Boolean(
        question.trim() && answer.trim() && understandingLevel != null
      )
    }

    return Boolean(body.trim())
  }, [answer, body, onSave, question, type, understandingLevel])

  function submit() {
    if (!onSave) return
    if (!type) return

    const now = new Date().toISOString()

    const id = mode === "edit" && note ? note.id : crypto.randomUUID()
    const createdAt = mode === "edit" && note ? note.createdAt : now

    const effectiveCourseId = courseId === "none" ? null : courseId
    const effectiveCourseTitle =
      effectiveCourseId && effectiveCourseId !== "none"
        ? (courses.find((c) => c.id === effectiveCourseId)?.title ?? null)
        : null

    const q = type === "qa" ? question.trim() : ""
    const a = type === "qa" ? answer.trim() : ""
    const b = type === "freeform" ? body.trim() : ""

    const next: Note = {
      id,
      type,
      courseId: effectiveCourseId,
      courseTitle: effectiveCourseTitle,
      question: q ? q : null,
      answer: a ? a : null,
      body: b ? b : null,
      understandingLevel: type === "qa" ? understandingLevel : null,
      flag: flagged,
      codeSnippet: codeEnabled ? (codeValue.trim() ? codeValue : null) : null,
      codeLanguage: codeEnabled ? codeLanguage : "text",
      createdAt,
      updatedAt: now,
    }

    onSave(next)
  }

  return (
    <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
      <Form className="h-full gap-0">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "New Note" : "Edit Note"}
          </SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          <div className="flex flex-col gap-5">
            {mode === "create" ? (
              <FormSection>
                <FormSectionTitle>Note type</FormSectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={type === "qa" ? "secondary" : "outline"}
                    type="button"
                    onClick={() => setType("qa")}
                  >
                    Q&A
                  </Button>
                  <Button
                    variant={type === "freeform" ? "secondary" : "outline"}
                    type="button"
                    onClick={() => setType("freeform")}
                  >
                    Freeform
                  </Button>
                </div>
              </FormSection>
            ) : (
              <div className="text-sm text-muted-foreground">
                Type: {note?.type === "qa" ? "Q&A" : "Freeform"}
              </div>
            )}

            {type ? (
              <>
                <FormSection>
                  <Label>Course (optional)</Label>
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
                </FormSection>

                {type === "qa" ? (
                  <>
                    <FormSection>
                      <Label>Question</Label>
                      <Textarea
                        placeholder="What is the question?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </FormSection>
                    <FormSection>
                      <Label>Answer</Label>
                      <Textarea
                        placeholder="Write the answer..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    </FormSection>
                    <FormSection>
                      <Label>Understanding level</Label>
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
                            icon={understandingIcon(1)}
                            size={18}
                            color={
                              understandingLevel === 1
                                ? understandingColor(1)
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
                            icon={understandingIcon(2)}
                            size={18}
                            color={
                              understandingLevel === 2
                                ? understandingColor(2)
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
                            icon={understandingIcon(3)}
                            size={18}
                            color={
                              understandingLevel === 3
                                ? understandingColor(3)
                                : "currentColor"
                            }
                          />
                          Clear
                        </Button>
                      </div>
                    </FormSection>
                  </>
                ) : (
                  <FormSection>
                    <Label>Note</Label>
                    <Textarea
                      placeholder="Write your note..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-40"
                    />
                  </FormSection>
                )}

                <FormSection>
                  <FormSectionTitle>Options</FormSectionTitle>
                  <FormSectionDescription>
                    Mark notes for future review or attach a code example when
                    it helps explain the idea.
                  </FormSectionDescription>
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
                </FormSection>

                {codeEnabled ? (
                  <FormSection>
                    <Label>Code snippet</Label>
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
                  </FormSection>
                ) : null}
              </>
            ) : null}
          </div>
        </SheetPanel>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
          <Button type="button" disabled={!canSave} onClick={submit}>
            Save Note
          </Button>
        </SheetFooter>
      </Form>
    </SheetPopup>
  )
}
