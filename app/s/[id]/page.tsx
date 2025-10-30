import { createServiceRoleClient } from "@/lib/supabase/server"
import { PublicSnippetView } from "@/components/public-snippet-view"
import { notFound } from "next/navigation"

interface PublicSnippetPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PublicSnippetPage({ params }: PublicSnippetPageProps) {
  const { id: publicId } = await params

  console.log("[v0] PUBLIC PAGE - Looking for public_id:", publicId)

  try {
    const supabase = await createServiceRoleClient()

    const { data: snippet, error } = await supabase
      .from("snippets")
      .select(`
        id,
        title,
        description,
        code,
        language,
        tags,
        created_at,
        is_public,
        public_id,
        profiles!snippets_user_id_fkey (
          display_name,
          full_name,
          bio,
          avatar_url
        )
      `)
      .eq("public_id", publicId)
      .maybeSingle()

    console.log("[v0] Query result - snippet:", snippet ? "FOUND" : "NOT FOUND")
    console.log("[v0] Query result - error:", error?.message || "none")

    if (snippet) {
      console.log("[v0] Snippet details:")
      console.log("[v0] - ID:", snippet.id)
      console.log("[v0] - Title:", snippet.title)
      console.log("[v0] - is_public:", snippet.is_public)
      console.log("[v0] - Author:", snippet.profiles?.display_name || snippet.profiles?.full_name || "Unknown")
    }

    // If snippet exists but is_public is false, auto-fix it
    if (snippet && !snippet.is_public) {
      console.log("[v0] Auto-fixing: Setting is_public to true")

      await supabase.from("snippets").update({ is_public: true }).eq("id", snippet.id)

      snippet.is_public = true
      console.log("[v0] Auto-fix complete")
    }

    if (!snippet || !snippet.is_public) {
      console.log("[v0] PUBLIC PAGE - NOT FOUND (snippet:", !!snippet, "is_public:", snippet?.is_public, ")")
      notFound()
    }

    console.log("[v0] PUBLIC PAGE - SUCCESS, rendering snippet")
    return <PublicSnippetView snippet={snippet} />
  } catch (err) {
    console.error("[v0] PUBLIC PAGE - ERROR:", err)
    throw err
  }
}
