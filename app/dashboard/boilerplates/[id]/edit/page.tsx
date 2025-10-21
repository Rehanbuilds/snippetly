import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditBoilerplateForm } from "@/components/edit-boilerplate-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function EditBoilerplatePage({ params }: { params: { id: string } }) {
  console.log("[v0] Edit page - params.id:", params.id)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("[v0] Edit page - No user found, redirecting to signin")
    redirect("/signin")
  }

  console.log("[v0] Edit page - Fetching boilerplate for user:", user.id)

  const { data: boilerplate, error } = await supabase
    .from("boilerplates")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[v0] Edit page - Error fetching boilerplate:", error)
    redirect("/dashboard/boilerplates")
  }

  if (!boilerplate) {
    console.log("[v0] Edit page - Boilerplate not found")
    redirect("/dashboard/boilerplates")
  }

  console.log("[v0] Edit page - Boilerplate found:", boilerplate.id, boilerplate.title)

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <EditBoilerplateForm boilerplate={boilerplate} />
      </div>
    </DashboardLayout>
  )
}
