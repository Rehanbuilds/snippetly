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

  console.log("[v0] Query result - snippet found:", !!snippet)
  console.log("[v0] Query result - error:", error)

  if (snippet) {
    console.log("[v0] Snippet details:", {
      id: snippet.id,
      title: snippet.title,
      public_id: snippet.public_id,
      is_public: snippet.is_public,
      author: snippet.profiles?.display_name || snippet.profiles?.full_name,
    })
  }

  if (error || !snippet) {
    console.log("[v0] Snippet not found - showing 404")
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] SUCCESS! Rendering snippet")
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
