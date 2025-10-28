"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Save, Check, User, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ExportModal } from "./export-modal"

interface PublicSnippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  tags: string[]
  created_at: string
  profiles: {
    display_name: string | null
    full_name: string | null
  }
}

interface PublicSnippetViewProps {
  publicId: string
}

export function PublicSnippetView({ publicId }: PublicSnippetViewProps) {
  const [snippet, setSnippet] = useState<PublicSnippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)

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
        const response = await fetch(`/api/snippets/public/${publicId}`)

        if (!response.ok) {
          throw new Error("Snippet not found")
        }

        const data = await response.json()
        setSnippet(data)
      } catch (error) {
        console.error("Error loading public snippet:", error)
        toast({
          title: "Error",
          description: "Failed to load snippet. It may not exist or is not public.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSnippet()
  }, [publicId])

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

  const handleSaveToAccount = async () => {
    if (!snippet || !user) {
      router.push("/signin")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${snippet.title} (Copy)`,
          description: snippet.description,
          code: snippet.code,
          language: snippet.language,
          tags: snippet.tags,
          is_public: false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save snippet")
      }

      toast({
        title: "Snippet saved",
        description: "Snippet has been added to your dashboard.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error saving snippet:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save snippet to your account.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading snippet...</p>
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Snippet not found or not public.</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const authorName = snippet.profiles?.display_name || snippet.profiles?.full_name || "Anonymous"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Snippetly
            </Link>
            {!user && (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signin">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
            {user && (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Author Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <CardTitle className="text-3xl">{snippet.title}</CardTitle>
                  {snippet.description && <p className="text-muted-foreground text-lg">{snippet.description}</p>}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>By {authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(snippet.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
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

          {/* Non-logged-in user message */}
          {!user && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>Sign up to save or export this snippet to your account.</span>
                <Link href="/signin">
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} variant="outline">
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

            {user && (
              <>
                <Button onClick={() => setExportModalOpen(true)} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleSaveToAccount} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save to My Account"}
                </Button>
              </>
            )}
          </div>

          {/* Code Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Export Modal */}
      {user && snippet && (
        <ExportModal
          snippet={{
            id: snippet.id,
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            language: snippet.language,
            tags: snippet.tags,
            is_favorite: false,
            created_at: snippet.created_at,
            user_id: "",
          }}
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  )
}
