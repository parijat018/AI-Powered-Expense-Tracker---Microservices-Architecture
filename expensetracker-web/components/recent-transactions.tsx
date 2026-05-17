"use client"

import { useExpenses } from "@/lib/expense-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Utilities: Zap,
  Entertainment: Film,
  Health: Heart,
}

const categoryColors: Record<string, string> = {
  Food: "bg-chart-4/10 text-chart-4",
  Shopping: "bg-chart-1/10 text-chart-1",
  Transport: "bg-chart-2/10 text-chart-2",
  Utilities: "bg-chart-3/10 text-chart-3",
  Entertainment: "bg-chart-5/10 text-chart-5",
  Health: "bg-primary/10 text-primary",
}

export function RecentTransactions() {
  const { expenses } = useExpenses()
  const recentExpenses = expenses.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <a
          href="/dashboard/expenses"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No transactions yet
            </p>
          ) : (
            recentExpenses.map((expense) => {
              const Icon = categoryIcons[expense.category] || MoreHorizontal
              const colorClass = categoryColors[expense.category] || "bg-muted text-muted-foreground"
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg",
                        colorClass
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{expense.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-destructive">
                    -${expense.amount.toFixed(2)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
