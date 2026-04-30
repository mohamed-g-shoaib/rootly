"use client"

import * as React from "react"

import { getSingletonHighlighter } from "shiki/bundle/web"

import { useTheme } from "@/components/theme-provider"
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
type HighlightToken = {
  content: string
  color?: string
  fontStyle?: number
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
  const [tokens, setTokens] = React.useState<HighlightToken[][] | null>(null)

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
      const nextTokens = await highlighter.codeToTokensBase(code, {
        lang: shikiLang,
        theme,
      })

      if (canceled) return
      setTokens(nextTokens as HighlightToken[][])
    }

    setTokens(null)
    void highlight()

    return () => {
      canceled = true
    }
  }, [code, language, resolvedTheme])

  if (!tokens) {
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
    <pre
      className={cn(
        "overflow-hidden whitespace-pre-wrap break-all rounded-lg border bg-code p-3 text-xs",
        className
      )}
    >
      <code>
        {tokens.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.map((token, tokenIndex) => (
              <span
                key={`${lineIndex}-${tokenIndex}`}
                style={{
                  color: token.color,
                  fontStyle: token.fontStyle === 1 ? "italic" : "normal",
                  fontWeight: token.fontStyle === 2 ? "bold" : "normal",
                }}
              >
                {token.content}
              </span>
            ))}
            {lineIndex < tokens.length - 1 ? "\n" : null}
          </React.Fragment>
        ))}
      </code>
    </pre>
  )
}
