import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { publicId: string } }) {
  try {
    const supabase = await createClient()
    const publicId = params.publicId

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

    if (error || !snippet) {
      return NextResponse.json({ error: "Snippet not found or not public" }, { status: 404 })
    }

    return NextResponse.json(snippet)
  } catch (error) {
    console.error("[v0] Error fetching public snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
