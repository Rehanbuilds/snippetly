import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { FolderGrid } from "@/components/folder-grid"
import { Star, Folder } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/signin")
  }

  const { data: favoriteFolders } = await supabase
    .from("folders")
    .select(
      `
      *,
      snippets:snippets(count)
    `,
    )
    .eq("user_id", data.user.id)
    .eq("is_favorite", true)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <h1 className="text-2xl font-bold">Favorites</h1>
          </div>
          <p className="text-muted-foreground">Your starred snippets and folders</p>
        </div>

        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Snippets
            </TabsTrigger>
            <TabsTrigger value="folders" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="snippets" className="mt-6">
            <SnippetGrid favoritesOnly userId={data.user.id} />
          </TabsContent>

          <TabsContent value="folders" className="mt-6">
            {favoriteFolders && favoriteFolders.length > 0 ? (
              <FolderGrid folders={favoriteFolders} userId={data.user.id} />
            ) : (
              <div className="text-center py-16 sm:py-20">
                <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium mb-2">No favorite folders yet</h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base px-4">
                  Star folders to add them to your favorites
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
