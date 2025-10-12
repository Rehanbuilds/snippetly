"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Snippet {
  id: string
  title: string
  language: string
  folder_id: string | null
}

interface Folder {
  id: string
  name: string
  description: string | null
  color: string
}

interface EditFolderFormProps {
  folder: Folder
  snippets: Snippet[]
  userId: string
}

const FOLDER_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
]

export function EditFolderForm({ folder, snippets, userId }: EditFolderFormProps) {
  const [name, setName] = useState(folder.name)
  const [description, setDescription] = useState(folder.description || "")
  const [selectedColor, setSelectedColor] = useState(folder.color)
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>(
    snippets.filter((s) => s.folder_id === folder.id).map((s) => s.id),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update folder details
      const { error: folderError } = await supabase
        .from("folders")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          color: selectedColor,
        })
        .eq("id", folder.id)
        .eq("user_id", userId)

      if (folderError) throw folderError

      // Get current snippets in this folder
      const currentSnippets = snippets.filter((s) => s.folder_id === folder.id).map((s) => s.id)

      // Snippets to add to folder
      const toAdd = selectedSnippets.filter((id) => !currentSnippets.includes(id))
      // Snippets to remove from folder
      const toRemove = currentSnippets.filter((id) => !selectedSnippets.includes(id))

      // Add snippets to folder
      if (toAdd.length > 0) {
        const { error: addError } = await supabase
          .from("snippets")
          .update({ folder_id: folder.id })
          .in("id", toAdd)
          .eq("user_id", userId)

        if (addError) throw addError
      }

      // Remove snippets from folder
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("snippets")
          .update({ folder_id: null })
          .in("id", toRemove)
          .eq("user_id", userId)

        if (removeError) throw removeError
      }

      toast({
        title: "Folder updated",
        description: `Successfully updated "${name}".`,
      })

      router.push("/dashboard/folders")
      router.refresh()
    } catch (error) {
      console.error("Error updating folder:", error)
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSnippet = (snippetId: string) => {
    setSelectedSnippets((prev) =>
      prev.includes(snippetId) ? prev.filter((id) => id !== snippetId) : [...prev, snippetId],
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Folder Details</CardTitle>
          <CardDescription>Update the name and description for your folder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name *</Label>
            <Input
              id="name"
              placeholder="e.g., React Hooks, API Utilities"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this folder contains..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Folder Color</Label>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-lg transition-all ${
                    selectedColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Snippets</CardTitle>
          <CardDescription>
            Select snippets to include in this folder ({selectedSnippets.length} selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {snippets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No snippets available. Create some snippets first.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {snippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={snippet.id}
                    checked={selectedSnippets.includes(snippet.id)}
                    onCheckedChange={() => toggleSnippet(snippet.id)}
                  />
                  <label htmlFor={snippet.id} className="flex-1 cursor-pointer flex items-center justify-between">
                    <span className="text-sm font-medium">{snippet.title}</span>
                    <div className="flex items-center gap-2">
                      {snippet.folder_id && snippet.folder_id !== folder.id && (
                        <span className="text-xs text-muted-foreground">In another folder</span>
                      )}
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {snippet.language}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href="/dashboard/folders" className="flex-1">
          <Button type="button" variant="outline" className="w-full bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Folder"
          )}
        </Button>
      </div>
    </form>
  )
}
