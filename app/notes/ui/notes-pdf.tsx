"use client"

import * as React from "react"

import type { Note } from "./notes-model"

function formatDateForFilename(d: Date) {
  return d.toISOString().slice(0, 10)
}

function formatDisplayDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

async function createPdfDocument(notes: Note[], exportDate: Date) {
  const { Document, Page, StyleSheet, Text, View } =
    await import("@react-pdf/renderer")

  const styles = StyleSheet.create({
    page: {
      padding: 36,
      fontSize: 11,
      fontFamily: "Helvetica",
      color: "#111827",
      lineHeight: 1.35,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 11,
      color: "#6B7280",
      marginBottom: 20,
    },
    noteBlock: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
    },
    label: {
      fontSize: 10,
      color: "#6B7280",
      marginBottom: 4,
    },
    body: {
      marginBottom: 10,
    },
    codeLabel: {
      marginTop: 6,
      fontSize: 10,
      color: "#6B7280",
      marginBottom: 4,
    },
    codeBlock: {
      fontFamily: "Courier",
      fontSize: 9,
      backgroundColor: "#F3F4F6",
      padding: 8,
      borderRadius: 4,
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Rootly Notes</Text>
        <Text style={styles.subtitle}>
          Exported {formatDisplayDate(exportDate)}
        </Text>

        {notes.map((note) => (
          <View key={note.id} style={styles.noteBlock}>
            {note.type === "qa" ? (
              <>
                <Text style={styles.label}>Question</Text>
                <Text style={styles.body}>{note.question ?? ""}</Text>
                <Text style={styles.label}>Answer</Text>
                <Text style={styles.body}>{note.answer ?? ""}</Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Note</Text>
                <Text style={styles.body}>{note.body ?? ""}</Text>
              </>
            )}

            {note.codeSnippet ? (
              <>
                <Text style={styles.codeLabel}>
                  Code ({note.codeLanguage || "text"})
                </Text>
                <Text style={styles.codeBlock}>{note.codeSnippet}</Text>
              </>
            ) : null}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export function useExportPdf(notes: Note[]): {
  exportPdf: () => Promise<void>
  exporting: boolean
} {
  const [exporting, setExporting] = React.useState(false)

  const exportPdf = React.useCallback(async () => {
    if (exporting) return
    setExporting(true)

    try {
      const exportDate = new Date()
      const [{ pdf }, pdfDocument] = await Promise.all([
        import("@react-pdf/renderer"),
        createPdfDocument(notes, exportDate),
      ])
      const instance = pdf(pdfDocument)

      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `rootly-notes-${formatDateForFilename(exportDate)}.pdf`
      a.click()

      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }, [exporting, notes])

  return { exportPdf, exporting }
}
