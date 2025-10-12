"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FolderWithCount {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  snippets: { count: number }[]
}

interface FolderGridProps {
  folders: FolderWithCount[]
  userId: string
}

export function FolderGrid({ folders, userId }: FolderGridProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!folderToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("folders").delete().eq("id", folderToDelete).eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Folder deleted",
        description: "The folder has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setFolderToDelete(null)
    }
  }

  const getSnippetCount = (folder: FolderWithCount) => {
    return folder.snippets?.[0]?.count || 0
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {folders.map((folder) => (
          <Card key={folder.id} className="relative hover:shadow-md transition-all group">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setFolderToDelete(folder.id)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 pr-12">
              {/* Folder icon and info */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: folder.color || "#3b82f6" }}
                >
                  <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{folder.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {getSnippetCount(folder)} snippet{getSnippetCount(folder) !== 1 ? "s" : ""}
                    </p>
                    {folder.description && (
                      <>
                        <span className="text-muted-foreground hidden sm:inline">•</span>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                          {folder.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/folders/${folder.id}`} className="flex-shrink-0">
                <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm bg-transparent">
                  <Folder className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View</span>
                  <span className="sm:hidden">View</span>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium mb-2">No folders yet</h3>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base px-4">
            Create your first folder to organize your snippets
          </p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? Snippets in this folder will not be deleted, but they will be
              unorganized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
