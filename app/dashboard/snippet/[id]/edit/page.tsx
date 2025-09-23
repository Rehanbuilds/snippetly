import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EditSnippetForm } from "@/components/edit-snippet-form"

export const dynamic = "force-dynamic"

interface EditSnippetPageProps {
  params: {
    id: string
  }
}

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/signin")
  }

  // Fetch the snippet to edit
  const { data: snippet, error: snippetError } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (snippetError || !snippet) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Snippet</h1>
          <p className="text-muted-foreground">Update your code snippet</p>
        </div>
        <EditSnippetForm snippet={snippet} />
      </div>
    </DashboardLayout>
  )
}
