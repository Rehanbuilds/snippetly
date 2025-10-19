"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Upload, X, File } from "lucide-react"

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
  "Tailwind CSS",
  "Bootstrap",
  "Django",
  "Flask",
  "Laravel",
  "Docker",
  "Markdown",
  "Next.js",
  "Node.js",
  "Express.js",
  "Vue.js",
  "Angular",
  "React Native",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Other",
]

interface Boilerplate {
  id: string
  title: string
  description: string | null
  code: string | null
  language: string
  tags: string[] | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
}

interface EditBoilerplateFormProps {
  boilerplate: Boilerplate
}

export function EditBoilerplateForm({ boilerplate }: EditBoilerplateFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [inputMode, setInputMode] = useState<"code" | "file">(boilerplate.file_url ? "file" : "code")

  const [formData, setFormData] = useState({
    title: boilerplate.title,
    description: boilerplate.description || "",
    code: boilerplate.code || "",
    language: boilerplate.language,
    tags: boilerplate.tags?.join(", ") || "",
  })

  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    name: string
    size: number
    type: string
  } | null>(
    boilerplate.file_url
      ? {
          url: boilerplate.file_url,
          name: boilerplate.file_name || "",
          size: boilerplate.file_size || 0,
          type: boilerplate.file_type || "",
        }
      : null,
  )

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/boilerplates/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadedFile({
        url: data.url,
        name: file.name,
        size: file.size,
        type: file.type,
      })

      // Read file content for preview
      const text = await file.text()
      setFormData((prev) => ({ ...prev, code: text }))

      toast.success("File uploaded successfully!")
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const updateData: any = {
        title: formData.title,
        description: formData.description || null,
        code: formData.code,
        language: formData.language,
        tags: tagsArray,
      }

      if (inputMode === "file" && uploadedFile) {
        updateData.file_url = uploadedFile.url
        updateData.file_name = uploadedFile.name
        updateData.file_size = uploadedFile.size
        updateData.file_type = uploadedFile.type
      } else {
        updateData.file_url = null
        updateData.file_name = null
        updateData.file_size = null
        updateData.file_type = null
      }

      const { error } = await supabase.from("boilerplates").update(updateData).eq("id", boilerplate.id)

      if (error) throw error

      toast.success("Boilerplate updated successfully!")
      router.push("/dashboard/boilerplates")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating boilerplate:", error)
      toast.error("Failed to update boilerplate")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Boilerplate</CardTitle>
        <CardDescription>Update your boilerplate code template</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., React Component Template"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your boilerplate..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input Method</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputMode === "code" ? "default" : "outline"}
                onClick={() => setInputMode("code")}
                className="flex-1"
              >
                Type Code
              </Button>
              <Button
                type="button"
                variant={inputMode === "file" ? "default" : "outline"}
                onClick={() => setInputMode("file")}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          {inputMode === "code" ? (
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Textarea
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Paste your boilerplate code here..."
                rows={15}
                className="font-mono text-sm"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Upload File</Label>
              {uploadedFile ? (
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null)
                        setFormData({ ...formData, code: "" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop a file here, or click to browse</p>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    disabled={isUploading}
                    className="max-w-xs mx-auto"
                  />
                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., react, component, template (comma-separated)"
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Boilerplate
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
