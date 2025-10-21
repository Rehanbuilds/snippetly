import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditBoilerplateForm } from "@/components/edit-boilerplate-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function EditBoilerplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const { data: boilerplate, error } = await supabase
    .from("boilerplates")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !boilerplate) {
    redirect("/dashboard/boilerplates")
  }

  return (
    <DashboardLayout user={user}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <EditBoilerplateForm boilerplate={boilerplate} />
      </div>
    </DashboardLayout>
  )
}
