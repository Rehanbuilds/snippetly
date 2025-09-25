import { createClient } from "./server"

export async function getUserPlan(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("plan_type, plan_status, snippet_limit, paddle_customer_id")
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserPlan(
  userId: string,
  planData: {
    plan_type: string
    plan_status: string
    paddle_customer_id?: string
    paddle_subscription_id?: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      ...planData,
      snippet_limit: planData.plan_type === "pro" ? 999999 : 50,
      plan_updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
}

export async function getUserSnippetCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("snippets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) throw error
  return count || 0
}

export async function canUserCreateSnippet(userId: string) {
  const [plan, snippetCount] = await Promise.all([getUserPlan(userId), getUserSnippetCount(userId)])

  if (plan.plan_type === "pro") return true
  return snippetCount < plan.snippet_limit
}
