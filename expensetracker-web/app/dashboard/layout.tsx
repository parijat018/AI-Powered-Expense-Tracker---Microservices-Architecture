"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ExpenseProvider } from "@/lib/expense-context"
import { ToastProvider } from "@/components/toast-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { X } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // 🔥 AUTH GUARD
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login") // ✅ fixed
    }
  }, [isAuthenticated, isLoading, router])

  // 🔥 LOADING SCREEN
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // 🔥 BLOCK UI UNTIL REDIRECT
  if (!isAuthenticated) {
    return null
  }

  return (
    <ExpenseProvider>
      <ToastProvider>
        <div className="flex h-screen bg-background">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 border-r">
            <AppSidebar />
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200"
            >
              <X className="size-5" />
            </button>

            <AppSidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>

          {/* MAIN AREA */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Top Navbar */}
            <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
              {children}
            </main>

          </div>
        </div>
      </ToastProvider>
    </ExpenseProvider>
  )
}