"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Code, Search, Star, Tag, Plus, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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
          <Link href="/dashboard" className="flex items-center mr-4 md:mr-8">
            <Code className="h-6 w-6 mr-2" />
            <span className="text-lg font-bold">Snippetly</span>
          </Link>

          {/* Global Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search all snippets..." className="pl-10" />
          </div>

          {/* Profile Menu */}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || "/diverse-user-avatars.png"} alt="User" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userDisplayName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email || ""}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
