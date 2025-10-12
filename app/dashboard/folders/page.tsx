"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FolderGrid } from "@/components/folder-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function FoldersPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [folders, setFolders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        redirect("/signin")
        return
      }

      setUser(data.user)
      await loadFolders(data.user.id)
      setLoading(false)
    }

    checkUser()
  }, [])

  const loadFolders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select(`
          *,
          snippets:snippets(count)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setFolders(data || [])
    } catch (error) {
      console.error("Error loading folders:", error)
    }
  }

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Folders</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Organize your snippets into folders</p>
          </div>
          <Link href="/dashboard/folders/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </Link>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders by name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <FolderGrid folders={filteredFolders} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
