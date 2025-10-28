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

  console.log("[v0] Public snippet page - fetching publicId:", publicId)

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
    .single()

  console.log("[v0] Public snippet page - query result:", {
    found: !!snippet,
    error: error?.message,
    publicId,
    snippetId: snippet?.id,
  })

  if (error || !snippet) {
    console.error("[v0] Public snippet page - snippet not found:", error)
    notFound()
  }

  return <PublicSnippetView snippet={snippet} />
}
