import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateUserPlan } from "@/lib/supabase/plans"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("paddle-signature")

    // Verify webhook signature (implement based on Paddle's documentation)
    if (!verifyPaddleSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.event_type) {
      case "transaction.completed":
        await handleTransactionCompleted(event.data)
        break
      case "transaction.payment_failed":
        await handleTransactionFailed(event.data)
        break
      default:
        console.log(`Unhandled event type: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleTransactionCompleted(transaction: any) {
  const supabase = await createClient()

  try {
    // Extract user ID from custom data
    const customData = transaction.custom_data
    const userId = customData?.user_id

    if (!userId) {
      console.error("No user ID found in transaction custom data")
      return
    }

    // Update user plan to Pro
    await updateUserPlan(userId, {
      plan_type: "pro",
      plan_status: "active",
      paddle_customer_id: transaction.customer_id,
      paddle_subscription_id: transaction.subscription_id,
    })

    // Record the payment
    await supabase.from("payments").insert({
      user_id: userId,
      paddle_transaction_id: transaction.id,
      amount: Number.parseFloat(transaction.details.totals.total),
      currency: transaction.currency_code,
      status: "completed",
      plan_type: "pro",
    })

    console.log(`Successfully upgraded user ${userId} to Pro plan`)
  } catch (error) {
    console.error("Error handling transaction completed:", error)
  }
}

async function handleTransactionFailed(transaction: any) {
  const supabase = await createClient()

  try {
    const customData = transaction.custom_data
    const userId = customData?.user_id

    if (!userId) return

    // Record the failed payment
    await supabase.from("payments").insert({
      user_id: userId,
      paddle_transaction_id: transaction.id,
      amount: Number.parseFloat(transaction.details.totals.total),
      currency: transaction.currency_code,
      status: "failed",
      plan_type: "pro",
    })

    console.log(`Payment failed for user ${userId}`)
  } catch (error) {
    console.error("Error handling transaction failed:", error)
  }
}

function verifyPaddleSignature(body: string, signature: string | null): boolean {
  // Implement Paddle signature verification
  // This is a placeholder - implement according to Paddle's documentation
  if (!signature || !process.env.PADDLE_WEBHOOK_SECRET) {
    return false
  }

  // Add actual signature verification logic here
  return true
}
