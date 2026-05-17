"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles } from "lucide-react"
import { sendMessageToDS } from "@/lib/api"
import { useExpenses } from "@/lib/expense-context"
import { useToast } from "@/components/toast-provider"

export function AIExpenseInput() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { refreshExpenses, expenses } = useExpenses()
  const { showToast } = useToast()

  ////////////////////////////////////////////////////
  // 🔁 FIXED POLLING (USES RETURNED DATA)
  ////////////////////////////////////////////////////
  const waitForNewExpense = async (prevCount: number) => {
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 1500))

      await refreshExpenses() // ✅ IMPORTANT

      if (expenses.length > prevCount) {
        return true
      }
    }
    return false
  }

  ////////////////////////////////////////////////////
  // 🚀 SEND MESSAGE
  ////////////////////////////////////////////////////
  const handleSend = async () => {
    if (!message.trim()) return

    const prevCount = expenses.length
    setLoading(true)

    try {
      await sendMessageToDS(message)

      showToast("🤖 AI is analyzing your message...", "success")

      const success = await waitForNewExpense(prevCount)

      if (success) {
        showToast("✅ Expense added from AI!", "success")
      } else {
        showToast("⚠️ Still processing… check again shortly", "error")
      }

      setMessage("")
    } catch (err) {
      console.error(err)
      showToast("❌ Failed to process message", "error")
    }

    setLoading(false)
  }

  ////////////////////////////////////////////////////

  return (
    <div className="flex gap-2">
      <Input
        placeholder="e.g. Spent 500 on food"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
      />

      <Button onClick={handleSend} disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Sparkles className="mr-2 size-4" />
            AI Add
          </>
        )}
      </Button>
    </div>
  )
}