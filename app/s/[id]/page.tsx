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

  // First, let's check if ANY snippet with this public_id exists (regardless of is_public)
  const { data: anySnippet, error: anyError } = await supabase
    .from("snippets")
    .select("id, title, is_public, public_id, user_id")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] Public snippet page - ANY snippet check:", {
    found: !!anySnippet,
    snippetId: anySnippet?.id,
    title: anySnippet?.title,
    isPublic: anySnippet?.is_public,
    publicId: anySnippet?.public_id,
    userId: anySnippet?.user_id,
    error: anyError?.message,
  })

  // Now fetch the full snippet with is_public = true
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

  console.log("[v0] Public snippet page - PUBLIC snippet query result:", {
    found: !!snippet,
    error: error?.message,
    publicId,
    snippetId: snippet?.id,
    snippetTitle: snippet?.title,
    isPublic: snippet?.is_public,
    authorName: snippet?.profiles?.display_name || snippet?.profiles?.full_name,
  })

  if (error) {
    console.error("[v0] Public snippet page - Database error:", error)
    console.log("[v0] ===== PUBLIC PAGE END (ERROR) =====")
    notFound()
  }

  if (!snippet) {
    if (anySnippet) {
      console.error("[v0] Public snippet page - Snippet exists but is_public is false!")
      console.error("[v0] Public snippet page - Snippet details:", {
        id: anySnippet.id,
        title: anySnippet.title,
        is_public: anySnippet.is_public,
        public_id: anySnippet.public_id,
      })
    } else {
      console.error("[v0] Public snippet page - No snippet found with public_id:", publicId)
    }
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] Public snippet page - SUCCESS! Rendering snippet:", snippet.title)
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
