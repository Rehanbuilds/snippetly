import { createClient } from "@/lib/supabase/server"
import { canUserCreateSnippet } from "@/lib/supabase/plans"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user can create more snippets
    const canCreate = await canUserCreateSnippet(user.id)
    if (!canCreate) {
      return NextResponse.json(
        {
          error: "Snippet limit reached. Please upgrade to Pro for unlimited snippets.",
          code: "LIMIT_REACHED",
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { title, description, code, language, tags, files, is_public = false } = body

    if (!code && (!files || files.length === 0)) {
      return NextResponse.json({ error: "Please provide either code or upload files" }, { status: 400 })
    }

    // Create the snippet
    const { data, error } = await supabase
      .from("snippets")
      .insert({
        title,
        description,
        code: code || null, // Allow null code when files are provided
        language,
        tags: tags || [],
        files: files || null,
        is_public,
        user_id: user.id,
        is_favorite: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating snippet:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
