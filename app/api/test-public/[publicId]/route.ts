import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params

  console.log("[v0] TEST API - Testing public_id:", publicId)

  const supabase = await createClient()

  // Test 1: Try to find snippet with public_id (ignore is_public)
  const { data: test1, error: error1 } = await supabase
    .from("snippets")
    .select("id, title, public_id, is_public, user_id")
    .eq("public_id", publicId)
    .maybeSingle()

  console.log("[v0] TEST 1 - Find by public_id (any):", test1)
  console.log("[v0] TEST 1 - Error:", error1)

  // Test 2: Try to find snippet with public_id AND is_public = true
  const { data: test2, error: error2 } = await supabase
    .from("snippets")
    .select("id, title, public_id, is_public, user_id")
    .eq("public_id", publicId)
    .eq("is_public", true)
    .maybeSingle()

  console.log("[v0] TEST 2 - Find by public_id (public only):", test2)
  console.log("[v0] TEST 2 - Error:", error2)

  // Test 3: Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  console.log("[v0] TEST 3 - Current user:", user?.id || "anonymous")
  console.log("[v0] TEST 3 - Auth error:", authError)

  return NextResponse.json({
    publicId,
    test1: {
      found: !!test1,
      data: test1,
      error: error1?.message,
    },
    test2: {
      found: !!test2,
      data: test2,
      error: error2?.message,
    },
    currentUser: user?.id || "anonymous",
    message: test1
      ? test1.is_public
        ? "Snippet exists and is public - should work!"
        : "Snippet exists but is_public is FALSE - this is the problem!"
      : "Snippet not found with this public_id - share API might not be saving correctly",
  })
}
