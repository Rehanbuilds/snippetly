import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    console.log("[v0] Share API - snippetId:", snippetId)

    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Share API - user:", user?.id)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if snippet exists and belongs to user
    const { data: snippet, error: fetchError } = await supabase
      .from("snippets")
      .select("*")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Share API - snippet found:", !!snippet, "error:", fetchError)

    if (fetchError || !snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // If already has a public_id, return existing URL
    if (snippet.public_id && snippet.public_url) {
      console.log("[v0] Share API - returning existing public URL:", snippet.public_url)
      return NextResponse.json({
        public_url: snippet.public_url,
        public_id: snippet.public_id,
        is_public: snippet.is_public,
      })
    }

    // Generate unique public ID
    const publicId = nanoid(10)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const publicUrl = `${siteUrl}/s/${publicId}`

    console.log("[v0] Share API - generating new public URL:", publicUrl)

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
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating snippet:", updateError)
      return NextResponse.json({ error: "Failed to generate public link" }, { status: 500 })
    }

    console.log("[v0] Share API - successfully created public link")

    return NextResponse.json({
      public_url: updatedSnippet.public_url,
      public_id: updatedSnippet.public_id,
      is_public: updatedSnippet.is_public,
    })
  } catch (error) {
    console.error("[v0] Error generating public link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: snippetId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove public sharing
    const { error: updateError } = await supabase
      .from("snippets")
      .update({
        is_public: false,
      })
      .eq("id", snippetId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("[v0] Error removing public sharing:", updateError)
      return NextResponse.json({ error: "Failed to remove public sharing" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing public sharing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
