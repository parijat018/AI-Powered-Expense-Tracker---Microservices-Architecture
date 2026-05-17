"use client"

import { useState } from "react"
import { useExpenses } from "@/lib/expense-context"
import { useToast } from "@/components/toast-provider"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Receipt } from "lucide-react"

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const { expenses, loading } = useExpenses()
  const { showToast } = useToast()

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground">
            Manage and track all your expenses
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Expense
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>

        <CardContent>

          {/* 🔄 LOADING */}
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : expenses.length === 0 ? (

            <div className="text-center py-10">
              <Receipt className="mx-auto mb-3" />
              <p>No expenses yet</p>
            </div>

          ) : (

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>

                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{expense.note}</TableCell>

                    <TableCell>{expense.category}</TableCell>

                    <TableCell className="text-right text-red-500">
                      ₹{expense.amount}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

          )}

        </CardContent>
      </Card>

      <AddExpenseModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}