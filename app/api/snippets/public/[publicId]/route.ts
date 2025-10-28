import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await params
    console.log("[v0] Public API - fetching publicId:", publicId)

    const supabase = await createClient()

    // Fetch public snippet with author info
    const { data: snippet, error } = await supabase
      .from("snippets")
      .select(
        `
        *,
        profiles:user_id (
          display_name,
          full_name
        )
      `,
      )
      .eq("public_id", publicId)
      .eq("is_public", true)
      .single()

    console.log("[v0] Public API - snippet found:", !!snippet, "error:", error)

    if (error || !snippet) {
      console.error("[v0] Public API - error details:", error)
      return NextResponse.json({ error: "Snippet not found or not public" }, { status: 404 })
    }

    console.log("[v0] Public API - returning snippet:", snippet.id)
    return NextResponse.json(snippet)
  } catch (error) {
    console.error("[v0] Error fetching public snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
