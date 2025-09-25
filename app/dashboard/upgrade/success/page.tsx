"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function UpgradeSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const checkUpgradeStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/signin")
          return
        }

        // Check if user's plan has been updated
        const { data, error } = await supabase
          .from("profiles")
          .select("plan_type, plan_status, snippet_limit")
          .eq("id", user.id)
          .single()

        if (error) throw error
        setUserPlan(data)
      } catch (error) {
        console.error("Error checking upgrade status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUpgradeStatus()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Verifying your upgrade...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Welcome to Snippetly Pro!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Pro Plan Activated</span>
            </div>
            <p className="text-muted-foreground">
              Your payment has been processed successfully and your account has been upgraded.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">What's New:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Unlimited code snippets</li>
              <li>• Advanced search and filtering</li>
              <li>• Priority support</li>
              <li>• Export to multiple formats</li>
              <li>• Advanced syntax highlighting</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">Thank you for supporting Snippetly! 🎉</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
