"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [userPlan, setUserPlan] = useState<any>(null)
  const [snippetCount, setSnippetCount] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        redirect("/signin")
        return
      }

      setUser(data.user)
      setLoading(false)

      await Promise.all([loadFilters(data.user.id), loadUserPlan(data.user.id), loadSnippetCount(data.user.id)])
    }

    checkUser()
  }, [])

  const loadUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, plan_status, snippet_limit")
        .eq("id", userId)
        .single()

      if (error) throw error
      setUserPlan(data)
    } catch (error) {
      console.error("Error loading user plan:", error)
    }
  }

  const loadSnippetCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("snippets")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      if (error) throw error
      setSnippetCount(count || 0)
    } catch (error) {
      console.error("Error loading snippet count:", error)
    }
  }

  const loadFilters = async (userId: string) => {
    try {
      const { data: snippets, error } = await supabase.from("snippets").select("language, tags").eq("user_id", userId)

      if (error) throw error

      const languages = [...new Set(snippets?.map((s) => s.language) || [])]
      setAvailableLanguages(languages)

      const allTags = snippets?.flatMap((s) => s.tags || []) || []
      const uniqueTags = [...new Set(allTags)]
      setAvailableTags(uniqueTags)
    } catch (error) {
      console.error("Error loading filters:", error)
    }
  }

  const checkUpgradeNeeded = () => {
    if (userPlan?.plan_type === "free" && snippetCount >= userPlan?.snippet_limit) {
      setShowUpgradeModal(true)
      return true
    }
    return false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {userPlan && userPlan.plan_type === "free" && (
          <Card
            className={`border-2 ${userPlan.plan_type === "pro" ? "border-yellow-200 bg-yellow-50" : "border-gray-200"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {userPlan.plan_type === "pro" ? (
                    <Crown className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {userPlan.plan_type === "pro" ? "Snippetly Pro" : "Free Plan"}
                      </span>
                      <Badge variant={userPlan.plan_type === "pro" ? "default" : "secondary"}>
                        {userPlan.plan_type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userPlan.plan_type === "pro"
                        ? `Unlimited snippets • ${snippetCount} created`
                        : `${snippetCount} of ${userPlan.snippet_limit} snippets used`}
                    </p>
                  </div>
                </div>
                {userPlan.plan_type === "free" && (
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </div>
              {userPlan.plan_type === "free" && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        snippetCount >= userPlan.snippet_limit ? "bg-red-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min((snippetCount / userPlan.snippet_limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Snippets</h1>
            <p className="text-muted-foreground">Manage and organize your code snippets</p>
          </div>
          <Link href="/dashboard/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets by title..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {availableLanguages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SnippetGrid
          userId={user.id}
          searchQuery={searchQuery}
          selectedLanguage={selectedLanguage}
          selectedTag={selectedTag}
        />
      </div>

      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={snippetCount}
          snippetLimit={userPlan.snippet_limit}
        />
      )}
    </DashboardLayout>
  )
}
