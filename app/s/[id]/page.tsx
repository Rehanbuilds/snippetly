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
  console.log("[v0] Looking for snippet with public_id:", publicId)

  const supabase = await createServiceRoleClient()

  const { data: anySnippet, error: anyError } = await supabase
    .from("snippets")
    .select("id, public_id, is_public, title")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] Step 1 - Check if snippet exists (any is_public value):")
  console.log("[v0] - Found:", !!anySnippet)
  console.log("[v0] - Error:", anyError?.message || "none")

  if (anySnippet) {
    console.log("[v0] - Snippet ID:", anySnippet.id)
    console.log("[v0] - Title:", anySnippet.title)
    console.log("[v0] - public_id:", anySnippet.public_id)
    console.log("[v0] - is_public:", anySnippet.is_public)

    if (!anySnippet.is_public) {
      console.log("[v0] Step 2 - Snippet found but is_public = false, fixing...")

      const { error: fixError } = await supabase.from("snippets").update({ is_public: true }).eq("id", anySnippet.id)

      if (fixError) {
        console.log("[v0] - Fix FAILED:", fixError.message)
      } else {
        console.log("[v0] - Fix SUCCESS: is_public set to true")

        // Verify the fix
        const { data: verifySnippet } = await supabase
          .from("snippets")
          .select("is_public")
          .eq("id", anySnippet.id)
          .single()

        console.log("[v0] - Verification: is_public is now", verifySnippet?.is_public)
      }
    }
  } else {
    console.log("[v0] Step 1 - NO SNIPPET FOUND with public_id:", publicId)
  }

  console.log("[v0] Step 3 - Fetching full snippet data with profiles")
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
        bio,
        avatar_url
      )
    `)
    .eq("public_id", publicId)
    .eq("is_public", true)
    .maybeSingle()

  console.log("[v0] Step 3 - Result:")
  console.log("[v0] - Found:", !!snippet)
  console.log("[v0] - Error:", error?.message || "none")

  if (!snippet) {
    console.log("[v0] ===== PUBLIC PAGE END (NOT FOUND) =====")
    notFound()
  }

  console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")
  console.log("[v0] Rendering snippet:", snippet.title)

  return <PublicSnippetView snippet={snippet} />
}
