"use client"

import * as React from "react"

import { useTheme } from "next-themes"
import { getSingletonHighlighter } from "shiki/bundle/web"

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
      const lang = SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
        ? (language as SupportedLanguage)
        : "tsx"

      const theme = resolvedTheme === "dark" ? "github-dark" : "github-light"
      const shikiLang = lang as unknown as any

      const highlighter = await getSingletonHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [shikiLang],
      })

      await highlighter.loadLanguage(shikiLang)

      const nextHtml = highlighter.codeToHtml(code, { lang: shikiLang, theme })

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
          "whitespace-pre-wrap break-all rounded-lg border bg-code p-3 text-xs",
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
        "overflow-hidden rounded-lg border text-xs [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_pre]:p-3",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const CODE_BLOCK_LANGUAGES = SUPPORTED_LANGUAGES
