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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{snippet.title}</DialogTitle>
              {snippet.description && <p className="text-sm text-muted-foreground">{snippet.description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-sm">
              {snippet.language}
            </Badge>
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="text-xs text-muted-foreground">Created on {formatDate(snippet.created_at)}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(snippet.id, snippet.is_favorite)}
                className={snippet.is_favorite ? "text-yellow-500" : ""}
              >
                <Star className={`h-4 w-4 mr-2 ${snippet.is_favorite ? "fill-current" : ""}`} />
                {snippet.is_favorite ? "Favorited" : "Favorite"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onCopy(snippet.code)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onExport(snippet)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="default" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-250px)] px-6 py-4">
          <div className="bg-muted rounded-lg p-4">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">{snippet.code}</pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
