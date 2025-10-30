import { createClient, createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] Share API - snippetId:", snippetId)

    const supabase = await createClient()
    const supabaseAdmin = await createServiceRoleClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: snippet, error: fetchError } = await supabaseAdmin
      .from("snippets")
      .select("id, user_id, public_id, public_url, is_public")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // If snippet already has a public_id, reuse it
    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Reusing existing public link:", snippet.public_url)

      // Make sure is_public is set to true
      if (!snippet.is_public) {
        await supabaseAdmin.from("snippets").update({ is_public: true }).eq("id", snippetId)
      }

      return NextResponse.json({
        public_url: snippet.public_url,
        public_id: snippet.public_id,
        is_public: true,
      })
    }

    const publicId = nanoid(10)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    // Fix double slash issue
    const cleanSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl
    const publicUrl = `${cleanSiteUrl}/s/${publicId}`

    console.log("[v0] Creating new public link:", publicUrl)

    const { data: updatedSnippet, error: updateError } = await supabaseAdmin
      .from("snippets")
      .update({
        public_id: publicId,
        public_url: publicUrl,
        is_public: true,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .select("id, public_id, public_url, is_public")
      .single()

    if (updateError || !updatedSnippet) {
      console.error("[v0] Failed to create public link:", updateError)
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    console.log("[v0] Successfully created public link")

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
    const supabaseAdmin = await createServiceRoleClient()

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
