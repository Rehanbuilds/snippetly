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
  console.log("[v0] Public snippet page - publicId type:", typeof publicId)
  console.log("[v0] Public snippet page - publicId length:", publicId?.length)

  const supabase = await createServiceRoleClient()

  const { data: anySnippet, error: anyError } = await supabase
    .from("snippets")
    .select("id, title, public_id, is_public")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] ===== DEBUG: CHECK ANY SNIPPET =====")
  console.log("[v0] Any snippet with this public_id:", !!anySnippet)
  if (anySnippet) {
    console.log("[v0] Found snippet ID:", anySnippet.id)
    console.log("[v0] Found snippet title:", anySnippet.title)
    console.log("[v0] Found snippet public_id:", anySnippet.public_id)
    console.log("[v0] Found snippet is_public:", anySnippet.is_public)
    console.log("[v0] ⚠️ ISSUE: Snippet exists but is_public =", anySnippet.is_public)
  } else {
    console.log("[v0] ❌ NO SNIPPET FOUND with public_id:", publicId)
    console.log("[v0] This means the share API did not save the data correctly")
  }
  if (anyError) {
    console.log("[v0] Error checking any snippet:", anyError)
  }
  console.log("[v0] ===== END DEBUG =====")

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
  console.log("[v0] Public snippet found:", !!snippet)
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

  if (!snippet && anySnippet && !anySnippet.is_public) {
    console.log("[v0] ⚠️ AUTO-FIX: Setting is_public to true for snippet:", anySnippet.id)
    const { error: fixError } = await supabase.from("snippets").update({ is_public: true }).eq("id", anySnippet.id)

    if (fixError) {
      console.log("[v0] ❌ Failed to auto-fix:", fixError)
    } else {
      console.log("[v0] ✅ Auto-fix successful! Refetching snippet...")

      // Refetch the snippet
      const { data: refetchedSnippet, error: refetchError } = await supabase
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

      if (refetchedSnippet) {
        console.log("[v0] ✅ Refetch successful! Rendering snippet")
        console.log("[v0] ===== PUBLIC PAGE END (AUTO-FIXED) =====")
        return <PublicSnippetView snippet={refetchedSnippet} />
      } else {
        console.log("[v0] ❌ Refetch failed:", refetchError)
      }
    }
  }

  if (error || !snippet) {
    console.log("[v0] Snippet not found - redirecting to 404")
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] SUCCESS! Rendering snippet:", snippet.title)
  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")

  return <PublicSnippetView snippet={snippet} />
}
