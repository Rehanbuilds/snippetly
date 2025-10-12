import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FolderGrid } from "@/components/folder-grid"

export default async function FoldersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const { data: folders } = await supabase
    .from("folders")
    .select("*, snippets:snippets(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folders</h1>
          <p className="text-muted-foreground mt-2">Organize your snippets into folders</p>
        </div>
      </div>

      <FolderGrid folders={folders || []} userId={user.id} />
    </div>
  )
}
