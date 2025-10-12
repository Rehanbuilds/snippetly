"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { UpgradeModal } from "@/components/upgrade-modal"

interface Snippet {
  id: string
  title: string
  language: string
  folder_id: string | null
}

interface CreateFolderFormProps {
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

export function CreateFolderForm({ snippets, userId }: CreateFolderFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0])
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userPlan, setUserPlan] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const FREE_SNIPPETS_PER_FOLDER = 10

  useEffect(() => {
    const loadPlan = async () => {
      const { data } = await supabase.from("profiles").select("plan_type").eq("id", userId).single()

      setUserPlan(data)
    }
    loadPlan()
  }, [userId])

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

    if (userPlan?.plan_type === "free" && selectedSnippets.length > FREE_SNIPPETS_PER_FOLDER) {
      toast({
        title: "Limit Reached",
        description: `Free plan allows up to ${FREE_SNIPPETS_PER_FOLDER} snippets per folder. Upgrade to Pro for unlimited snippets.`,
        variant: "destructive",
      })
      setShowUpgradeModal(true)
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Creating folder with name:", name)
      console.log("[v0] Selected snippets to add:", selectedSnippets)

      const { data: folder, error: folderError } = await supabase
        .from("folders")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          color: selectedColor,
          user_id: userId,
        })
        .select()
        .single()

      if (folderError) throw folderError

      console.log("[v0] Folder created with ID:", folder.id)

      if (selectedSnippets.length > 0) {
        console.log("[v0] Updating", selectedSnippets.length, "snippets with folder_id:", folder.id)

        const { data: updatedSnippets, error: updateError } = await supabase
          .from("snippets")
          .update({ folder_id: folder.id })
          .in("id", selectedSnippets)
          .eq("user_id", userId)
          .select()

        if (updateError) {
          console.error("[v0] Error updating snippets:", updateError)
          throw updateError
        }

        console.log("[v0] Successfully updated", updatedSnippets?.length || 0, "snippets")
        console.log(
          "[v0] Updated snippet IDs:",
          updatedSnippets?.map((s) => s.id),
        )
      }

      toast({
        title: "Folder created",
        description: `Successfully created "${name}" with ${selectedSnippets.length} snippet${selectedSnippets.length !== 1 ? "s" : ""}.`,
      })

      router.push(`/dashboard/folders/${folder.id}`)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating folder:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder. Please try again.",
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

  const availableSnippets = snippets.filter((s) => !s.folder_id)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Folder Details</CardTitle>
            <CardDescription>Enter the name and description for your folder</CardDescription>
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
            <CardTitle>Add Snippets</CardTitle>
            <CardDescription>
              Select snippets to add to this folder ({selectedSnippets.length} selected)
              {userPlan?.plan_type === "free" && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Max {FREE_SNIPPETS_PER_FOLDER} for free plan)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableSnippets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No unorganized snippets available. All your snippets are already in folders.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={snippet.id}
                      checked={selectedSnippets.includes(snippet.id)}
                      onCheckedChange={() => toggleSnippet(snippet.id)}
                      disabled={
                        userPlan?.plan_type === "free" &&
                        selectedSnippets.length >= FREE_SNIPPETS_PER_FOLDER &&
                        !selectedSnippets.includes(snippet.id)
                      }
                    />
                    <label htmlFor={snippet.id} className="flex-1 cursor-pointer flex items-center justify-between">
                      <span className="text-sm font-medium">{snippet.title}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {snippet.language}
                      </span>
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
                Creating...
              </>
            ) : (
              "Create Folder"
            )}
          </Button>
        </div>
      </form>

      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={selectedSnippets.length}
          snippetLimit={FREE_SNIPPETS_PER_FOLDER}
        />
      )}
    </>
  )
}
