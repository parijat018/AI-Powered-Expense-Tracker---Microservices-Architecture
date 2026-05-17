"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

import { useRouter } from "next/navigation"

import {
  login as apiLogin,
  signup as apiSignup,
  getUserProfile,
} from "./api"

//////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////

interface AuthContextType {
  login: (username: string, password: string) => Promise<boolean>
  signup: (data: any) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  user: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

//////////////////////////////////////////////////
// PROVIDER
//////////////////////////////////////////////////

export function AuthProvider({ children }: { children: ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [user, setUser] = useState<any>(null)

  const router = useRouter()

  ////////////////////////////////////////////////////
  // 🔄 INIT AUTH
  ////////////////////////////////////////////////////

  useEffect(() => {

    const initAuth = async () => {

      try {

        const token = localStorage.getItem("accessToken")

        const userId = localStorage.getItem("userId")

        if (!token) {
          setIsAuthenticated(false)
          return
        }

        //////////////////////////////////////////////////
        // 🔥 Fetch user only if valid userId exists
        //////////////////////////////////////////////////

        if (
          userId &&
          userId !== "undefined" &&
          userId !== "null"
        ) {

          const userData = await getUserProfile(userId)

          setUser(userData)
        }

        setIsAuthenticated(true)

      } catch (err) {

        console.error("❌ Auth init failed:", err)

        localStorage.clear()

        setIsAuthenticated(false)

        setUser(null)

      } finally {

        setIsLoading(false)
      }
    }

    initAuth()

  }, [])

  ////////////////////////////////////////////////////
  // 🔐 LOGIN
  ////////////////////////////////////////////////////

  const login = async (
    username: string,
    password: string
  ) => {

    try {

      const data = await apiLogin({
        username,
        password,
      })

      //////////////////////////////////////////////////
      // 🔥 Save userId only if valid
      //////////////////////////////////////////////////

      if (
        data.userId &&
        data.userId !== "undefined" &&
        data.userId !== "null"
      ) {

        localStorage.setItem("userId", data.userId)

        const userData = await getUserProfile(data.userId)

        setUser(userData)
      }

      setIsAuthenticated(true)

      router.push("/dashboard")

      return true

    } catch (err) {

      console.error("❌ Login failed:", err)

      return false
    }
  }

  ////////////////////////////////////////////////////
  // 🆕 SIGNUP
  ////////////////////////////////////////////////////

  const signup = async (data: any) => {

    try {

      const res = await apiSignup(data)

      //////////////////////////////////////////////////
      // 🔥 Save userId only if valid
      //////////////////////////////////////////////////

      if (
        res.userId &&
        res.userId !== "undefined" &&
        res.userId !== "null"
      ) {

        localStorage.setItem("userId", res.userId)

        const userData = await getUserProfile(res.userId)

        setUser(userData)
      }

      setIsAuthenticated(true)

      router.push("/dashboard")

      return true

    } catch (err) {

      console.error("❌ Signup failed:", err)

      return false
    }
  }

  ////////////////////////////////////////////////////
  // 🚪 LOGOUT
  ////////////////////////////////////////////////////

  const logout = () => {

    localStorage.clear()

    setIsAuthenticated(false)

    setUser(null)

    router.push("/login")
  }

  ////////////////////////////////////////////////////

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        isAuthenticated,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//////////////////////////////////////////////////
// HOOK
//////////////////////////////////////////////////

export const useAuth = () => {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    )
  }

  return context
}