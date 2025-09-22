import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/signin")
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <h1 className="text-2xl font-bold">Favorite Snippets</h1>
          </div>
          <p className="text-muted-foreground">Your starred code snippets</p>
        </div>
        <SnippetGrid favoritesOnly userId={data.user.id} />
      </div>
    </DashboardLayout>
  )
}
