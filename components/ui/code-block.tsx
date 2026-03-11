"use client"

import * as React from "react"

import { useTheme } from "next-themes"
import { createHighlighter, type Highlighter } from "shiki"

import { cn } from "@/lib/utils"

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
  className,
}: {
  code: string
  language: string
  className?: string
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
      <pre
        className={cn(
          "rounded-lg border bg-code p-3 text-xs overflow-x-auto",
          className
        )}
      >
        {code}
      </pre>
    )
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-code p-3 text-xs [&_pre]:h-full [&_pre]:overflow-auto",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const CODE_BLOCK_LANGUAGES = SUPPORTED_LANGUAGES
