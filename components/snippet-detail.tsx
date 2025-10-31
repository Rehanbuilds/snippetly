"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Star, Edit, Trash2, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Snippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
  user_id: string
}

interface SnippetDetailProps {
  snippetId: string
}

export function SnippetDetail({ snippetId }: SnippetDetailProps) {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const { data, error } = await supabase.from("snippets").select("*").eq("id", snippetId).single()

        if (error) throw error

        setSnippet(data)
      } catch (error) {
        console.error("Error loading snippet:", error)
        toast({
          title: "Error",
          description: "Failed to load snippet.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadSnippet()
  }, [snippetId, supabase, router])

  const handleCopy = async () => {
    if (!snippet) return

    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied to clipboard",
        description: "Code snippet copied to your clipboard.",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const toggleFavorite = async () => {
    if (!snippet || !user) return

    try {
      const { error } = await supabase
        .from("snippets")
        .update({ is_favorite: !snippet.is_favorite })
        .eq("id", snippet.id)
        .eq("user_id", user.id)

      if (error) throw error

      setSnippet({ ...snippet, is_favorite: !snippet.is_favorite })
      toast({
        title: snippet.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: `Snippet ${snippet.is_favorite ? "removed from" : "added to"} your favorites.`,
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

  const handleDelete = async () => {
    if (!snippet || !user) return

    if (!confirm("Are you sure you want to delete this snippet? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("snippets").delete().eq("id", snippet.id).eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Snippet deleted",
        description: "Your snippet has been deleted successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting snippet:", error)
      toast({
        title: "Error",
        description: "Failed to delete snippet.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading snippet...</p>
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Snippet not found.</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFavorite}>
            <Star className={`h-4 w-4 mr-2 ${snippet.is_favorite ? "fill-current text-yellow-500" : ""}`} />
            {snippet.is_favorite ? "Favorited" : "Add to Favorites"}
          </Button>
          <Link href={`/dashboard/snippet/${snippetId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive bg-transparent"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Snippet Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{snippet.title}</CardTitle>
              {snippet.description && <p className="text-muted-foreground">{snippet.description}</p>}
            </div>
          </div>

          {/* Tags and Language */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Badge variant="secondary" className="font-medium">
              {snippet.language}
            </Badge>
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Code Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Code</CardTitle>
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">
                {new Date(snippet.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Last updated:</span>
              <p className="font-medium">
                {new Date(snippet.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
