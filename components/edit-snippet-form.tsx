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
import { MarkdownEditor } from "@/components/markdown-editor"

const languages = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "Vue.js",
  "Angular",
  "React Native",
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
  "Tailwind CSS",
  "Bootstrap",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Shell",
  "Bash",
  "PowerShell",
  "NestJS",
  "Svelte",
  "Deno",
  "GraphQL",
  "JSON",
  "Django",
  "Flask",
  "Laravel",
  "Docker",
  "Markdown",
  "Other",
]

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

interface EditSnippetFormProps {
  snippet: Snippet
}

export function EditSnippetForm({ snippet }: EditSnippetFormProps) {
  const [title, setTitle] = useState(snippet.title)
  const [description, setDescription] = useState(snippet.description || "")
  const [language, setLanguage] = useState(snippet.language)
  const [code, setCode] = useState(snippet.code)
  const [tags, setTags] = useState<string[]>(snippet.tags)
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
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
        description: "You must be logged in to edit snippets.",
        variant: "destructive",
      })
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
      const { error } = await supabase
        .from("snippets")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          code: code.trim(),
          language: language,
          tags: tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", snippet.id)
        .eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Snippet updated successfully!",
      })

      router.push(`/dashboard/snippet/${snippet.id}`)
    } catch (error) {
      console.error("Error updating snippet:", error)
      toast({
        title: "Error",
        description: "Failed to update snippet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
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
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              placeholder="Describe what this snippet does... (Markdown supported)"
              rows={5}
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
            <Textarea
              id="code"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="font-mono text-sm"
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Link href={`/dashboard/snippet/${snippet.id}`}>
          <Button type="button" variant="outline" disabled={loading}>
            Cancel
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !title.trim() || !code.trim() || !language}>
            {loading ? "Updating..." : "Update Snippet"}
          </Button>
        </div>
      </div>
    </form>
  )
}
