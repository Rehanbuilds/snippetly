"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetGrid } from "@/components/snippet-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
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

      // Load available languages and tags
      await loadFilters(data.user.id)
    }

    checkUser()
  }, [])

  const loadFilters = async (userId: string) => {
    try {
      const { data: snippets, error } = await supabase.from("snippets").select("language, tags").eq("user_id", userId)

      if (error) throw error

      // Extract unique languages
      const languages = [...new Set(snippets?.map((s) => s.language) || [])]
      setAvailableLanguages(languages)

      // Extract unique tags
      const allTags = snippets?.flatMap((s) => s.tags || []) || []
      const uniqueTags = [...new Set(allTags)]
      setAvailableTags(uniqueTags)
    } catch (error) {
      console.error("Error loading filters:", error)
    }
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
        {/* Header with Search and Filters */}
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

        {/* Search and Filter Bar */}
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

        {/* Snippets Grid */}
        <SnippetGrid
          userId={user.id}
          searchQuery={searchQuery}
          selectedLanguage={selectedLanguage}
          selectedTag={selectedTag}
        />
      </div>
    </DashboardLayout>
  )
}
