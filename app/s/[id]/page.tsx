import { createClient } from "@/lib/supabase/server"
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
  console.log("[v0] Public snippet page - publicId length:", publicId.length)
  console.log("[v0] Public snippet page - publicId type:", typeof publicId)

  const supabase = await createClient()

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
        full_name
      )
    `)
    .eq("public_id", publicId)
    .eq("is_public", true)
    .maybeSingle()

  console.log("[v0] ===== MAIN QUERY RESULT =====")
  console.log("[v0] Main - Snippet found:", !!snippet)
  if (snippet) {
    console.log("[v0] Main - Snippet ID:", snippet.id)
    console.log("[v0] Main - Snippet Title:", snippet.title)
    console.log("[v0] Main - Author:", snippet.profiles?.display_name || snippet.profiles?.full_name || "Unknown")
  }
  if (error) {
    console.log("[v0] Main - Error:", error.message)
    console.log("[v0] Main - Error details:", JSON.stringify(error, null, 2))
  }
  console.log("[v0] ===== END MAIN QUERY =====")

  if (error || !snippet) {
    notFound()
  }

  console.log("[v0] Public snippet page - SUCCESS! Rendering snippet:", snippet.title)
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
