"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Share2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ShareSnippetDialogProps {
  snippetId: string
  isOpen: boolean
  onClose: () => void
}

export function ShareSnippetDialog({ snippetId, isOpen, onClose }: ShareSnippetDialogProps) {
  const [publicUrl, setPublicUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (isOpen && !publicUrl && !loading) {
      generatePublicLink()
    }
  }, [isOpen])

  const generatePublicLink = async () => {
    setLoading(true)
    console.log("[v0] ShareDialog - Generating public link for snippet:", snippetId)

    try {
      const response = await fetch(`/api/snippets/${snippetId}/share`, {
        method: "POST",
      })

      console.log("[v0] ShareDialog - Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] ShareDialog - Error response:", errorData)
        throw new Error(errorData.error || "Failed to generate public link")
      }

      const data = await response.json()
      console.log("[v0] ShareDialog - Success data:", data)

      setPublicUrl(data.public_url)
      setIsPublic(data.is_public)

      toast({
        title: "Public link ready",
        description: "Your snippet is now publicly accessible.",
      })
    } catch (error) {
      console.error("[v0] ShareDialog - Error generating public link:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate public link.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Link copied",
        description: "Public link copied to clipboard.",
      })
    } catch (error) {
      console.error("[v0] ShareDialog - Error copying link:", error)
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      })
    }
  }

  const handleRemovePublicSharing = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}/share`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove public sharing")
      }

      setPublicUrl("")
      setIsPublic(false)
      toast({
        title: "Public sharing removed",
        description: "Your snippet is no longer publicly accessible.",
      })
      onClose()
    } catch (error) {
      console.error("[v0] ShareDialog - Error removing public sharing:", error)
      toast({
        title: "Error",
        description: "Failed to remove public sharing.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    setPublicUrl("")
    setIsPublic(false)
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Snippet Publicly
          </DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view this snippet, even without an account.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Generating public link...</span>
          </div>
        ) : publicUrl ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="public-url">Public Link</Label>
              <div className="flex gap-2">
                <Input id="public-url" value={publicUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} size="icon" variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
              <p>✓ This snippet is now publicly accessible. Anyone with the link can view and copy the code.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Failed to generate link. Please try again.</p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isPublic && publicUrl && (
            <Button variant="outline" onClick={handleRemovePublicSharing} className="w-full sm:w-auto bg-transparent">
              Remove Public Sharing
            </Button>
          )}
          <Button onClick={handleClose} variant="secondary" className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
