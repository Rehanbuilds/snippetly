import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NewSnippetForm } from "@/components/new-snippet-form"

export const dynamic = "force-dynamic"

export default async function NewSnippetPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/signin")
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Snippet</h1>
          <p className="text-muted-foreground">Save a new code snippet to your collection</p>
        </div>
        <NewSnippetForm />
      </div>
    </DashboardLayout>
  )
}
