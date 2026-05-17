"use client"

import { useState } from "react"
import { useExpenses } from "@/lib/expense-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { getInsights } from "@/lib/api"

//////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////

interface Insight {
  id: string
  type: "warning" | "positive" | "tip" | "neutral"
  title: string
  description: string
  icon: LucideIcon
}

//////////////////////////////////////////////////
// PAGE
//////////////////////////////////////////////////

export default function InsightsPage() {
  const { expenses } = useExpenses()

  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])

  ////////////////////////////////////////////////////
  // 🔥 MONTHLY CALCULATION (FIXED)
  ////////////////////////////////////////////////////

  const budget = 2000

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlySpend = expenses
    .filter((e) => {
      const d = new Date(e.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, e) => sum + e.amount, 0)

  ////////////////////////////////////////////////////
  // 🔥 GENERATE INSIGHTS
  ////////////////////////////////////////////////////

  const generateInsights = async () => {
    setIsLoading(true)

    try {
      //////////////////////////////////////////////////
      // ✅ TRY DS SERVICE (IF AVAILABLE)
      //////////////////////////////////////////////////
      const data = await getInsights({
        expenses,
        monthlySpend,
        budget,
      })

      //////////////////////////////////////////////////
      // ✅ MAP RESPONSE
      //////////////////////////////////////////////////
      const mapped = Array.isArray(data)
        ? data.map((i: any, index: number) => ({
            id: index.toString(),
            type: i.type || "neutral",
            title: i.title,
            description: i.description,
            icon:
              i.type === "warning"
                ? AlertCircle
                : i.type === "positive"
                ? TrendingUp
                : i.type === "tip"
                ? Lightbulb
                : TrendingDown,
          }))
        : generateLocalInsights()

      setInsights(mapped)

    } catch (err) {
      //////////////////////////////////////////////////
      // 🔁 FALLBACK (VERY IMPORTANT)
      //////////////////////////////////////////////////
      console.error("❌ DS failed → using local insights:", err)
      setInsights(generateLocalInsights())
    }

    setIsLoading(false)
  }

  ////////////////////////////////////////////////////
  // 🔥 LOCAL INSIGHTS (SMART FALLBACK)
  ////////////////////////////////////////////////////

  const generateLocalInsights = (): Insight[] => {
    const categoryTotals: Record<string, number> = {}

    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + e.amount
    })

    const sortedCategories = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )

    const topCategory = sortedCategories[0] as [string, number] | undefined

    const budgetUsage = budget > 0 ? (monthlySpend / budget) * 100 : 0

    return [
      {
        id: "1",
        type: budgetUsage > 80 ? "warning" : "positive",
        title: budgetUsage > 80 ? "Budget Alert" : "Budget Healthy",
        description: `You used ${budgetUsage.toFixed(0)}% of your monthly budget`,
        icon: budgetUsage > 80 ? AlertCircle : TrendingUp,
      },
      {
        id: "2",
        type: "tip",
        title: `Top Spending: ${topCategory?.[0] || "N/A"}`,
        description: topCategory
          ? `${topCategory[0]} is highest at ₹${topCategory[1].toFixed(2)}`
          : "Add expenses to analyze",
        icon: Lightbulb,
      },
      {
        id: "3",
        type: "neutral",
        title: "Expense Summary",
        description: `Total ₹${monthlySpend.toFixed(2)} across ${expenses.length} transactions`,
        icon: TrendingDown,
      },
    ]
  }

  ////////////////////////////////////////////////////
  // 🎨 STYLES
  ////////////////////////////////////////////////////

  const getInsightStyles = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return { bg: "bg-red-100", icon: "text-red-500" }
      case "positive":
        return { bg: "bg-green-100", icon: "text-green-500" }
      case "tip":
        return { bg: "bg-yellow-100", icon: "text-yellow-500" }
      default:
        return { bg: "bg-gray-100", icon: "text-gray-500" }
    }
  }

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Insights</h2>
          <p className="text-muted-foreground">
            Smart analysis of your spending
          </p>
        </div>

        <Button onClick={generateInsights} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      {/* CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>
            AI-powered recommendations
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto" />
              <p>Analyzing...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {insights.map((insight) => {
                const styles = getInsightStyles(insight.type)

                return (
                  <div
                    key={insight.id}
                    className={cn("p-4 rounded-lg", styles.bg)}
                  >
                    <div className="flex gap-3">
                      <div className={styles.icon}>
                        <insight.icon />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {insight.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}