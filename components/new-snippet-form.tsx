"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UpgradeModal } from "@/components/upgrade-modal"
import { CodeEditor } from "@/components/code-editor"

const languages = [
  "JavaScript",
  "TypeScript",
  "React",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "SCSS",
  "SQL",
  "Shell",
  "Bash",
  "PowerShell",
  "Node.js",
  "Next.js",
  "Express.js",
  "NestJS",
  "Vue.js",
  "Angular",
  "Svelte",
  "Deno",
  "GraphQL",
  "JSON",
  "Other",
]

export function NewSnippetForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userPlan, setUserPlan] = useState<any>(null)
  const [snippetCount, setSnippetCount] = useState(0)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await loadUserPlan(user.id)
        await loadSnippetCount(user.id)
      }
    }
    getUser()
  }, [supabase])

  const loadUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, plan_status, snippet_limit")
        .eq("id", userId)
        .single()

      if (error) throw error
      setUserPlan(data)
    } catch (error) {
      console.error("Error loading user plan:", error)
    }
  }

  const loadSnippetCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("snippets")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      if (error) throw error
      setSnippetCount(count || 0)
    } catch (error) {
      console.error("Error loading snippet count:", error)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create snippets.",
        variant: "destructive",
      })
      return
    }

    if (userPlan?.plan_type === "free" && snippetCount >= userPlan?.snippet_limit) {
      setShowUpgradeModal(true)
      return
    }

    if (!title.trim() || !code.trim() || !language) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          code: code.trim(),
          language: language,
          tags: tags,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.code === "LIMIT_REACHED") {
          setShowUpgradeModal(true)
          return
        }
        throw new Error(result.error || "Failed to create snippet")
      }

      toast({
        title: "Success",
        description: "Snippet created successfully!",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating snippet:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create snippet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Snippet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter snippet title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this snippet does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select programming language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <div className="rounded-lg border bg-muted/30 p-1">
                <CodeEditor
                  language={language}
                  value={code}
                  onChange={(val) => setCode(val)}
                  height="360px"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !title.trim() || !code.trim() || !language}>
              {loading ? "Saving..." : "Save Snippet"}
            </Button>
          </div>
        </div>
      </form>

      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={snippetCount}
          snippetLimit={userPlan.snippet_limit}
        />
      )}
    </>
  )
}
