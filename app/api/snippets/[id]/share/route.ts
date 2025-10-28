import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] Share API POST - snippetId:", snippetId)

    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Share API POST - user:", user?.id, "authError:", authError)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if snippet exists and belongs to user
    const { data: snippet, error: fetchError } = await supabase
      .from("snippets")
      .select("id, user_id, public_id, public_url, is_public")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Share API POST - snippet found:", !!snippet, "fetchError:", fetchError)

    if (fetchError || !snippet) {
      console.error("[v0] Share API POST - Snippet not found or unauthorized")
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Share API POST - Snippet already has public link, ensuring is_public=true")

      // Make sure is_public is set to true (in case it was previously disabled)
      if (!snippet.is_public) {
        const { error: updateError } = await supabase
          .from("snippets")
          .update({ is_public: true })
          .eq("id", snippetId)
          .eq("user_id", user.id)

        if (updateError) {
          console.error("[v0] Share API POST - Error updating is_public:", updateError)
        }
      }

      console.log("[v0] Share API POST - Returning existing public URL:", snippet.public_url)
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

    console.log("[v0] Share API POST - Generating new public URL:", publicUrl, "with publicId:", publicId)

    // Update snippet with public sharing info
    const { data: updatedSnippet, error: updateError } = await supabase
      .from("snippets")
      .update({
        public_id: publicId,
        public_url: publicUrl,
        is_public: true,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .select("public_id, public_url, is_public")
      .single()

    if (updateError) {
      console.error("[v0] Share API POST - Update error:", updateError)
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    console.log("[v0] Share API POST - Successfully created public link:", updatedSnippet)

    return NextResponse.json({
      public_url: updatedSnippet.public_url,
      public_id: updatedSnippet.public_id,
      is_public: updatedSnippet.is_public,
    })
  } catch (error) {
    console.error("[v0] Share API POST - Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] Share API DELETE - snippetId:", snippetId)

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove public sharing (keep public_id and public_url but set is_public to false)
    const { error: updateError } = await supabase
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
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Share API DELETE - Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
