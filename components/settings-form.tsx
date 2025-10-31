"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Palette, Bell, Trash2, Crown, Zap, CreditCard } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useTheme } from "next-themes"
import { UpgradeModal } from "@/components/upgrade-modal"

interface SettingsFormProps {
  user: SupabaseUser
}

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  plan_type: string | null
  plan_status: string | null
  snippet_limit: number | null
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [userPlan, setUserPlan] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const createdAtLabel = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
    : "—"

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned
          throw error
        }

        if (data) {
          setProfile(data)
          setName(data.full_name || "")
          setDisplayName(data.display_name || "")
          setBio(data.bio || "")
          setUserPlan({
            plan_type: data.plan_type || "free",
            plan_status: data.plan_status || "active",
            snippet_limit: data.snippet_limit || 50,
          })
        } else {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || null,
              display_name: user.email?.split("@")[0] || null,
            })
            .select()
            .single()

          if (createError) throw createError

          if (newProfile) {
            setProfile(newProfile)
            setName(newProfile.full_name || "")
            setDisplayName(newProfile.display_name || "")
            setBio(newProfile.bio || "")
            setUserPlan({
              plan_type: newProfile.plan_type || "free",
              plan_status: newProfile.plan_status || "active",
              snippet_limit: newProfile.snippet_limit || 50,
            })
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        })
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [user.id, user.email, user.user_metadata?.full_name, supabase])

  const userDisplayName = profile?.display_name || profile?.full_name || user?.email?.split("@")[0] || "User"
  const userInitials = userDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.updateUser({
        email: email,
        data: {
          full_name: name,
          display_name: displayName,
        },
      })

      if (authError) throw authError

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name || null,
        display_name: displayName || null,
        bio: bio || null,
      })

      if (profileError) throw profileError

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true)

        toast({
          title: "Account deletion requested",
          description: "Please contact support to complete account deletion.",
        })
      } catch (error) {
        console.error("Error deleting account:", error)
        toast({
          title: "Error",
          description: "Failed to delete account. Please contact support.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB.", variant: "destructive" })
      return
    }
    try {
      setAvatarUploading(true)
      const ext = file.name.split(".").pop() || "jpg"
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      })
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path)
      const publicUrl = publicData?.publicUrl
      if (!publicUrl) {
        throw new Error("Failed to get public URL.")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)
      if (profileError) throw profileError

      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : prev))

      toast({ title: "Photo updated", description: "Your profile photo has been updated." })
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Avatar upload error:", error?.message || error)
      toast({
        title: "Upload failed",
        description: "Could not upload your photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  if (profileLoading) {
    return <div className="flex items-center justify-center p-8">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || "/diverse-user-avatars.png"} alt="Profile" />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChangePhotoClick}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How others see your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Account Created</Label>
              <Input id="createdAt" value={createdAtLabel} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Plans & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plans & Billing
          </CardTitle>
          <CardDescription>Manage your subscription and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {userPlan?.plan_type === "pro" ? (
                  <Crown className="h-6 w-6 text-yellow-600" />
                ) : (
                  <Zap className="h-6 w-6 text-blue-600" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      {userPlan?.plan_type === "pro" ? "Snippetly Pro" : "Free Plan"}
                    </span>
                    <Badge variant={userPlan?.plan_type === "pro" ? "default" : "secondary"}>
                      {userPlan?.plan_type?.toUpperCase() || "FREE"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userPlan?.plan_type === "pro"
                      ? "Unlimited snippets and advanced features"
                      : `Up to ${userPlan?.snippet_limit || 50} snippets`}
                  </p>
                </div>
              </div>
              {userPlan?.plan_type === "free" && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>

            {userPlan?.plan_type === "pro" ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span className="font-medium">One-time payment</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">
                  You have lifetime access to all Pro features. Thank you for your support!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Upgrade to Pro and get:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Unlimited snippets
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Unlimited folders
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Unlimited boilerplates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Priority support
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how Snippetly looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch
              id="darkMode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates about your snippets via email</p>
            </div>
            <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that will affect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. All your snippets and data will be permanently
              deleted.
            </p>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={loading}>
              {loading ? "Processing..." : "Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      {userPlan && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSnippetCount={0}
          snippetLimit={userPlan.snippet_limit}
        />
      )}
    </div>
  )
}
