import { createClient } from "@/lib/supabase/server"
import { getDb } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] ===== SHARE API START =====")
    console.log("[v0] Snippet ID:", snippetId)

    const supabase = await createClient()
    const sql = getDb()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Auth failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id)

    const snippetResult = await sql`
      SELECT id, user_id, public_id, public_url, is_public
      FROM snippets
      WHERE id = ${snippetId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (snippetResult.length === 0) {
      console.log("[v0] Snippet not found or not owned by user")
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    const snippet = snippetResult[0]
    console.log("[v0] Snippet found - current state:")
    console.log("[v0] - public_id:", snippet.public_id)
    console.log("[v0] - is_public:", snippet.is_public)

    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Reusing existing public link:", snippet.public_url)

      await sql`
        UPDATE snippets 
        SET is_public = true 
        WHERE id = ${snippetId}
      `

      console.log("[v0] Successfully set is_public to true")

      const verifyResult = await sql`
        SELECT is_public, public_id 
        FROM snippets 
        WHERE id = ${snippetId}
        LIMIT 1
      `

      console.log("[v0] Verification after update:")
      console.log("[v0] - is_public:", verifyResult[0]?.is_public)
      console.log("[v0] - public_id:", verifyResult[0]?.public_id)

      return NextResponse.json({
        public_url: snippet.public_url,
        public_id: snippet.public_id,
        is_public: true,
      })
    }

    const publicId = nanoid(10)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const cleanSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl
    const publicUrl = `${cleanSiteUrl}/s/${publicId}`

    console.log("[v0] Creating new public link:")
    console.log("[v0] - public_id:", publicId)
    console.log("[v0] - public_url:", publicUrl)

    await sql`
      UPDATE snippets
      SET public_id = ${publicId},
          public_url = ${publicUrl},
          is_public = true
      WHERE id = ${snippetId}
    `

    const updatedResult = await sql`
      SELECT id, public_id, public_url, is_public
      FROM snippets
      WHERE id = ${snippetId}
      LIMIT 1
    `

    if (updatedResult.length === 0) {
      console.error("[v0] Update failed: snippet not found after update")
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    const updatedSnippet = updatedResult[0]
    console.log("[v0] Update successful:")
    console.log("[v0] - public_id:", updatedSnippet.public_id)
    console.log("[v0] - is_public:", updatedSnippet.is_public)
    console.log("[v0] ===== SHARE API END (SUCCESS) =====")

    return NextResponse.json({
      public_url: updatedSnippet.public_url,
      public_id: updatedSnippet.public_id,
      is_public: updatedSnippet.is_public,
    })
  } catch (error) {
    console.error("[v0] Share API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] ===== SHARE API DELETE START =====")
    console.log("[v0] Share API DELETE - snippetId:", snippetId)

    const supabase = await createClient()
    const sql = getDb()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Share API DELETE - Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await sql`
      UPDATE snippets
      SET is_public = false
      WHERE id = ${snippetId} AND user_id = ${user.id}
    `

    console.log("[v0] Share API DELETE - Successfully removed public sharing")
    console.log("[v0] ===== SHARE API DELETE END =====")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Share API DELETE - Unexpected error:", error)
    console.error("[v0] Share API DELETE - Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
