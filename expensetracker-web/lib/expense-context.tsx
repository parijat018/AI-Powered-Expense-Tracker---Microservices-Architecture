"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import {
  getExpenses as apiGetExpenses,
  addExpense as apiAddExpense,
} from "./api"

//////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  note: string
  source?: "manual" | "ds" // ✅ FIXED
}

interface ExpenseContextType {
  expenses: Expense[]
  loading: boolean
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  refreshExpenses: () => Promise<void>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

//////////////////////////////////////////////////
// PROVIDER
//////////////////////////////////////////////////

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  ////////////////////////////////////////////////////
  // 🔄 FETCH
  ////////////////////////////////////////////////////
  const fetchExpenses = async () => {
    try {
      setLoading(true)

      const data = await apiGetExpenses()

      const mapped: Expense[] = Array.isArray(data)
        ? data.map((item: any, index: number) => ({
            id: item.externalId || `${item.amount}-${index}`, // safer fallback
            amount: item.amount,
            category: item.merchant || "General",
            note: item.merchant || "Expense",
            date: item.createdAt || new Date().toISOString(),

            // 🔥 AI vs manual detection
            source: item.externalId ? "ds" : "manual",
          }))
        : []

      ////////////////////////////////////////////////////
      // 🧹 REMOVE DUPLICATES
      ////////////////////////////////////////////////////
      const uniqueMap = new Map()
      mapped.forEach((e) => {
        uniqueMap.set(e.id, e)
      })

      const uniqueExpenses = Array.from(uniqueMap.values())

      ////////////////////////////////////////////////////
      // 🔽 SORT (LATEST FIRST)
      ////////////////////////////////////////////////////
      uniqueExpenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      setExpenses(uniqueExpenses)

    } catch (err) {
      console.error("❌ Fetch failed:", err)
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  ////////////////////////////////////////////////////
  // ➕ ADD (MANUAL)
  ////////////////////////////////////////////////////
  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const res = await apiAddExpense(expense)

      if (res === true) {
        await fetchExpenses()
      } else {
        throw new Error("Add failed")
      }
    } catch (err) {
      console.error("❌ Add failed:", err)
    }
  }

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////
  useEffect(() => {
    fetchExpenses()
  }, [])

  ////////////////////////////////////////////////////

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        refreshExpenses: fetchExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

//////////////////////////////////////////////////
// HOOK
//////////////////////////////////////////////////

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error("useExpenses must be used within ExpenseProvider")
  }
  return context
}