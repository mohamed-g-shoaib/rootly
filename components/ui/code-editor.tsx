"use client"

import * as React from "react"

import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { sql } from "@codemirror/lang-sql"
import { python } from "@codemirror/lang-python"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { markdown } from "@codemirror/lang-markdown"
import { yaml } from "@codemirror/lang-yaml"
import { rust } from "@codemirror/lang-rust"
import { java } from "@codemirror/lang-java"
import { cpp } from "@codemirror/lang-cpp"
import { php } from "@codemirror/lang-php"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

function getLanguageExtension(language: string) {
  const lang = language.toLowerCase()

  if (lang === "tsx" || lang === "jsx" || lang === "typescript" || lang === "javascript") {
    return javascript({ jsx: true, typescript: true })
  }

  if (lang === "json") return json()
  if (lang === "sql") return sql()
  if (lang === "python") return python()
  if (lang === "css") return css()
  if (lang === "html") return html()
  if (lang === "markdown") return markdown()
  if (lang === "yaml") return yaml()
  if (lang === "rust") return rust()
  if (lang === "java") return java()
  if (lang === "cpp") return cpp()
  if (lang === "php") return php()

  if (lang === "bash" || lang === "csharp" || lang === "go" || lang === "ruby" || lang === "swift") {
    return javascript({ jsx: true, typescript: true })
  }

  return javascript({ jsx: true, typescript: true })
}

export function CodeEditor({
  value,
  onChange,
  language,
  className,
}: {
  value: string
  onChange: (val: string) => void
  language: string
  className?: string
}) {
  const { resolvedTheme } = useTheme()

  const extensions = React.useMemo(() => {
    return [EditorView.lineWrapping, getLanguageExtension(language)]
  }, [language])

  const theme = resolvedTheme === "dark" ? githubDark : githubLight

  return (
    <div className={cn("overflow-hidden rounded-lg border text-xs", className)}>
      <CodeMirror
        value={value}
        onChange={(val) => onChange(val)}
        extensions={extensions}
        theme={theme}
        minHeight="160px"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
          foldGutter: false,
          autocompletion: false,
          bracketMatching: false,
        }}
      />
    </div>
  )
}
