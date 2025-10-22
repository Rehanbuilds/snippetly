"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, FileText, Check, Folder } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/upgrade-modal"

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
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      url: string
      name: string
      size: number
      type: string
      path: string
    }>
  >([])
  const [isUploading, setIsUploading] = useState(false)
  const [inputMode, setInputMode] = useState<"code" | "file">("code")
  const router = useRouter()
  const supabase = createClient()

  const [userPlan, setUserPlan] = useState<any>(null)
  const [boilerplateCount, setBoilerplateCount] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

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

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    console.log("[v0] Starting multiple file upload, file count:", files.length)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      console.log("[v0] Sending files to API...")
      const response = await fetch("/api/boilerplates/upload-multiple", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Upload failed:", errorText)
        throw new Error("Upload failed")
      }

      const data = await response.json()
      console.log("[v0] Upload successful, files:", data.files)
      setUploadedFiles(data.files)

      try {
        const fileContents = await Promise.all(
          Array.from(files).map(
            (file) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                  const content = event.target?.result as string
                  resolve(`// File: ${file.name}\n${content}\n\n`)
                }
                reader.onerror = () => {
                  console.warn("[v0] Could not read file:", file.name)
                  resolve(`// File: ${file.name}\n// (Binary or unreadable file)\n\n`)
                }
                reader.readAsText(file)
              }),
          ),
        )
        setCode(fileContents.join(""))
      } catch (readError) {
        console.warn("[v0] Error reading file contents:", readError)
        setCode(`// ${files.length} file(s) uploaded successfully\n// Files are stored and ready to use`)
      }

      toast.success(`${files.length} file(s) uploaded successfully!`)
    } catch (error) {
      console.error("[v0] Multiple file upload error:", error)
      toast.error("Failed to upload files")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    console.log("[v0] Starting folder upload, file count:", files.length)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      console.log("[v0] Sending folder files to API...")
      const response = await fetch("/api/boilerplates/upload-multiple", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Folder upload failed:", errorText)
        throw new Error("Upload failed")
      }

      const data = await response.json()
      console.log("[v0] Folder upload successful, files:", data.files)
      setUploadedFiles(data.files)

      try {
        const fileContents = await Promise.all(
          Array.from(files).map(
            (file) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                  const content = event.target?.result as string
                  const path = (file as any).webkitRelativePath || file.name
                  resolve(`// File: ${path}\n${content}\n\n`)
                }
                reader.onerror = () => {
                  const path = (file as any).webkitRelativePath || file.name
                  console.warn("[v0] Could not read file:", path)
                  resolve(`// File: ${path}\n// (Binary or unreadable file)\n\n`)
                }
                reader.readAsText(file)
              }),
          ),
        )
        setCode(fileContents.join(""))
      } catch (readError) {
        console.warn("[v0] Error reading folder contents:", readError)
        setCode(`// Folder uploaded with ${files.length} file(s)\n// Files are stored and ready to use`)
      }

      toast.success(`Folder uploaded with ${files.length} file(s)!`)
    } catch (error) {
      console.error("[v0] Folder upload error:", error)
      toast.error("Failed to upload folder")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFiles = () => {
    setUploadedFiles([])
    setCode("")
  }

  useEffect(() => {
    const loadUserData = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type, boilerplate_limit")
        .eq("id", userId)
        .single()

      setUserPlan(profile)

      const { count } = await supabase
        .from("boilerplates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      setBoilerplateCount(count || 0)
    }
    loadUserData()
  }, [userId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !code.trim() || selectedLanguages.length === 0) {
      toast.error("Please fill in all required fields and select at least one language")
      return
    }

    if (userPlan?.plan_type === "free" && boilerplateCount >= (userPlan?.boilerplate_limit || 5)) {
      toast.error(
        `You've reached the limit of ${userPlan?.boilerplate_limit || 5} boilerplates. Upgrade to Pro for unlimited boilerplates!`,
      )
      setShowUpgradeModal(true)
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
          files: uploadedFiles.length > 0 ? uploadedFiles : null,
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Boilerplate created successfully!")
      router.push("/dashboard/boilerplates")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating boilerplate:", error)
      toast.error("Failed to create boilerplate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
                  Upload Files
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
                  {uploadedFiles.length === 0 ? (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Input
                          id="multiple-file-upload"
                          type="file"
                          multiple
                          onChange={handleMultipleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Label
                          htmlFor="multiple-file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Upload className="h-8 w-8" />
                          <span className="text-sm font-medium">
                            {isUploading ? "Uploading..." : "Upload Multiple Files"}
                          </span>
                          <span className="text-xs">Select multiple code files</span>
                        </Label>
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Input
                          id="folder-upload"
                          type="file"
                          webkitdirectory=""
                          directory=""
                          onChange={handleFolderUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Label
                          htmlFor="folder-upload"
                          className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Folder className="h-8 w-8" />
                          <span className="text-sm font-medium">
                            {isUploading ? "Uploading..." : "Upload Entire Folder"}
                          </span>
                          <span className="text-xs">Select a folder with your boilerplate files</span>
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{uploadedFiles.length} file(s) uploaded</p>
                        <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFiles}>
                          <X className="h-4 w-4 mr-1" />
                          Remove All
                        </Button>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-background rounded border">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{file.path}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        ))}
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

      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={boilerplateCount}
          snippetLimit={userPlan?.boilerplate_limit || 5}
        />
      )}
    </>
  )
}
