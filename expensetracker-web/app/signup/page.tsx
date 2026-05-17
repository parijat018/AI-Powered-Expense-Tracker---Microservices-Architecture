"use client"

import { useState, FormEvent } from "react"

import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    phone: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const { signup } = useAuth()

  ////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    setError("")

    //////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////

    if (!formData.firstName.trim()) {
      setError("First name is required")
      return
    }

    if (!formData.username.trim()) {
      setError("Username is required")
      return
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    setIsLoading(true)

    //////////////////////////////////////////////////
    // SIGNUP
    //////////////////////////////////////////////////

    try {

      const success = await signup(formData)

      if (!success) {
        setError("Signup failed")
      }

    } catch (err: any) {

      console.error("❌ Signup failed:", err)

      setError(err.message || "Signup failed")

    } finally {

      setIsLoading(false)
    }
  }

  ////////////////////////////////////////////////////

  return (

    <div className="flex min-h-screen items-center justify-center">

      <div className="w-full max-w-md p-6 border rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >

          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({
                ...formData,
                firstName: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLoading
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  )
}