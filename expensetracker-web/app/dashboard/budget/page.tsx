"use client"

import { useState } from "react"
import { useExpenses } from "@/lib/expense-context"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PiggyBank, TrendingUp, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BudgetPage() {
  const { expenses } = useExpenses()
  const { showToast } = useToast()

  const [budget, setBudget] = useState(2000)
  const [newBudget, setNewBudget] = useState("2000")
  const [isLoading, setIsLoading] = useState(false)

  ////////////////////////////////////////////////////
  // 🔢 CALCULATIONS (REAL DATA)
  ////////////////////////////////////////////////////

  const monthlySpend = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remainingBudget = budget - monthlySpend

  const spendPercentage =
    budget > 0 ? Math.min((monthlySpend / budget) * 100, 100) : 0

  const isOverBudget = remainingBudget < 0
  const isNearLimit = spendPercentage >= 80 && !isOverBudget

  ////////////////////////////////////////////////////
  // UPDATE BUDGET
  ////////////////////////////////////////////////////

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget)

    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid budget amount", "error")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setBudget(amount)
    setIsLoading(false)

    showToast("Budget updated successfully!", "success")
  }

  ////////////////////////////////////////////////////

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Budget</h2>
        <p className="text-muted-foreground">
          Set and track your monthly spending budget
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* SET BUDGET */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="size-5 text-primary" />
              Set Monthly Budget
            </CardTitle>
            <CardDescription>
              Define how much you want to spend this month
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
              />

              <Button onClick={handleUpdateBudget} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OVERVIEW */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Budget Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* PROGRESS */}
            <div>
              <p>
                ₹{monthlySpend.toFixed(2)} / ₹{budget.toFixed(2)}
              </p>

              <Progress value={spendPercentage} />

              <p className="text-xs">
                {spendPercentage.toFixed(1)}% used
              </p>
            </div>

            {/* STATUS */}
            <div
              className={cn(
                "p-4 rounded-lg",
                isOverBudget
                  ? "bg-red-100"
                  : isNearLimit
                  ? "bg-yellow-100"
                  : "bg-green-100"
              )}
            >
              {isOverBudget
                ? `Over budget by ₹${Math.abs(remainingBudget).toFixed(2)}`
                : `Remaining ₹${remainingBudget.toFixed(2)}`
              }
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}