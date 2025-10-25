"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, FileCode, Folder } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UpgradeModal } from "@/components/upgrade-modal"
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
  "Django",
  "Flask",
  "Laravel",
  "Docker",
  "Markdown",
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

  const [inputMode, setInputMode] = useState<"code" | "files">("code")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/snippets/upload-multiple", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload files")
      }

      const data = await response.json()
      setUploadedFiles(data.files)

      toast({
        title: "Success",
        description: `Uploaded ${data.files.length} file(s) successfully`,
      })
    } catch (error) {
      console.error("[v0] Error uploading files:", error)
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleMultipleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
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

    if (!title.trim() || !language) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (inputMode === "code" && !code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code.",
        variant: "destructive",
      })
      return
    }

    if (inputMode === "files" && uploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one file.",
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
          code: inputMode === "code" ? code.trim() : null,
          language: language,
          tags: tags,
          files: inputMode === "files" ? uploadedFiles : null,
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
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={inputMode === "code" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("code")}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Type Code
              </Button>
              <Button
                type="button"
                variant={inputMode === "files" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("files")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>

            {inputMode === "code" ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Multiple Files"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => folderInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Entire Folder"}
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleMultipleFilesSelect}
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt,.html,.css,.scss,.sql,.md,.json,.xml,.yaml,.yml"
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  onChange={handleFolderSelect}
                  className="hidden"
                  {...({ webkitdirectory: "", directory: "" } as any)}
                />

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files ({uploadedFiles.length})</Label>
                    <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileCode className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                                {file.path !== file.name && ` • ${file.path}`}
                              </p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeUploadedFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadedFiles.length === 0 && !uploading && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Upload multiple code files or an entire folder</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !title.trim() || !language}>
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
