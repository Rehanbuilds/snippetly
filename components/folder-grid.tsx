"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, Plus, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Create New Folder Card */}
        <Link href="/dashboard/folders/new">
          <Card className="h-full border-dashed border-2 hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-40 sm:h-48 p-6">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Create New Folder</p>
            </CardContent>
          </Card>
        </Link>

        {folders.map((folder) => (
          <Card key={folder.id} className="h-full hover:shadow-lg transition-all hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: folder.color || "#3b82f6" }}
                  >
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{folder.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {getSnippetCount(folder)} snippet{getSnippetCount(folder) !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/folders/${folder.id}`} className="cursor-pointer">
                        <Folder className="h-4 w-4 mr-2" />
                        View Snippets
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/folders/${folder.id}/edit`} className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Add More Snippets
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => {
                        setFolderToDelete(folder.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {folder.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{folder.description}</p>
              )}
              <Link href={`/dashboard/folders/${folder.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Folder className="h-4 w-4 mr-2" />
                  View Snippets
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium mb-2">No folders yet</h3>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Create your first folder to organize your snippets
          </p>
          <Link href="/dashboard/folders/new">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </Link>
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
