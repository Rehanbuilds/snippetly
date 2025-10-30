import { createClient, createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] ===== SHARE API START =====")
    console.log("[v0] Snippet ID:", snippetId)

    const supabase = await createClient()
    const supabaseAdmin = createServiceRoleClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Auth failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id)

    const { data: snippet, error: fetchError } = await supabaseAdmin
      .from("snippets")
      .select("id, user_id, public_id, public_url, is_public")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !snippet) {
      console.log("[v0] Snippet not found or not owned by user")
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    console.log("[v0] Snippet found - current state:")
    console.log("[v0] - public_id:", snippet.public_id)
    console.log("[v0] - is_public:", snippet.is_public)

    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Reusing existing public link:", snippet.public_url)

      const { error: updateError } = await supabaseAdmin
        .from("snippets")
        .update({ is_public: true })
        .eq("id", snippetId)

      if (updateError) {
        console.log("[v0] Failed to update is_public:", updateError)
      } else {
        console.log("[v0] Successfully set is_public to true")
      }

      const { data: verifyData } = await supabaseAdmin
        .from("snippets")
        .select("is_public, public_id")
        .eq("id", snippetId)
        .single()

      console.log("[v0] Verification after update:")
      console.log("[v0] - is_public:", verifyData?.is_public)
      console.log("[v0] - public_id:", verifyData?.public_id)

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

    const { data: updatedSnippet, error: updateError } = await supabaseAdmin
      .from("snippets")
      .update({
        public_id: publicId,
        public_url: publicUrl,
        is_public: true,
      })
      .eq("id", snippetId)
      .select("id, public_id, public_url, is_public")
      .single()

    if (updateError || !updatedSnippet) {
      console.error("[v0] Update failed:", updateError)
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

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
    const supabaseAdmin = createServiceRoleClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Share API DELETE - Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error: updateError } = await supabaseAdmin
      .from("snippets")
      .update({
        is_public: false,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("[v0] Share API DELETE - Error removing public sharing:", updateError)
      return NextResponse.json({ error: "Failed to remove public sharing" }, { status: 500 })
    }

    console.log("[v0] Share API DELETE - Successfully removed public sharing")
    console.log("[v0] ===== SHARE API DELETE END =====")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Share API DELETE - Unexpected error:", error)
    console.error("[v0] Share API DELETE - Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
