"use client"

import { useState, useEffect } from "react"

import { useRouter } from "next/navigation"

import Link from "next/link"

import { useAuth } from "@/lib/auth-context"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Wallet,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"

export default function LoginPage() {

  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const {
    login,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth()

  const router = useRouter()

  ////////////////////////////////////////////////////
  // 🔄 REDIRECT IF LOGGED IN
  ////////////////////////////////////////////////////

  useEffect(() => {

    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard")
    }

  }, [isAuthenticated, authLoading, router])

  ////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    setError("")

    //////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    setIsLoading(true)

    //////////////////////////////////////////////////
    // LOGIN
    //////////////////////////////////////////////////

    try {

      const success = await login(
        username,
        password
      )

      if (!success) {
        setError("Invalid username or password")
      }

    } catch (err: any) {

      console.error("❌ Login failed:", err)

      setError(err.message || "Login failed")

    } finally {

      setIsLoading(false)
    }
  }

  ////////////////////////////////////////////////////

  return (

    <div className="flex min-h-screen">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 bg-sidebar items-center justify-center p-12">

        <div className="max-w-md text-center">

          <div className="mb-8 flex justify-center">

            <div className="rounded-2xl bg-primary p-4">

              <Wallet className="size-12 text-primary-foreground" />

            </div>

          </div>

          <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
            ExpenseTracker
          </h1>

          <p className="text-sidebar-foreground/70 text-lg">
            Take control of your finances with smart expense
            tracking and AI-powered insights.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">

        <div className="w-full max-w-md">

          <div className="mb-8">

            <h2 className="text-2xl font-bold mb-2">
              Welcome back
            </h2>

            <p className="text-muted-foreground">
              Sign in to continue
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {error && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              placeholder="Username"
              value={username}
              disabled={isLoading}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <div className="relative">

              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                disabled={isLoading}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword
                  ? <EyeOff />
                  : <Eye />}
              </button>

            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >

              {isLoading
                ? <Loader2 className="animate-spin" />
                : "Sign in"}

            </Button>

          </form>

          <p className="mt-6 text-center text-sm">

            Don’t have an account?{" "}

            <Link
              href="/signup"
              className="text-blue-500"
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}