"use client"

import * as React from "react"

import { useTheme } from "next-themes"
import { createHighlighter, type Highlighter } from "shiki"

const SUPPORTED_LANGUAGES = [
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "json",
  "bash",
  "sql",
  "python",
  "css",
  "html",
  "markdown",
  "yaml",
  "rust",
  "go",
  "java",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [...SUPPORTED_LANGUAGES],
    })
  }

  return highlighterPromise
}

export function CodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { resolvedTheme } = useTheme()
  const [html, setHtml] = React.useState<string | null>(null)

  React.useEffect(() => {
    let canceled = false

    async function highlight() {
      const highlighter = await getHighlighter()
      const lang = (SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
        ? (language as SupportedLanguage)
        : "tsx") as SupportedLanguage

      const theme = resolvedTheme === "dark" ? "github-dark" : "github-light"

      const nextHtml = highlighter.codeToHtml(code, {
        lang,
        theme,
      })

      if (canceled) return
      setHtml(nextHtml)
    }

    setHtml(null)
    void highlight()

    return () => {
      canceled = true
    }
  }, [code, language, resolvedTheme])

  if (!html) {
    return (
      <pre className="overflow-x-auto rounded-lg border bg-code p-3 text-xs">
        {code}
      </pre>
    )
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border bg-code p-3 text-xs"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const CODE_BLOCK_LANGUAGES = SUPPORTED_LANGUAGES
