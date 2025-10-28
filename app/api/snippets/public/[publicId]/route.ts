import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await params
    console.log("[v0] Public API GET - Fetching snippet with publicId:", publicId)

    const supabase = await createClient()

    // Fetch public snippet with author info
    const { data: snippet, error } = await supabase
      .from("snippets")
      .select(
        `
        id,
        title,
        description,
        code,
        language,
        tags,
        created_at,
        public_id,
        public_url,
        is_public,
        user_id,
        profiles:user_id (
          display_name,
          full_name
        )
      `,
      )
      .eq("public_id", publicId)
      .eq("is_public", true)
      .single()

    console.log("[v0] Public API GET - Query result:", {
      found: !!snippet,
      error: error,
      snippetId: snippet?.id,
      isPublic: snippet?.is_public,
    })

    if (error) {
      console.error("[v0] Public API GET - Database error:", error)
      return NextResponse.json({ error: "Snippet not found or not public" }, { status: 404 })
    }

    if (!snippet) {
      console.error("[v0] Public API GET - No snippet found")
      return NextResponse.json({ error: "Snippet not found or not public" }, { status: 404 })
    }

    console.log("[v0] Public API GET - Successfully returning snippet:", snippet.id)
    return NextResponse.json(snippet)
  } catch (error) {
    console.error("[v0] Public API GET - Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
