import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Debug endpoint to check snippet status
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if it's a UUID (snippet ID) or a public_id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let query = supabase.from("snippets").select("id, title, user_id, is_public, public_id, public_url, created_at")

    if (isUUID) {
      query = query.eq("id", id)
    } else {
      query = query.eq("public_id", id)
    }

    const { data, error } = await query.maybeSingle()

    return NextResponse.json({
      found: !!data,
      isUUID,
      searchedFor: id,
      snippet: data,
      error: error?.message,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
