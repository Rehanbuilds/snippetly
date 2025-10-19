"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, FileText, Check } from "lucide-react"
import { toast } from "sonner"
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

interface CreateBoilerplateFormProps {
  userId: string
}

export function CreateBoilerplateForm({ userId }: CreateBoilerplateFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    filename: string
    size: number
    type: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [inputMode, setInputMode] = useState<"code" | "file">("code")
  const router = useRouter()
  const supabase = createClient()

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const removeLanguage = (language: string) => {
    setSelectedLanguages((prev) => prev.filter((l) => l !== language))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
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

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadedFile(data)

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCode(content)
      }
      reader.readAsText(file)

      toast.success("File uploaded successfully!")
    } catch (error) {
      console.error("File upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setCode("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !code.trim() || selectedLanguages.length === 0) {
      toast.error("Please fill in all required fields and select at least one language")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("boilerplates")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          code: code.trim(),
          language: selectedLanguages,
          tags,
          user_id: userId,
          file_url: uploadedFile?.url || null,
          file_name: uploadedFile?.filename || null,
          file_size: uploadedFile?.size || null,
          file_type: uploadedFile?.type || null,
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Boilerplate created successfully!")
      router.push("/dashboard/boilerplates")
      router.refresh()
    } catch (error) {
      console.error("Error creating boilerplate:", error)
      toast.error("Failed to create boilerplate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., React Component Template"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this boilerplate is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Languages <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-3">Click on languages to select (multiple allowed)</p>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30 max-h-[300px] overflow-y-auto">
              {languages.map((language) => {
                const isSelected = selectedLanguages.includes(language)
                return (
                  <Badge
                    key={language}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                    onClick={() => toggleLanguage(language)}
                  >
                    {isSelected ? <Check className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                    {language}
                  </Badge>
                )
              })}
            </div>
            {selectedLanguages.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {selectedLanguages.length} language{selectedLanguages.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Code <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={inputMode === "code" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("code")}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Type Code
              </Button>
              <Button
                type="button"
                variant={inputMode === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("file")}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            {inputMode === "code" ? (
              <Textarea
                id="code"
                placeholder="Paste your boilerplate code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                required
              />
            ) : (
              <div className="space-y-3">
                {!uploadedFile ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-xs">Any code file format supported</span>
                    </Label>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{uploadedFile.filename}</p>
                          <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Boilerplate"}
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
