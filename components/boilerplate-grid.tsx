"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Star, Copy } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ViewSnippetModal } from "@/components/view-snippet-modal"

interface Boilerplate {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  tags: string[]
  is_favorite: boolean
  created_at: string
}

interface BoilerplateGridProps {
  boilerplates: Boilerplate[]
  favoritesOnly?: boolean
}

export function BoilerplateGrid({ boilerplates, favoritesOnly = false }: BoilerplateGridProps) {
  const [viewingBoilerplate, setViewingBoilerplate] = useState<Boilerplate | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this boilerplate?")) {
      return
    }

    const { error } = await supabase.from("boilerplates").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete boilerplate")
      console.error("Error deleting boilerplate:", error)
    } else {
      toast.success("Boilerplate deleted successfully")
      router.refresh()
    }
  }

  const handleToggleFavorite = async (id: string, currentFavorite: boolean, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { error } = await supabase.from("boilerplates").update({ is_favorite: !currentFavorite }).eq("id", id)

    if (error) {
      toast.error("Failed to update favorite")
      console.error("Error updating favorite:", error)
    } else {
      toast.success(currentFavorite ? "Removed from favorites" : "Added to favorites")
      router.refresh()
    }
  }

  const handleCopy = async (code: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(code)
      toast.success("Code copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy code")
      console.error("Error copying code:", error)
    }
  }

  if (boilerplates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {favoritesOnly ? "No favorite boilerplates yet" : "No boilerplates yet"}
        </p>
        {!favoritesOnly && (
          <Link href="/dashboard/boilerplates/new">
            <Button>Create Your First Boilerplate</Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boilerplates.map((boilerplate) => (
          <Card
            key={boilerplate.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setViewingBoilerplate(boilerplate)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">{boilerplate.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {boilerplate.language}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleToggleFavorite(boilerplate.id, boilerplate.is_favorite, e)}
                >
                  <Star className={`h-4 w-4 ${boilerplate.is_favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                </Button>
              </div>

              {boilerplate.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{boilerplate.description}</p>
              )}

              <div className="bg-muted rounded-md p-3 mb-3">
                <pre className="text-xs font-mono overflow-hidden line-clamp-4">{boilerplate.code}</pre>
              </div>

              {boilerplate.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {boilerplate.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {boilerplate.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{boilerplate.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewingBoilerplate(boilerplate)
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => handleCopy(boilerplate.code, e)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Link href={`/dashboard/boilerplates/${boilerplate.id}/edit`} onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={(e) => handleDelete(boilerplate.id, e)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewingBoilerplate && (
        <ViewSnippetModal
          snippet={viewingBoilerplate}
          isOpen={!!viewingBoilerplate}
          onClose={() => setViewingBoilerplate(null)}
        />
      )}
    </>
  )
}
