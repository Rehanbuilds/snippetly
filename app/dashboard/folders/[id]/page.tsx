import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default async function FolderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const { data: folder } = await supabase
    .from("folders")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!folder) {
    notFound()
  }

  const { data: snippets, error: snippetsError } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", user.id)
    .eq("folder_id", params.id)
    .order("created_at", { ascending: false })

  console.log("[v0] Folder ID:", params.id)
  console.log("[v0] User ID:", user.id)
  console.log("[v0] Snippets query error:", snippetsError)
  console.log("[v0] Snippets found:", snippets?.length || 0)
  if (snippets && snippets.length > 0) {
    console.log("[v0] First snippet folder_id:", snippets[0].folder_id)
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="/dashboard/folders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Folders
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: folder.color || "#3b82f6" }} />
              {folder.name}
            </h1>
            {folder.description && (
              <p className="text-sm sm:text-base text-muted-foreground mt-2">{folder.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {snippets?.length || 0} snippet{snippets?.length !== 1 ? "s" : ""} in this folder
            </p>
          </div>
          <Link href={`/dashboard/folders/${params.id}/edit`}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit Folder
            </Button>
          </Link>
        </div>

        {!snippets || snippets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No snippets in this folder yet.</p>
            <Link href={`/dashboard/folders/${params.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Add Snippets to Folder
              </Button>
            </Link>
          </div>
        ) : (
          <SnippetGrid snippets={snippets} />
        )}
      </div>
    </DashboardLayout>
  )
}
