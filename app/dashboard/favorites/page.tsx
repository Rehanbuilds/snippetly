import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { Star } from "lucide-react"

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <h1 className="text-2xl font-bold">Favorite Snippets</h1>
          </div>
          <p className="text-muted-foreground">Your starred code snippets</p>
        </div>
        <SnippetGrid favoritesOnly />
      </div>
    </DashboardLayout>
  )
}
