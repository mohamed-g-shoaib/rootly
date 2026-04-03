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
import { Spinner } from "@/components/ui/spinner"

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
  loading?: boolean
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
  loading,
  onEdit,
}: {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  loading: boolean
  onEdit: () => void
}) {
  const title = note?.body
    ? note.body.split(" ").slice(0, 6).join(" ") +
      (note.body.split(" ").length > 6 ? "..." : "")
    : (note?.question ?? "Note")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : note ? (
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
  loading,
  onEdit,
}: {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  loading: boolean
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
            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : note?.codeSnippet ? (
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
  loading = false,
  onSave,
}: NoteEditorSheetProps) {
  const editorKey = mode === "edit" ? `edit-${note?.id ?? "missing"}` : "create"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? (
        loading ? (
          <SheetPopup side={isMobile ? "bottom" : "right"} variant="inset">
            <Form className="h-full gap-0">
              <SheetHeader>
                <SheetTitle>
                  {mode === "create" ? "New Note" : "Edit Note"}
                </SheetTitle>
              </SheetHeader>
              <SheetPanel className="flex min-h-40 items-center justify-center px-4 pb-5">
                <Spinner />
              </SheetPanel>
              <SheetFooter>
                <SheetClose render={<Button variant="ghost" />}>
                  Cancel
                </SheetClose>
              </SheetFooter>
            </Form>
          </SheetPopup>
        ) : (
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
        )
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
      previewText: type === "qa" ? a : b,
      answer: a ? a : null,
      body: b ? b : null,
      understandingLevel: type === "qa" ? understandingLevel : null,
      flag: flagged,
      hasCodeSnippet: codeEnabled ? Boolean(codeValue.trim()) : false,
      codeSnippet: codeEnabled ? (codeValue.trim() ? codeValue : null) : null,
      codeLanguage: codeEnabled ? codeLanguage : "text",
      createdAt,
      updatedAt: now,
      detailsLoaded: true,
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
            <NoteTypeSection
              mode={mode}
              note={note}
              type={type}
              onTypeChange={setType}
            />

            {type ? (
              <>
                <CourseSelectionSection
                  lockedCourse={lockedCourse}
                  courseItems={courseItems}
                  selectedCourse={selectedCourse}
                  courseId={courseId}
                  onCourseChange={setCourseId}
                />

                {type === "qa" ? (
                  <QaFieldsSection
                    question={question}
                    answer={answer}
                    understandingLevel={understandingLevel}
                    onQuestionChange={setQuestion}
                    onAnswerChange={setAnswer}
                    onUnderstandingLevelChange={setUnderstandingLevel}
                  />
                ) : (
                  <FreeformFieldSection body={body} onBodyChange={setBody} />
                )}

                <NoteOptionsSection
                  flagged={flagged}
                  codeEnabled={codeEnabled}
                  onToggleFlagged={() => setFlagged((v) => !v)}
                  onToggleCodeEnabled={() => setCodeEnabled((v) => !v)}
                />

                {codeEnabled ? (
                  <CodeSnippetSection
                    codeLanguage={codeLanguage}
                    codeValue={codeValue}
                    onCodeLanguageChange={setCodeLanguage}
                    onCodeValueChange={setCodeValue}
                  />
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

function NoteTypeSection({
  mode,
  note,
  type,
  onTypeChange,
}: {
  mode: "create" | "edit"
  note: Note | null
  type: NoteType | null
  onTypeChange: (type: NoteType) => void
}) {
  if (mode === "edit") {
    return (
      <div className="text-sm text-muted-foreground">
        Type: {note?.type === "qa" ? "Q&A" : "Freeform"}
      </div>
    )
  }

  return (
    <FormSection>
      <FormSectionTitle>Note type</FormSectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={type === "qa" ? "secondary" : "outline"}
          type="button"
          onClick={() => onTypeChange("qa")}
        >
          Q&A
        </Button>
        <Button
          variant={type === "freeform" ? "secondary" : "outline"}
          type="button"
          onClick={() => onTypeChange("freeform")}
        >
          Freeform
        </Button>
      </div>
    </FormSection>
  )
}

function CourseSelectionSection({
  lockedCourse,
  courseItems,
  selectedCourse,
  courseId,
  onCourseChange,
}: {
  lockedCourse?: { id: string; title: string }
  courseItems: { value: string; label: string }[]
  selectedCourse: { value: string; label: string } | undefined
  courseId: string
  onCourseChange: (courseId: string) => void
}) {
  return (
    <FormSection>
      <Label>Course (optional)</Label>
      {lockedCourse ? (
        <div className="pt-1 text-sm">{lockedCourse.title}</div>
      ) : (
        <Combobox
          items={courseItems}
          value={selectedCourse}
          onValueChange={(value) => onCourseChange(value?.value ?? "none")}
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
  )
}

function QaFieldsSection({
  question,
  answer,
  understandingLevel,
  onQuestionChange,
  onAnswerChange,
  onUnderstandingLevelChange,
}: {
  question: string
  answer: string
  understandingLevel: 1 | 2 | 3 | null
  onQuestionChange: (value: string) => void
  onAnswerChange: (value: string) => void
  onUnderstandingLevelChange: (value: 1 | 2 | 3) => void
}) {
  return (
    <>
      <FormSection>
        <Label>Question</Label>
        <Textarea
          placeholder="What is the question?"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
        />
      </FormSection>
      <FormSection>
        <Label>Answer</Label>
        <Textarea
          placeholder="Write the answer..."
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      </FormSection>
      <FormSection>
        <Label>Understanding level</Label>
        <div className="grid grid-cols-3 gap-2">
          <UnderstandingButton
            level={1}
            activeLevel={understandingLevel}
            label="Confused"
            onClick={onUnderstandingLevelChange}
          />
          <UnderstandingButton
            level={2}
            activeLevel={understandingLevel}
            label="Getting It"
            onClick={onUnderstandingLevelChange}
          />
          <UnderstandingButton
            level={3}
            activeLevel={understandingLevel}
            label="Clear"
            onClick={onUnderstandingLevelChange}
          />
        </div>
      </FormSection>
    </>
  )
}

function UnderstandingButton({
  level,
  activeLevel,
  label,
  onClick,
}: {
  level: 1 | 2 | 3
  activeLevel: 1 | 2 | 3 | null
  label: string
  onClick: (value: 1 | 2 | 3) => void
}) {
  return (
    <Button
      type="button"
      variant={activeLevel === level ? "secondary" : "outline"}
      className="gap-2"
      onClick={() => onClick(level)}
    >
      <HugeiconsIcon
        icon={understandingIcon(level)}
        size={18}
        color={
          activeLevel === level ? understandingColor(level) : "currentColor"
        }
      />
      {label}
    </Button>
  )
}

function FreeformFieldSection({
  body,
  onBodyChange,
}: {
  body: string
  onBodyChange: (value: string) => void
}) {
  return (
    <FormSection>
      <Label>Note</Label>
      <Textarea
        placeholder="Write your note..."
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        className="min-h-40"
      />
    </FormSection>
  )
}

function NoteOptionsSection({
  flagged,
  codeEnabled,
  onToggleFlagged,
  onToggleCodeEnabled,
}: {
  flagged: boolean
  codeEnabled: boolean
  onToggleFlagged: () => void
  onToggleCodeEnabled: () => void
}) {
  return (
    <FormSection>
      <FormSectionTitle>Options</FormSectionTitle>
      <FormSectionDescription>
        Mark notes for future review or attach a code example when it helps
        explain the idea.
      </FormSectionDescription>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant={flagged ? "secondary" : "outline"}
          className="w-full justify-start gap-2"
          onClick={onToggleFlagged}
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
          onClick={onToggleCodeEnabled}
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
  )
}

function CodeSnippetSection({
  codeLanguage,
  codeValue,
  onCodeLanguageChange,
  onCodeValueChange,
}: {
  codeLanguage: string
  codeValue: string
  onCodeLanguageChange: (value: string) => void
  onCodeValueChange: (value: string) => void
}) {
  return (
    <FormSection>
      <Label>Code snippet</Label>
      <Combobox
        items={[...CODE_LANGUAGE_OPTIONS]}
        value={
          CODE_LANGUAGE_OPTIONS.find((x) => x.value === codeLanguage) ??
          CODE_LANGUAGE_OPTIONS[0]
        }
        onValueChange={(item) => onCodeLanguageChange(item?.value ?? "tsx")}
      >
        <ComboboxTrigger render={<SelectButton />} aria-label="Code language">
          <ComboboxValue placeholder="Language" />
        </ComboboxTrigger>
        <ComboboxPopup aria-label="Select language">
          <div className="border-b p-2">
            <ComboboxInput
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              placeholder="Search languages..."
              showTrigger={false}
              startAddon={<HugeiconsIcon icon={Search02Icon} size={18} />}
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
        onChange={onCodeValueChange}
        className="min-h-40"
      />
    </FormSection>
  )
}
