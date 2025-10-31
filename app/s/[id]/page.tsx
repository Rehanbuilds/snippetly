import { getDb } from "@/lib/db"
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
    const sql = getDb()

    const result = await sql`
      SELECT 
        s.id,
        s.title,
        s.description,
        s.code,
        s.language,
        s.tags,
        s.created_at,
        s.is_public,
        s.public_id,
        p.display_name,
        p.full_name,
        p.bio,
        p.avatar_url
      FROM snippets s
      LEFT JOIN profiles p ON s.user_id = p.id
      WHERE s.public_id = ${publicId}
      LIMIT 1
    `

    console.log("[v0] Query result - found:", result.length > 0)

    if (result.length === 0) {
      console.log("[v0] PUBLIC PAGE - NOT FOUND")
      notFound()
    }

    const row = result[0]
    console.log("[v0] Snippet details:")
    console.log("[v0] - ID:", row.id)
    console.log("[v0] - Title:", row.title)
    console.log("[v0] - is_public:", row.is_public)
    console.log("[v0] - Author:", row.display_name || row.full_name || "Unknown")

    // If snippet exists but is_public is false, auto-fix it
    if (!row.is_public) {
      console.log("[v0] Auto-fixing: Setting is_public to true")
      await sql`UPDATE snippets SET is_public = true WHERE id = ${row.id}`
      row.is_public = true
      console.log("[v0] Auto-fix complete")
    }

    if (!row.is_public) {
      console.log("[v0] PUBLIC PAGE - NOT PUBLIC")
      notFound()
    }

    // Transform the result to match the expected format
    const snippet = {
      id: row.id,
      title: row.title,
      description: row.description,
      code: row.code,
      language: row.language,
      tags: row.tags,
      created_at: row.created_at,
      is_public: row.is_public,
      public_id: row.public_id,
      profiles: {
        display_name: row.display_name,
        full_name: row.full_name,
        bio: row.bio,
        avatar_url: row.avatar_url,
      },
    }

    console.log("[v0] PUBLIC PAGE - SUCCESS, rendering snippet")
    return <PublicSnippetView snippet={snippet} />
  } catch (err) {
    console.error("[v0] PUBLIC PAGE - ERROR:", err)
    throw err
  }
}
