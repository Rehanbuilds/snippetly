import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
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

  const { data: snippets } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", user.id)
    .eq("folder_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/folders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Folders
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: folder.color || "#3b82f6" }} />
            {folder.name}
          </h1>
          {folder.description && <p className="text-muted-foreground mt-2">{folder.description}</p>}
        </div>
        <Link href={`/dashboard/folders/${params.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Folder
          </Button>
        </Link>
      </div>

      <SnippetGrid snippets={snippets || []} />
    </div>
  )
}
