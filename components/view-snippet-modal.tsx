"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Download, Trash2, Star, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-php"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-css"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-powershell"
import "prismjs/components/prism-graphql"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-docker"

interface Snippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  user_id: string
}

interface ViewSnippetModalProps {
  snippet: Snippet
  isOpen: boolean
  onClose: () => void
  onCopy: (code: string) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  onExport: (snippet: Snippet) => void
}

const getLanguageForHighlighter = (language: string): string => {
  const languageMap: Record<string, string> = {
    JavaScript: "javascript",
    TypeScript: "typescript",
    React: "jsx",
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
    "Tailwind CSS": "css",
    Bootstrap: "css",
    SQL: "sql",
    Shell: "bash",
    Bash: "bash",
    PowerShell: "powershell",
    "Node.js": "javascript",
    "Next.js": "jsx",
    "Express.js": "javascript",
    NestJS: "typescript",
    "Vue.js": "javascript",
    Angular: "typescript",
    "React Native": "jsx",
    Django: "python",
    Flask: "python",
    Laravel: "php",
    Docker: "dockerfile",
    Markdown: "markdown",
    PostgreSQL: "sql",
    MySQL: "sql",
    MongoDB: "javascript",
    Redis: "bash",
    GraphQL: "graphql",
    JSON: "json",
  }

  return languageMap[language] || "text"
}

export function ViewSnippetModal({
  snippet,
  isOpen,
  onClose,
  onCopy,
  onDelete,
  onToggleFavorite,
  onExport,
}: ViewSnippetModalProps) {
  const router = useRouter()
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current && isOpen) {
      Prism.highlightElement(codeRef.current)
    }
  }, [snippet.code, snippet.language, isOpen])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const codeLines = snippet.code.split("\n")
  const languageClass = `language-${getLanguageForHighlighter(snippet.language)}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-7xl max-h-[95vh] p-0 flex flex-col">
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg md:text-2xl mb-1 md:mb-2 truncate">{snippet.title}</DialogTitle>
              {snippet.description && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{snippet.description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-4">
            <Badge variant="secondary" className="text-xs md:text-sm">
              {snippet.language}
            </Badge>
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs md:text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3 md:mt-4 pt-3 md:pt-4 border-t">
            <span className="text-xs text-muted-foreground">Created on {formatDate(snippet.created_at)}</span>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(snippet.id, snippet.is_favorite)}
                className={`text-xs md:text-sm ${snippet.is_favorite ? "text-yellow-500" : ""}`}
              >
                <Star
                  className={`h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2 ${snippet.is_favorite ? "fill-current" : ""}`}
                />
                <span className="hidden sm:inline">{snippet.is_favorite ? "Favorited" : "Favorite"}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onCopy(snippet.code)} className="text-xs md:text-sm">
                <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onExport(snippet)} className="text-xs md:text-sm">
                <Download className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Export
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push(`/dashboard/snippet/${snippet.id}/edit`)}
                className="text-xs md:text-sm"
              >
                <Edit className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(snippet.id)
                  onClose()
                }}
                className="text-xs md:text-sm text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 md:px-6 py-3 md:py-4 overflow-auto">
          <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
            <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{snippet.language}</span>
              <Button variant="ghost" size="sm" onClick={() => onCopy(snippet.code)} className="h-7 text-xs">
                <Copy className="h-3 w-3 mr-1.5" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <div className="flex">
                {/* Line numbers */}
                <div className="select-none bg-muted/30 px-3 py-4 text-right border-r border-border">
                  {codeLines.map((_, index) => (
                    <div key={index} className="text-xs leading-6 text-muted-foreground/60">
                      {index + 1}
                    </div>
                  ))}
                </div>
                {/* Code content */}
                <pre className="flex-1 p-4 overflow-x-auto !bg-transparent !m-0">
                  <code ref={codeRef} className={`${languageClass} !bg-transparent text-xs md:text-sm leading-6`}>
                    {snippet.code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
