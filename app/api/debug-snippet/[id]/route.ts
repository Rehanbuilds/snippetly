import { createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    const supabase = await createServiceRoleClient()

    // Get snippet by ID
    const { data: snippet, error } = await supabase.from("snippets").select("*").eq("id", snippetId).single()

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      snippet: {
        id: snippet.id,
        title: snippet.title,
        public_id: snippet.public_id,
        public_url: snippet.public_url,
        is_public: snippet.is_public,
        created_at: snippet.created_at,
      },
      message: snippet.is_public
        ? "✅ Snippet is public and should be accessible"
        : "⚠️ Snippet exists but is_public is false",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
