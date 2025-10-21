"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, X, File, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface EditBoilerplateFormProps {
  boilerplate: {
    id: string
    title: string
    description?: string | null
    code?: string | null
    language?: string | string[] | null
    tags?: string[] | null
    file_url?: string | null
    file_name?: string | null
    file_size?: number | null
    file_type?: string | null
    files?: any[] | null
  }
}

export function EditBoilerplateForm({ boilerplate }: EditBoilerplateFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const hasFile = boilerplate?.file_url || (boilerplate?.files && boilerplate.files.length > 0)
  const [inputMode, setInputMode] = useState<"code" | "file">(hasFile ? "file" : "code")

  const getInitialLanguages = () => {
    if (!boilerplate?.language) return []
    if (Array.isArray(boilerplate.language)) return boilerplate.language
    if (typeof boilerplate.language === "string") return [boilerplate.language]
    return []
  }

  const [formData, setFormData] = useState({
    title: boilerplate?.title || "",
    description: boilerplate?.description || "",
    code: boilerplate?.code || "",
    selectedLanguages: getInitialLanguages(),
    tags: boilerplate?.tags?.join(", ") || "",
  })

  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    name: string
    size: number
    type: string
  } | null>(
    boilerplate?.file_url
      ? {
          url: boilerplate.file_url,
          name: boilerplate.file_name || "Uploaded file",
          size: boilerplate.file_size || 0,
          type: boilerplate.file_type || "",
        }
      : null,
  )

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      url: string
      name: string
      size: number
      type: string
      path?: string
    }>
  >(boilerplate?.files || [])

  const toggleLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(language)
        ? prev.selectedLanguages.filter((l) => l !== language)
        : [...prev.selectedLanguages, language],
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/boilerplates/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setUploadedFile({
        url: data.url,
        name: file.name,
        size: file.size,
        type: file.type,
      })
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/boilerplates/upload-multiple", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setUploadedFiles(data.files)
      toast.success(`${data.files.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload files")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!boilerplate?.id) {
      toast.error("Invalid boilerplate ID")
      return
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (formData.selectedLanguages.length === 0) {
      toast.error("Please select at least one language")
      return
    }

    if (inputMode === "code" && !formData.code.trim()) {
      toast.error("Please enter code or switch to file upload mode")
      return
    }

    if (inputMode === "file" && uploadedFiles.length === 0 && !uploadedFile) {
      toast.error("Please upload at least one file or switch to code input mode")
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const updateData: any = {
        title: formData.title,
        description: formData.description || null,
        language: formData.selectedLanguages,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_at: new Date().toISOString(),
      }

      if (inputMode === "code") {
        updateData.code = formData.code
        updateData.file_url = null
        updateData.file_name = null
        updateData.file_size = null
        updateData.file_type = null
        updateData.files = null
      } else {
        updateData.code = null
        if (uploadedFiles.length > 0) {
          updateData.files = uploadedFiles
          updateData.file_url = null
          updateData.file_name = null
          updateData.file_size = null
          updateData.file_type = null
        } else if (uploadedFile) {
          updateData.file_url = uploadedFile.url
          updateData.file_name = uploadedFile.name
          updateData.file_size = uploadedFile.size
          updateData.file_type = uploadedFile.type
          updateData.files = null
        }
      }

      const { error } = await supabase.from("boilerplates").update(updateData).eq("id", boilerplate.id)

      if (error) throw error

      toast.success("Boilerplate updated successfully!")
      router.push("/dashboard/boilerplates")
      router.refresh()
    } catch (error) {
      console.error("Error updating boilerplate:", error)
      toast.error("Failed to update boilerplate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Boilerplate</CardTitle>
        <CardDescription>Update your boilerplate code template</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Description */}
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

          {/* Languages */}
          <div className="space-y-2">
            <Label>Languages * (Select one or more)</Label>
            <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/50 max-h-[300px] overflow-y-auto">
              {languages.map((language) => {
                const isSelected = formData.selectedLanguages.includes(language)
                return (
                  <Badge
                    key={language}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      isSelected && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => toggleLanguage(language)}
                  >
                    {isSelected ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                    {language}
                  </Badge>
                )
              })}
            </div>
            {formData.selectedLanguages.length > 0 && (
              <p className="text-sm text-muted-foreground">Selected: {formData.selectedLanguages.join(", ")}</p>
            )}
          </div>

          {/* Input Mode Toggle */}
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
                Upload Files
              </Button>
            </div>
          </div>

          {/* Code Input */}
          {inputMode === "code" && (
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Textarea
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Paste your boilerplate code here..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          )}

          {/* File Upload */}
          {inputMode === "file" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Files</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input type="file" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      multiple
                      onChange={handleMultipleFilesUpload}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a single file or multiple files for your boilerplate
                </p>
              </div>

              {/* Single File Display */}
              {uploadedFile && uploadedFiles.length === 0 && (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                  <File className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setUploadedFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Multiple Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        <File className="w-4 h-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.path || file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., react, component, ui (comma-separated)"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Boilerplate"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/boilerplates")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
