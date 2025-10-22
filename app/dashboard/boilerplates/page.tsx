"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Search, Crown, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BoilerplateGrid } from "@/components/boilerplate-grid"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function BoilerplatesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [boilerplates, setBoilerplates] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userPlan, setUserPlan] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "favorites">("all")
  const supabase = createClient()

  const FREE_BOILERPLATE_LIMIT = 5

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        redirect("/signin")
        return
      }

      setUser(data.user)
      await Promise.all([loadBoilerplates(data.user.id), loadUserPlan(data.user.id)])
      setLoading(false)
    }

    checkUser()
  }, [])

  const loadUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, plan_status, boilerplate_limit")
        .eq("id", userId)
        .single()

      if (error) throw error
      setUserPlan(data)
    } catch (error) {
      console.error("Error loading user plan:", error)
    }
  }

  const loadBoilerplates = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("boilerplates")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBoilerplates(data || [])
    } catch (error) {
      console.error("Error loading boilerplates:", error)
    }
  }

  const handleCreateBoilerplate = () => {
    if (userPlan?.plan_type === "free" && boilerplates.length >= FREE_BOILERPLATE_LIMIT) {
      setShowUpgradeModal(true)
    } else {
      window.location.href = "/dashboard/boilerplates/new"
    }
  }

  const filteredBoilerplates = boilerplates.filter((boilerplate) => {
    if (filter === "favorites" && !boilerplate.is_favorite) {
      return false
    }

    return (
      boilerplate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boilerplate.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

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
            <h1 className="text-2xl sm:text-3xl font-bold">My Boilerplates</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Save and organize your code boilerplates</p>
          </div>
          <Button onClick={handleCreateBoilerplate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Boilerplate
          </Button>
        </div>

        {userPlan && (
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {userPlan.plan_type === "pro" && <Crown className="h-4 w-4 text-yellow-500" />}
                <span className="font-medium">{userPlan.plan_type === "pro" ? "Snippetly Pro" : "Free Plan"}</span>
                <Badge variant={userPlan.plan_type === "pro" ? "default" : "secondary"}>
                  {userPlan.plan_type.toUpperCase()}
                </Badge>
              </div>
              {userPlan.plan_type === "free" && (
                <Button size="sm" variant="outline" onClick={() => setShowUpgradeModal(true)} className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {userPlan.plan_type === "pro"
                ? "Unlimited boilerplates"
                : `${boilerplates.length} of ${FREE_BOILERPLATE_LIMIT} boilerplates used`}
            </p>
            {userPlan.plan_type === "free" && (
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      boilerplates.length >= FREE_BOILERPLATE_LIMIT ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min((boilerplates.length / FREE_BOILERPLATE_LIMIT) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All Boilerplates
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorites")}
            >
              <Star className="h-4 w-4 mr-1" />
              Favorites
            </Button>
          </div>

          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boilerplates by title..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <BoilerplateGrid boilerplates={filteredBoilerplates} favoritesOnly={filter === "favorites"} />
      </div>

      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={boilerplates.length}
          snippetLimit={FREE_BOILERPLATE_LIMIT}
        />
      )}
    </DashboardLayout>
  )
}
