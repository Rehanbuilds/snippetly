"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Edit, Copy, Trash2, Star, Download } from "lucide-react"
import { ExportModal } from "./export-modal"
import { ViewSnippetModal } from "./view-snippet-modal"

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

interface SnippetGridProps {
  favoritesOnly?: boolean
  userId?: string
  searchQuery?: string
  selectedLanguage?: string
  selectedTag?: string
  snippets?: Snippet[]
}

export function SnippetGrid({
  favoritesOnly = false,
  userId,
  searchQuery = "",
  selectedLanguage = "all",
  selectedTag = "all",
  snippets: initialSnippets,
}: SnippetGridProps) {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets || [])
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(!initialSnippets)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (initialSnippets) {
      setSnippets(initialSnippets)
      setLoading(false)
      return
    }

    if (!userId) {
      console.error("[v0] SnippetGrid: userId is required when snippets are not provided")
      setLoading(false)
      return
    }

    const loadSnippets = async () => {
      try {
        let query = supabase
          .from("snippets")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (favoritesOnly) {
          query = query.eq("is_favorite", true)
        }

        const { data, error } = await query

        if (error) throw error

        setSnippets(data || [])
      } catch (error) {
        console.error("[v0] Error loading snippets:", error)
        toast({
          title: "Error",
          description: "Failed to load snippets.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSnippets()
  }, [userId, favoritesOnly, supabase, initialSnippets])

  useEffect(() => {
    let filtered = snippets

    if (searchQuery.trim()) {
      filtered = filtered.filter((snippet) => snippet.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedLanguage && selectedLanguage !== "all") {
      filtered = filtered.filter((snippet) => snippet.language.toLowerCase() === selectedLanguage.toLowerCase())
    }

    if (selectedTag && selectedTag !== "all") {
      filtered = filtered.filter((snippet) =>
        snippet.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()),
      )
    }

    setFilteredSnippets(filtered)
  }, [snippets, searchQuery, selectedLanguage, selectedTag])

  const toggleFavorite = async (snippetId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase.from("snippets").update({ is_favorite: !currentFavorite }).eq("id", snippetId)

      if (error) throw error

      setSnippets((prev) =>
        prev.map((snippet) => (snippet.id === snippetId ? { ...snippet, is_favorite: !currentFavorite } : snippet)),
      )

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: `Snippet ${currentFavorite ? "removed from" : "added to"} your favorites.`,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied to clipboard",
        description: "Code snippet copied to your clipboard.",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const deleteSnippet = async (snippetId: string) => {
    if (!confirm("Are you sure you want to delete this snippet? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("snippets").delete().eq("id", snippetId)

      if (error) throw error

      setSnippets((prev) => prev.filter((snippet) => snippet.id !== snippetId))

      toast({
        title: "Snippet deleted",
        description: "Your snippet has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting snippet:", error)
      toast({
        title: "Error",
        description: "Failed to delete snippet.",
        variant: "destructive",
      })
    }
  }

  const openExportModal = (snippet: Snippet) => {
    setSelectedSnippet(snippet)
    setExportModalOpen(true)
  }

  const closeExportModal = () => {
    setExportModalOpen(false)
    setSelectedSnippet(null)
  }

  const openViewModal = (snippet: Snippet) => {
    setSelectedSnippet(snippet)
    setViewModalOpen(true)
  }

  const closeViewModal = () => {
    setViewModalOpen(false)
    setSelectedSnippet(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading snippets...</p>
      </div>
    )
  }

  if (filteredSnippets.length === 0 && snippets.length > 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No snippets match your current filters.</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {favoritesOnly ? "No favorite snippets yet." : "No snippets found."}
        </p>
        <Link href="/dashboard/new">
          <Button>Create Your First Snippet</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSnippets.length} of {snippets.length} snippets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="group hover:shadow-md transition-shadow cursor-pointer">
            <div onClick={() => openViewModal(snippet)} className="block">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 hover:text-primary">{snippet.title}</CardTitle>
                    <CardDescription className="text-sm">{snippet.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1" onClick={(e) => e.preventDefault()}>
                    <Link href={`/dashboard/snippet/${snippet.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit snippet">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault()
                        copyToClipboard(snippet.code)
                      }}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault()
                        openExportModal(snippet)
                      }}
                      title="Export snippet"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        deleteSnippet(snippet.id)
                      }}
                      title="Delete snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-3 mb-4 font-mono text-sm overflow-hidden hover:bg-muted/80 transition-colors">
                  <pre className="text-xs leading-relaxed line-clamp-4">{snippet.code}</pre>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{snippet.language}</Badge>
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{formatDate(snippet.created_at)}</span>
                  <div className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-8 w-8 p-0 ${snippet.is_favorite ? "text-yellow-500" : ""}`}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(snippet.id, snippet.is_favorite)
                      }}
                      title={snippet.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`h-4 w-4 ${snippet.is_favorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {selectedSnippet && (
        <>
          <ViewSnippetModal
            snippet={selectedSnippet}
            isOpen={viewModalOpen}
            onClose={closeViewModal}
            onCopy={copyToClipboard}
            onDelete={deleteSnippet}
            onToggleFavorite={toggleFavorite}
            onExport={openExportModal}
          />
          <ExportModal snippet={selectedSnippet} isOpen={exportModalOpen} onClose={closeExportModal} />
        </>
      )}
    </>
  )
}
