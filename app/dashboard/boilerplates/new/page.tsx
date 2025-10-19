import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateBoilerplateForm } from "@/components/create-boilerplate-form"

export default async function NewBoilerplatePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Add New Boilerplate</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Create a reusable code boilerplate</p>
        </div>
        <CreateBoilerplateForm userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
