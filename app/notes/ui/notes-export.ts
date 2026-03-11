import type { Note } from "./notes-model"

function formatDateForFilename(d: Date) {
  return d.toISOString().slice(0, 10)
}

function triggerDownload({
  filename,
  content,
  contentType,
}: {
  filename: string
  content: string
  contentType: string
}) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

export function exportNotesAsMarkdown(notes: Note[]): void {
  const md = notes
    .map((note) => {
      const parts: string[] = []

      if (note.type === "qa") {
        parts.push(`## Q: ${note.question ?? ""}`)
        parts.push("")
        parts.push(`**A:** ${note.answer ?? ""}`)
      } else {
        parts.push("## Note")
        parts.push("")
        parts.push(note.body ?? "")
      }

      if (note.codeSnippet) {
        parts.push("")
        parts.push(`\`\`\`${note.codeLanguage || "text"}`)
        parts.push(note.codeSnippet)
        parts.push("```")
      }

      return parts.join("\n")
    })
    .join("\n\n---\n\n")

  triggerDownload({
    filename: `rootly-notes-${formatDateForFilename(new Date())}.md`,
    content: md,
    contentType: "text/markdown;charset=utf-8",
  })
}
