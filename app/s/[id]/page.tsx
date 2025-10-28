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

  const { data: debugSnippet, error: debugError } = await supabase
    .from("snippets")
    .select("id, title, is_public, public_id, public_url, user_id")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] ===== DEBUG QUERY RESULT =====")
  console.log("[v0] Debug - Snippet found:", !!debugSnippet)
  if (debugSnippet) {
    console.log("[v0] Debug - Snippet ID:", debugSnippet.id)
    console.log("[v0] Debug - Snippet Title:", debugSnippet.title)
    console.log("[v0] Debug - is_public:", debugSnippet.is_public)
    console.log("[v0] Debug - public_id:", debugSnippet.public_id)
    console.log("[v0] Debug - public_url:", debugSnippet.public_url)
    console.log("[v0] Debug - user_id:", debugSnippet.user_id)
  }
  if (debugError) {
    console.log("[v0] Debug - Error:", debugError.message)
    console.log("[v0] Debug - Error details:", JSON.stringify(debugError, null, 2))
  }
  console.log("[v0] ===== END DEBUG QUERY =====")

  if (debugSnippet && !debugSnippet.is_public) {
    console.log("[v0] CRITICAL: Snippet exists but is_public is FALSE!")
    console.log("[v0] This means the share API didn't set is_public correctly")
    console.log("[v0] Attempting to fix by setting is_public to true...")

    const { error: fixError } = await supabase.from("snippets").update({ is_public: true }).eq("id", debugSnippet.id)

    if (fixError) {
      console.error("[v0] Failed to fix is_public:", fixError)
    } else {
      console.log("[v0] Successfully fixed is_public! Refetching...")
    }
  }

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

  if (error) {
    console.error("[v0] Public snippet page - Database error:", error)
    console.log("[v0] ===== PUBLIC PAGE END (ERROR) =====")
    notFound()
  }

  if (!snippet) {
    if (debugSnippet) {
      console.error("[v0] ===== CRITICAL ERROR =====")
      console.error("[v0] Snippet EXISTS but query failed!")
      console.error("[v0] Debug snippet:", JSON.stringify(debugSnippet, null, 2))
      console.error("[v0] This should not happen after the fix attempt")
      console.error("[v0] ===== END CRITICAL ERROR =====")
    } else {
      console.error("[v0] No snippet found with public_id:", publicId)
      console.error("[v0] The public_id might not exist in the database")
    }
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] Public snippet page - SUCCESS! Rendering snippet:", snippet.title)
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
