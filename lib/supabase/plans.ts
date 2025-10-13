import { createClient } from "./server"

export async function getUserPlan(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("plan_type, plan_status, snippet_limit, folder_limit, paddle_customer_id")
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
      folder_limit: planData.plan_type === "pro" ? 999999 : 5,
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

export async function getUserFolderCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("folders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) throw error
  return count || 0
}

export async function getFolderSnippetCount(folderId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("snippets")
    .select("*", { count: "exact", head: true })
    .eq("folder_id", folderId)

  if (error) throw error
  return count || 0
}

export async function canUserCreateFolder(userId: string) {
  const [plan, folderCount] = await Promise.all([getUserPlan(userId), getUserFolderCount(userId)])

  if (plan.plan_type === "pro") return { canCreate: true, limit: plan.folder_limit || 999999, current: folderCount }
  return {
    canCreate: folderCount < (plan.folder_limit || 5),
    limit: plan.folder_limit || 5,
    current: folderCount,
  }
}

export async function canAddSnippetsToFolder(folderId: string, snippetsToAdd: number, userId: string) {
  const FREE_SNIPPETS_PER_FOLDER_LIMIT = 10
  const [plan, currentCount] = await Promise.all([getUserPlan(userId), getFolderSnippetCount(folderId)])

  if (plan.plan_type === "pro")
    return {
      canAdd: true,
      limit: 999999,
      current: currentCount,
    }

  const newTotal = currentCount + snippetsToAdd
  return {
    canAdd: newTotal <= FREE_SNIPPETS_PER_FOLDER_LIMIT,
    limit: FREE_SNIPPETS_PER_FOLDER_LIMIT,
    current: currentCount,
    wouldBe: newTotal,
  }
}

export const PLAN_LIMITS = {
  FREE: {
    FOLDERS: 5,
    SNIPPETS_PER_FOLDER: 10,
    TOTAL_SNIPPETS: 50,
  },
  PRO: {
    FOLDERS: 999999,
    SNIPPETS_PER_FOLDER: 999999,
    TOTAL_SNIPPETS: 999999,
  },
}
