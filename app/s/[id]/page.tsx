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

  console.log("[v0] ===== PUBLIC PAGE START =====")
  console.log("[v0] Public snippet page - publicId from URL:", publicId)

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
      profiles (
        display_name,
        full_name,
        bio
      )
    `)
    .eq("public_id", publicId)
    .eq("is_public", true)
    .maybeSingle()

  console.log("[v0] ===== QUERY RESULT =====")
  console.log("[v0] Snippet found:", !!snippet)
  if (snippet) {
    console.log("[v0] Snippet ID:", snippet.id)
    console.log("[v0] Snippet Title:", snippet.title)
    console.log("[v0] Author:", snippet.profiles?.display_name || snippet.profiles?.full_name || "Unknown")
    console.log("[v0] Author Bio:", snippet.profiles?.bio || "No bio")
    console.log("[v0] Is Public:", snippet.is_public)
    console.log("[v0] Public ID:", snippet.public_id)
  }
  if (error) {
    console.log("[v0] Error:", error.message)
    console.log("[v0] Error details:", JSON.stringify(error, null, 2))
  }
  console.log("[v0] ===== END QUERY =====")

  if (error || !snippet) {
    console.log("[v0] Snippet not found - redirecting to 404")
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] SUCCESS! Rendering snippet:", snippet.title)
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
