import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditBoilerplateForm } from "@/components/edit-boilerplate-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function EditBoilerplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const resolvedParams = await params
    console.log("[v0] Edit page params:", resolvedParams)

    if (!resolvedParams || !resolvedParams.id) {
      console.error("[v0] Invalid params:", resolvedParams)
      redirect("/dashboard/boilerplates")
    }

    const { id } = resolvedParams

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User:", user?.id)

    if (!user) {
      console.log("[v0] No user found, redirecting to signin")
      redirect("/signin")
    }

    console.log("[v0] Fetching boilerplate with id:", id)

    const { data: boilerplate, error } = await supabase
      .from("boilerplates")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Boilerplate data:", boilerplate)
    console.log("[v0] Boilerplate error:", error)

    if (error) {
      console.error("[v0] Database error:", error)
      redirect("/dashboard/boilerplates")
    }

    if (!boilerplate) {
      console.error("[v0] No boilerplate found")
      redirect("/dashboard/boilerplates")
    }

    const safeBoilerplate = {
      ...boilerplate,
      description: boilerplate.description || null,
      code: boilerplate.code || null,
      language: boilerplate.language || [],
      tags: boilerplate.tags || null,
      file_url: boilerplate.file_url || null,
      file_name: boilerplate.file_name || null,
      file_size: boilerplate.file_size || null,
      file_type: boilerplate.file_type || null,
      files: boilerplate.files || [],
    }

    console.log("[v0] Safe boilerplate:", safeBoilerplate)

    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4 md:px-6">
          <EditBoilerplateForm boilerplate={safeBoilerplate} />
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("[v0] Error in edit page:", error)
    redirect("/dashboard/boilerplates")
  }
}
