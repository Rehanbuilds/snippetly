import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { BoilerplateGrid } from "@/components/boilerplate-grid"

export default async function BoilerplatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const { data: boilerplates } = await supabase
    .from("boilerplates")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Boilerplates</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Save and organize your code boilerplates</p>
          </div>
          <Link href="/dashboard/boilerplates/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Boilerplate
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search boilerplates by title..." className="pl-10" />
        </div>

        <BoilerplateGrid boilerplates={boilerplates || []} />
      </div>
    </DashboardLayout>
  )
}
