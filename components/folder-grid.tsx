"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, Trash2, Edit, Star } from "lucide-react"
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
  is_favorite?: boolean
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
  const [localFolders, setLocalFolders] = useState(folders)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const toggleFavorite = async (folderId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from("folders")
        .update({ is_favorite: !currentFavorite })
        .eq("id", folderId)
        .eq("user_id", userId)

      if (error) throw error

      // Update local state
      setLocalFolders((prev) =>
        prev.map((folder) => (folder.id === folderId ? { ...folder, is_favorite: !currentFavorite } : folder)),
      )

      toast({
        title: !currentFavorite ? "Added to favorites" : "Removed from favorites",
        description: !currentFavorite
          ? "Folder has been added to your favorites."
          : "Folder has been removed from your favorites.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  }

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
        {localFolders.map((folder) => (
          <Card key={folder.id} className="relative hover:shadow-md transition-all group">
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500/10"
                onClick={() => toggleFavorite(folder.id, folder.is_favorite || false)}
              >
                <Star
                  className={`h-4 w-4 ${
                    folder.is_favorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setFolderToDelete(folder.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 pr-20">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
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

              <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                <Link href={`/dashboard/folders/${folder.id}/edit`} className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto bg-transparent"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/dashboard/folders/${folder.id}`} className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto bg-transparent"
                  >
                    <Folder className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {localFolders.length === 0 && (
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
