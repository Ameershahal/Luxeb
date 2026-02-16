"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettings() {
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
  })
  const [isSavingLinks, setIsSavingLinks] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        const data = await res.json()
        if (data.success && data.socialLinks) {
          setSocialLinks({
            instagram: data.socialLinks.instagram || "",
            facebook: data.socialLinks.facebook || "",
            tiktok: data.socialLinks.tiktok || "",
          })
        }
      } catch {
        // keep empty defaults
      }
    }
    loadSocialLinks()
  }, [])

  const saveSocialLinks = async () => {
    setIsSavingLinks(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socialLinks),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save links")
      }
      alert("Social links saved")
    } catch (error: any) {
      alert(error.message || "Failed to save links")
    } finally {
      setIsSavingLinks(false)
    }
  }

  const updatePassword = async () => {
    setIsUpdatingPassword(true)
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password")
      }
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      alert("Password updated successfully")
    } catch (error: any) {
      alert(error.message || "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic website information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Luxe Beauty & Training" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" defaultValue="info@luxebeautyandtrainingacademy.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+44 7450 239432" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                defaultValue="142C Shaw Heath, Stockport, Greater Manchester, SK2 6QS"
                rows={2}
              />
            </div>
            <Button className="w-full bg-primary text-primary-foreground">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>Set your operating hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monday - Saturday</Label>
                <Input defaultValue="9am - 8pm" />
              </div>
              <div className="space-y-2">
                <Label>Sunday</Label>
                <Input defaultValue="10am - 6pm" />
              </div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground">Save Hours</Button>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Connect your social accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/..."
                value={socialLinks.instagram}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/..."
                value={socialLinks.facebook}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, facebook: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input
                id="tiktok"
                placeholder="https://www.tiktok.com/@..."
                value={socialLinks.tiktok}
                onChange={(e) =>
                  setSocialLinks((prev) => ({ ...prev, tiktok: e.target.value }))
                }
              />
            </div>
            <Button
              type="button"
              onClick={saveSocialLinks}
              disabled={isSavingLinks}
              className="w-full bg-primary text-primary-foreground"
            >
              {isSavingLinks ? "Saving..." : "Save Links"}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your admin password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
              />
            </div>
            <Button
              type="button"
              onClick={updatePassword}
              disabled={isUpdatingPassword}
              className="w-full bg-primary text-primary-foreground"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
