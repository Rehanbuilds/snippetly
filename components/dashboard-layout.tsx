"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Star, Tag, Plus, Settings, LogOut, Menu, X, Folder } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { SnippetlyLogo } from "@/components/snippetly-logo"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: SupabaseUser
}

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
}

interface SnippetCounts {
  total: number
  favorites: number
  tags: Record<string, number>
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [snippetCounts, setSnippetCounts] = useState<SnippetCounts>({
    total: 0,
    favorites: 0,
    tags: {},
  })
  const [folderCount, setFolderCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
        }

        // Load snippet counts
        const { data: snippets } = await supabase.from("snippets").select("tags, is_favorite").eq("user_id", user.id)

        if (snippets) {
          const total = snippets.length
          const favorites = snippets.filter((s) => s.is_favorite).length

          // Count tags
          const tagCounts: Record<string, number> = {}
          snippets.forEach((snippet) => {
            snippet.tags.forEach((tag) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
          })

          setSnippetCounts({ total, favorites, tags: tagCounts })
        }

        const { count } = await supabase
          .from("folders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setFolderCount(count || 0)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    loadData()
  }, [user.id, supabase])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const userDisplayName =
    profile?.display_name ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User"
  const userInitials = userDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button variant="ghost" size="sm" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="mr-4 md:mr-8">
            <SnippetlyLogo href="/dashboard" />
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Welcome, {userDisplayName}</span>
              <span className="sm:hidden truncate max-w-20">Hi, {userDisplayName.split(" ")[0]}</span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline md:ml-2">Settings</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline md:ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-200 ease-in-out
          fixed md:static z-50 md:z-auto
          w-64 border-r border-border bg-background md:bg-muted/10 
          min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)]
        `}
        >
          <div className="p-6">
            {/* New Snippet Button */}
            <Link href="/dashboard/new" onClick={() => setSidebarOpen(false)}>
              <Button className="w-full mb-6">
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  All Snippets
                  <Badge variant="secondary" className="ml-auto">
                    {snippetCounts.total}
                  </Badge>
                </Button>
              </Link>
              <Link href="/dashboard/favorites" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Favorites
                  <Badge variant="secondary" className="ml-auto">
                    {snippetCounts.favorites}
                  </Badge>
                </Button>
              </Link>
              {/* Folders navigation item */}
              <Link href="/dashboard/folders" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Folder className="h-4 w-4 mr-2" />
                  Folders
                  <Badge variant="secondary" className="ml-auto">
                    {folderCount}
                  </Badge>
                </Button>
              </Link>
            </nav>

            {/* Tags Section */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </h3>
              <div className="space-y-1">
                {Object.entries(snippetCounts.tags)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([tag, count], index) => (
                    <Link key={tag} href={`/dashboard?tag=${tag}`} onClick={() => setSidebarOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            index % 4 === 0
                              ? "bg-blue-500"
                              : index % 4 === 1
                                ? "bg-yellow-500"
                                : index % 4 === 2
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                          }`}
                        ></span>
                        {tag}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {count}
                        </Badge>
                      </Button>
                    </Link>
                  ))}
                {Object.keys(snippetCounts.tags).length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags yet</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
