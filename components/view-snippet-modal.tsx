"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Download, Trash2, Star, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  const handleEdit = () => {
    onClose()
    router.push(`/dashboard/snippet/${snippet.id}/edit`)
  }

  const handleDelete = () => {
    onDelete(snippet.id)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
              <Button variant="default" size="sm" onClick={handleEdit} className="text-xs md:text-sm">
                <Edit className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-xs md:text-sm text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 md:px-6 py-3 md:py-4 overflow-auto">
          <div className="bg-muted rounded-lg p-3 md:p-4 min-h-[300px]">
            <pre className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
              {snippet.code}
            </pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
