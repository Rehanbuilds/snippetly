import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserPlan, getUserSnippetCount } from "@/lib/supabase/plans"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [plan, snippetCount] = await Promise.all([getUserPlan(user.id), getUserSnippetCount(user.id)])

    return NextResponse.json({
      plan,
      snippetCount,
      canCreateSnippet: plan.plan_type === "pro" || snippetCount < plan.snippet_limit,
    })
  } catch (error) {
    console.error("Error fetching user plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
