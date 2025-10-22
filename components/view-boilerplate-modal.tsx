"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Boilerplate {
  id: string
  title: string
  description: string | null
  code: string | null
  language: string | string[]
  tags: string[] | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
  created_at: string
  files?: Array<{
    url: string
    name: string
    size: number
    type: string
    path: string
  }> | null
}

interface ViewBoilerplateModalProps {
  boilerplate: Boilerplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewBoilerplateModal({ boilerplate, open, onOpenChange }: ViewBoilerplateModalProps) {
  const { toast } = useToast()
  const codeRef = useRef<HTMLElement>(null)
  const [isHighlighting, setIsHighlighting] = useState(false)

  // Map language names to Prism language identifiers
  const getLanguageClass = (lang: string): string => {
    const langMap: Record<string, string> = {
      JavaScript: "javascript",
      TypeScript: "typescript",
      Python: "python",
      Java: "java",
      "C++": "cpp",
      "C#": "csharp",
      PHP: "php",
      Ruby: "ruby",
      Go: "go",
      Rust: "rust",
      Swift: "swift",
      Kotlin: "kotlin",
      HTML: "html",
      CSS: "css",
      SCSS: "scss",
      SQL: "sql",
      Shell: "bash",
      Bash: "bash",
      PowerShell: "powershell",
      JSON: "json",
      GraphQL: "graphql",
      Markdown: "markdown",
      YAML: "yaml",
      Docker: "docker",
    }
    return langMap[lang] || "javascript"
  }

  useEffect(() => {
    if (!boilerplate?.code || !codeRef.current || !open) return

    const highlightCode = async () => {
      setIsHighlighting(true)
      try {
        const Prism = (await import("prismjs")).default
        await import("prismjs/themes/prism-tomorrow.css")

        const langClass = getLanguageClass(
          Array.isArray(boilerplate.language) ? boilerplate.language[0] : boilerplate.language,
        )

        // Load language-specific components
        if (langClass === "typescript") await import("prismjs/components/prism-typescript")
        if (langClass === "python") await import("prismjs/components/prism-python")
        if (langClass === "java") await import("prismjs/components/prism-java")
        if (langClass === "cpp") await import("prismjs/components/prism-cpp")
        if (langClass === "csharp") await import("prismjs/components/prism-csharp")
        if (langClass === "php") await import("prismjs/components/prism-php")
        if (langClass === "ruby") await import("prismjs/components/prism-ruby")
        if (langClass === "go") await import("prismjs/components/prism-go")
        if (langClass === "rust") await import("prismjs/components/prism-rust")
        if (langClass === "swift") await import("prismjs/components/prism-swift")
        if (langClass === "kotlin") await import("prismjs/components/prism-kotlin")
        if (langClass === "scss") await import("prismjs/components/prism-scss")
        if (langClass === "sql") await import("prismjs/components/prism-sql")
        if (langClass === "bash") await import("prismjs/components/prism-bash")
        if (langClass === "powershell") await import("prismjs/components/prism-powershell")
        if (langClass === "graphql") await import("prismjs/components/prism-graphql")
        if (langClass === "markdown") await import("prismjs/components/prism-markdown")
        if (langClass === "yaml") await import("prismjs/components/prism-yaml")
        if (langClass === "docker") await import("prismjs/components/prism-docker")

        if (codeRef.current) {
          Prism.highlightElement(codeRef.current)
        }
      } catch (error) {
        console.error("[v0] Error loading Prism:", error)
      } finally {
        setIsHighlighting(false)
      }
    }

    highlightCode()
  }, [boilerplate, open])

  if (!boilerplate) return null

  const handleCopy = async () => {
    if (boilerplate.code) {
      await navigator.clipboard.writeText(boilerplate.code)
      toast({
        title: "Copied!",
        description: "Boilerplate code copied to clipboard",
      })
    }
  }

  const handleDownload = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a")
    a.href = fileUrl
    a.download = fileName
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast({
      title: "Downloaded!",
      description: `${fileName} downloaded successfully`,
    })
  }

  const handleDownloadAll = async () => {
    if (!boilerplate.files || boilerplate.files.length === 0) return

    toast({
      title: "Downloading...",
      description: `Downloading ${boilerplate.files.length} file(s)`,
    })

    for (const file of boilerplate.files) {
      const a = document.createElement("a")
      a.href = file.url
      a.download = file.name
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    toast({
      title: "Complete!",
      description: "All files downloaded successfully",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const displayLanguage = Array.isArray(boilerplate.language) ? boilerplate.language[0] : boilerplate.language
  const allLanguages = Array.isArray(boilerplate.language) ? boilerplate.language : [boilerplate.language]

  const hasMultipleFiles = boilerplate.files && boilerplate.files.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl md:text-2xl mb-2">{boilerplate.title}</DialogTitle>
              {boilerplate.description && (
                <p className="text-sm text-muted-foreground mb-3">{boilerplate.description}</p>
              )}
              <div className="flex flex-wrap gap-2 items-center">
                {allLanguages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
                {boilerplate.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {hasMultipleFiles ? (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Uploaded Files ({boilerplate.files!.length})</p>
                <Button onClick={handleDownloadAll} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {boilerplate.files!.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.path}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file.url, file.name)}
                      size="sm"
                      variant="ghost"
                      className="flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            boilerplate.file_url && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Uploaded File</p>
                    <p className="text-xs text-muted-foreground">{boilerplate.file_name}</p>
                    {boilerplate.file_size && (
                      <p className="text-xs text-muted-foreground">{formatFileSize(boilerplate.file_size)}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDownload(boilerplate.file_url!, boilerplate.file_name!)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )
          )}

          {/* Code display */}
          {boilerplate.code && (
            <div className="relative">
              <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-b-0">
                <span className="text-sm font-medium">{displayLanguage}</span>
                <Button onClick={handleCopy} size="sm" variant="ghost">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-[#2d2d2d] rounded-b-lg border overflow-hidden">
                <pre className="p-4 overflow-x-auto text-xs md:text-sm">
                  <code ref={codeRef} className={`language-${getLanguageClass(displayLanguage)}`}>
                    {boilerplate.code}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
