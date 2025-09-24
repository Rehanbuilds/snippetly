"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileCode, Database, Table } from "lucide-react"

interface Snippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  tags: string[]
  is_favorite: boolean
  created_at: string
}

interface ExportModalProps {
  snippet: Snippet
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ snippet, isOpen, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false)

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsTxt = () => {
    setIsExporting(true)
    const content = `Title: ${snippet.title}
Description: ${snippet.description || "No description"}
Language: ${snippet.language}
Tags: ${snippet.tags.join(", ")}
Created: ${new Date(snippet.created_at).toLocaleDateString()}

Code:
${snippet.code}`

    downloadFile(content, `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`, "text/plain")
    setIsExporting(false)
    onClose()
  }

  const exportAsMarkdown = () => {
    setIsExporting(true)
    const content = `# ${snippet.title}

${snippet.description ? `**Description:** ${snippet.description}\n` : ""}
**Language:** ${snippet.language}  
**Tags:** ${snippet.tags.join(", ")}  
**Created:** ${new Date(snippet.created_at).toLocaleDateString()}

## Code

\`\`\`${snippet.language.toLowerCase()}
${snippet.code}
\`\`\``

    downloadFile(content, `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`, "text/markdown")
    setIsExporting(false)
    onClose()
  }

  const exportAsJson = () => {
    setIsExporting(true)
    const content = JSON.stringify(
      {
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        is_favorite: snippet.is_favorite,
        created_at: snippet.created_at,
      },
      null,
      2,
    )

    downloadFile(content, `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`, "application/json")
    setIsExporting(false)
    onClose()
  }

  const exportAsCsv = () => {
    setIsExporting(true)
    const csvContent = `Title,Description,Language,Tags,Code,Created,Favorite
"${snippet.title}","${snippet.description || ""}","${snippet.language}","${snippet.tags.join("; ")}","${snippet.code.replace(/"/g, '""')}","${snippet.created_at}","${snippet.is_favorite}"`

    downloadFile(csvContent, `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`, "text/csv")
    setIsExporting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Snippet</DialogTitle>
          <DialogDescription>Choose a format to export "{snippet.title}"</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={exportAsTxt}
            disabled={isExporting}
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm">Text (.txt)</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={exportAsMarkdown}
            disabled={isExporting}
          >
            <FileCode className="h-6 w-6" />
            <span className="text-sm">Markdown (.md)</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={exportAsJson}
            disabled={isExporting}
          >
            <Database className="h-6 w-6" />
            <span className="text-sm">JSON (.json)</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={exportAsCsv}
            disabled={isExporting}
          >
            <Table className="h-6 w-6" />
            <span className="text-sm">CSV (.csv)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
