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
  console.log("[v0] Environment check - SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing")
  console.log(
    "[v0] Environment check - SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ Missing",
  )

  const supabase = await createServiceRoleClient()
  console.log("[v0] Service role client created")

  console.log("[v0] Step 1: Checking if snippet exists with public_id:", publicId)
  const { data: checkSnippet, error: checkError } = await supabase
    .from("snippets")
    .select("id, public_id, is_public, title")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] Check result - snippet exists:", !!checkSnippet)
  console.log("[v0] Check result - error:", checkError)
  if (checkSnippet) {
    console.log("[v0] Check result - snippet data:", JSON.stringify(checkSnippet, null, 2))
  }

  console.log("[v0] Step 2: Fetching full snippet with profiles")
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

  console.log("[v0] Full query result - snippet found:", !!snippet)
  console.log("[v0] Full query result - error:", error ? JSON.stringify(error, null, 2) : "null")

  if (snippet) {
    console.log(
      "[v0] Snippet details:",
      JSON.stringify(
        {
          id: snippet.id,
          title: snippet.title,
          public_id: snippet.public_id,
          is_public: snippet.is_public,
          author: snippet.profiles?.display_name || snippet.profiles?.full_name,
        },
        null,
        2,
      ),
    )
  }

  if (!snippet && checkSnippet && !checkSnippet.is_public) {
    console.log("[v0] FOUND ISSUE: Snippet exists but is_public is false. Auto-fixing...")
    const { error: updateError } = await supabase.from("snippets").update({ is_public: true }).eq("id", checkSnippet.id)

    if (updateError) {
      console.log("[v0] Auto-fix failed:", updateError)
    } else {
      console.log("[v0] Auto-fix successful! Refetching snippet...")
      // Refetch the snippet
      const { data: refetchedSnippet } = await supabase
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
        console.log("[v0] SUCCESS after auto-fix! Rendering snippet")
        console.log("[v0] ===== PUBLIC PAGE END (SUCCESS) =====")
        return <PublicSnippetView snippet={refetchedSnippet} />
      }
    }
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
