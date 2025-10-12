import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EditFolderForm } from "@/components/edit-folder-form"

export default async function EditFolderPage({ params }: { params: { id: string } }) {
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
    .select("id, title, language, folder_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Folder</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Update folder details and manage snippets</p>
          </div>

          <EditFolderForm folder={folder} snippets={snippets || []} userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
