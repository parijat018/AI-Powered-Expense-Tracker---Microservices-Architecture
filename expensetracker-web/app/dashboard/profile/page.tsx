"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { LogOut, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  ////////////////////////////////////////////////////
  // 🔥 LOCAL FORM STATE (SYNC WITH USER)
  ////////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    phone: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  ////////////////////////////////////////////////////
  // 🔄 SYNC USER → FORM
  ////////////////////////////////////////////////////
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        username: user.userId || "", // fallback
        phone: user.phoneNumber || "",
      })
    }
  }, [user])

  ////////////////////////////////////////////////////
  // SAVE (UI ONLY for now)
  ////////////////////////////////////////////////////
  const handleSave = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsLoading(false)
    showToast("Profile updated (UI only)", "success")
  }

  ////////////////////////////////////////////////////

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Personal Info</CardTitle>
              <CardDescription>
                Update your details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
              />

              <Input
                placeholder="User ID"
                value={formData.username}
                disabled // 🔒 not editable
              />

              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <Card>
            <CardContent className="pt-6 text-center">

              <div className="text-2xl font-bold">
                {formData.firstName?.charAt(0) || "U"}
              </div>

              <h3 className="mt-2 font-semibold">
                {formData.firstName || "User"}
              </h3>

              <p>@{formData.username}</p>
              <p>{formData.phone}</p>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}