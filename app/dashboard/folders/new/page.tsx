import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateFolderForm } from "@/components/create-folder-form"

export default async function NewFolderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  // Fetch all snippets for selection
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Folder</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Organize your snippets by creating a new folder
            </p>
          </div>

          <CreateFolderForm snippets={snippets || []} userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
