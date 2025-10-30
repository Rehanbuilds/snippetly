import { createClient, createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] ===== SHARE API POST START =====")
    console.log("[v0] Share API POST - snippetId:", snippetId)

    const supabase = await createClient()
    const supabaseAdmin = await createServiceRoleClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Share API POST - user:", user?.id, "authError:", authError)

    if (authError || !user) {
      console.log("[v0] Share API POST - Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: snippet, error: fetchError } = await supabaseAdmin
      .from("snippets")
      .select("id, user_id, public_id, public_url, is_public")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Share API POST - snippet found:", !!snippet)
    console.log("[v0] Share API POST - snippet data:", snippet)
    console.log("[v0] Share API POST - fetchError:", fetchError)

    if (fetchError || !snippet) {
      console.error("[v0] Share API POST - Snippet not found or unauthorized")
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // If snippet already has a public_id, reuse it
    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Share API POST - Snippet already has public link")
      console.log("[v0] Share API POST - Existing public_id:", snippet.public_id)
      console.log("[v0] Share API POST - Existing public_url:", snippet.public_url)
      console.log("[v0] Share API POST - Current is_public:", snippet.is_public)

      // Make sure is_public is set to true
      if (!snippet.is_public) {
        console.log("[v0] Share API POST - Setting is_public to true")
        const { error: updateError } = await supabaseAdmin
          .from("snippets")
          .update({ is_public: true })
          .eq("id", snippetId)
          .eq("user_id", user.id)

        if (updateError) {
          console.error("[v0] Share API POST - Error updating is_public:", updateError)
        } else {
          console.log("[v0] Share API POST - Successfully set is_public to true")
        }
      }

      console.log("[v0] Share API POST - Returning existing public URL:", snippet.public_url)
      console.log("[v0] ===== SHARE API POST END (EXISTING) =====")
      return NextResponse.json({
        public_url: snippet.public_url,
        public_id: snippet.public_id,
        is_public: true,
      })
    }

    // Generate unique public ID
    const publicId = nanoid(10)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const publicUrl = `${siteUrl}/s/${publicId}`

    console.log("[v0] Share API POST - Generating NEW public link")
    console.log("[v0] Share API POST - New publicId:", publicId)
    console.log("[v0] Share API POST - Site URL:", siteUrl)
    console.log("[v0] Share API POST - New publicUrl:", publicUrl)

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

    console.log("[v0] Share API POST - Update result:", updatedSnippet)
    console.log("[v0] Share API POST - Update error:", updateError)

    if (updateError) {
      console.error("[v0] Share API POST - Update error details:", JSON.stringify(updateError, null, 2))
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    if (!updatedSnippet) {
      console.error("[v0] Share API POST - No updated snippet returned")
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    // Verify the update by fetching again
    const { data: verifySnippet, error: verifyError } = await supabaseAdmin
      .from("snippets")
      .select("id, public_id, public_url, is_public")
      .eq("id", snippetId)
      .single()

    console.log("[v0] Share API POST - Verification fetch:", verifySnippet)
    console.log("[v0] Share API POST - Verification error:", verifyError)

    console.log("[v0] Share API POST - Successfully created public link")
    console.log("[v0] ===== SHARE API POST END (NEW) =====")

    return NextResponse.json({
      public_url: updatedSnippet.public_url,
      public_id: updatedSnippet.public_id,
      is_public: updatedSnippet.is_public,
    })
  } catch (error) {
    console.error("[v0] Share API POST - Unexpected error:", error)
    console.error("[v0] Share API POST - Error stack:", error instanceof Error ? error.stack : "No stack")
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
