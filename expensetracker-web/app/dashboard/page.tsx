"use client"

import { useExpenses } from "@/lib/expense-context"
import { StatCard } from "@/components/stat-card"
import { ExpenseChart } from "@/components/expense-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { DollarSign, TrendingDown, Wallet, PiggyBank } from "lucide-react"

export default function DashboardPage() {
  const { expenses, loading } = useExpenses()

  ////////////////////////////////////////////////////
  // 🔢 CALCULATIONS (REAL DATA)
  ////////////////////////////////////////////////////

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  )

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlySpend = expenses
    .filter((e) => {
      const d = new Date(e.date)
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      )
    })
    .reduce((sum, e) => sum + e.amount, 0)

  // 🔥 TEMP budget (same as Budget page)
  const budget = 2000

  const remainingBudget = budget - monthlySpend

  ////////////////////////////////////////////////////

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  ////////////////////////////////////////////////////

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Track your expenses and manage your budget
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toFixed(2)}`}
          description="All time spending"
          icon={DollarSign}
        />

        <StatCard
          title="Monthly Spend"
          value={`₹${monthlySpend.toFixed(2)}`}
          description="This month"
          icon={TrendingDown}
        />

        <StatCard
          title="Monthly Budget"
          value={`₹${budget.toFixed(2)}`}
          description="Set in budget settings"
          icon={Wallet}
        />

        <StatCard
          title="Remaining Budget"
          value={`₹${remainingBudget.toFixed(2)}`}
          description={
            remainingBudget < 0
              ? "Over budget!"
              : "Available to spend"
          }
          icon={PiggyBank}
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart />
        <RecentTransactions />
      </div>

    </div>
  )
}