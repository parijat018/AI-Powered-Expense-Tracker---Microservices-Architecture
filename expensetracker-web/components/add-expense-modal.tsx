"use client"

import { useState } from "react"
import { useExpenses } from "@/lib/expense-context"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  "Food",
  "Shopping",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
]

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    note: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { addExpense } = useExpenses()
  const { showToast } = useToast()

  ////////////////////////////////////////////////////
  // VALIDATION
  ////////////////////////////////////////////////////
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount"
    }

    if (!formData.category) {
      newErrors.category = "Select a category"
    }

    if (!formData.note.trim()) {
      newErrors.note = "Add a note"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  ////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await addExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        note: formData.note,
        date: new Date().toISOString(), // UI only
      })

      showToast("Expense added successfully!", "success")

      // RESET FORM
      setFormData({
        amount: "",
        category: "",
        note: "",
      })

      setErrors({})
      onOpenChange(false)

    } catch {
      showToast("Failed to add expense", "error")
    } finally {
      setIsLoading(false)
    }
  }

  ////////////////////////////////////////////////////
  // INPUT HANDLER (CLEAR ERRORS)
  ////////////////////////////////////////////////////
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {/* AMOUNT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₹)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => updateField("amount", e.target.value)}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value: string) => updateField("category", value)}
            >
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* NOTE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>
            <Input
              placeholder="What was this expense for?"
              value={formData.note}
              onChange={(e) => updateField("note", e.target.value)}
              className={errors.note ? "border-destructive" : ""}
            />
            {errors.note && (
              <p className="text-xs text-destructive">{errors.note}</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}