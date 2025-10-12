"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"
import { createPaddleCheckoutUrl } from "@/app/actions/paddle"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentSnippetCount: number
  snippetLimit: number
}

export function UpgradeModal({ isOpen, onClose, currentSnippetCount, snippetLimit }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleUpgrade = async () => {
    console.log("[v0] Starting upgrade process...")
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("[v0] User authentication error:", error)
        toast({
          title: "Error",
          description: "Please sign in to upgrade your plan.",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] User authenticated, creating checkout URL...")

      const result = await createPaddleCheckoutUrl(user.id, user.email || "")

      if (!result.success) {
        console.error("[v0] Checkout creation failed:", result.error)
        toast({
          title: "Checkout Error",
          description: result.error || "Failed to create checkout session. Please try again.",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Checkout URL created, redirecting...")

      // Close modal before redirecting
      onClose()

      window.location.href = result.checkoutUrl
    } catch (error) {
      console.error("[v0] Upgrade error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to open checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const proFeatures = [
    "Unlimited code snippets",
    "Unlimited folders",
    "Unlimited snippets per folder",
    "Advanced search and filtering",
    "Priority support",
    "Export to multiple formats",
    "Team collaboration (coming soon)",
    "Advanced syntax highlighting",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              You've used {currentSnippetCount} of {snippetLimit} snippets
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentSnippetCount / snippetLimit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Snippetly Pro</h3>
              <Badge variant="secondary">One-time payment</Badge>
            </div>
            <div className="text-3xl font-bold mb-4">
              $29 <span className="text-sm font-normal text-muted-foreground">forever</span>
            </div>

            <ul className="space-y-2 mb-4">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Opening Checkout..." : "Upgrade Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
