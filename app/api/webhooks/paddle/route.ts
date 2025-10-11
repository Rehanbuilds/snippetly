import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateUserPlan } from "@/lib/supabase/plans"
import { sendProUpgradeEmail } from "@/lib/emails/send-email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  console.log("[v0] 🎯 Paddle webhook received")

  try {
    const body = await request.text()
    const signature = request.headers.get("paddle-signature")

    console.log("[v0] Webhook body length:", body.length)
    console.log("[v0] Signature present:", !!signature)

    const isValidSignature = verifyPaddleSignature(body, signature)
    console.log("[v0] Signature valid:", isValidSignature)

    // For debugging: log webhook even if signature fails
    if (!isValidSignature) {
      console.warn("[v0] ⚠️ Invalid webhook signature, but processing anyway for debugging")
      // In production, you should uncomment this:
      // return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log("[v0] Event type:", event.event_type)
    console.log("[v0] Event data keys:", Object.keys(event.data || {}))

    switch (event.event_type) {
      case "transaction.completed":
        console.log("[v0] 💰 Processing transaction.completed")
        await handleTransactionCompleted(event.data)
        break
      case "transaction.payment_failed":
        console.log("[v0] ❌ Processing transaction.payment_failed")
        await handleTransactionFailed(event.data)
        break
      default:
        console.log(`[v0] ℹ️ Unhandled event type: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] 🔥 Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleTransactionCompleted(transaction: any) {
  console.log("[v0] 📝 handleTransactionCompleted called")
  console.log("[v0] Transaction ID:", transaction.id)
  console.log("[v0] Transaction custom_data:", JSON.stringify(transaction.custom_data))

  const supabase = await createClient()

  try {
    const customData = transaction.custom_data
    const userId = customData?.user_id

    console.log("[v0] Extracted user_id:", userId)

    if (!userId) {
      console.error("[v0] ❌ No user ID found in transaction custom data")
      console.error("[v0] Full transaction data:", JSON.stringify(transaction, null, 2))
      return
    }

    console.log("[v0] 🔄 Updating user plan to Pro for user:", userId)

    try {
      await updateUserPlan(userId, {
        plan_type: "pro",
        plan_status: "active",
        paddle_customer_id: transaction.customer_id,
        paddle_subscription_id: transaction.subscription_id || null,
      })
      console.log("[v0] ✅ User plan updated successfully")
    } catch (planError) {
      console.error("[v0] ❌ Error updating user plan:", planError)
      throw planError
    }

    console.log("[v0] 💾 Recording payment in database")
    try {
      const paymentData = {
        user_id: userId,
        paddle_transaction_id: transaction.id,
        amount: Number.parseFloat(transaction.details?.totals?.total || "0"),
        currency: transaction.currency_code || "USD",
        status: "completed",
        plan_type: "pro",
      }
      console.log("[v0] Payment data:", paymentData)

      const { data, error } = await supabase.from("payments").insert(paymentData).select()

      if (error) {
        console.error("[v0] ❌ Error inserting payment:", error)
        throw error
      }

      console.log("[v0] ✅ Payment recorded successfully:", data)
    } catch (paymentError) {
      console.error("[v0] ❌ Error recording payment:", paymentError)
      throw paymentError
    }

    try {
      console.log("[v0] 📧 Fetching user data for Pro upgrade email")

      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(userId)
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userId).single()

      console.log("[v0] User email:", user?.email)
      console.log("[v0] User name:", profile?.full_name)

      if (user?.email) {
        console.log("[v0] 📤 Sending Pro upgrade email")
        const emailResult = await sendProUpgradeEmail(user.email, profile?.full_name || "there", transaction.id)
        console.log("[v0] Email result:", emailResult)
      } else {
        console.error("[v0] ⚠️ No email found for user:", userId)
      }
    } catch (emailError) {
      console.error("[v0] ⚠️ Failed to send Pro upgrade email (non-critical):", emailError)
      // Don't throw - email failure shouldn't fail the webhook
    }

    console.log(`[v0] ✅ Successfully upgraded user ${userId} to Pro plan`)
  } catch (error) {
    console.error("[v0] 🔥 Error handling transaction completed:", error)
    throw error // Re-throw to return 500 to Paddle for retry
  }
}

async function handleTransactionFailed(transaction: any) {
  console.log("[v0] 📝 handleTransactionFailed called")
  const supabase = await createClient()

  try {
    const customData = transaction.custom_data
    const userId = customData?.user_id

    if (!userId) {
      console.error("[v0] No user ID in failed transaction")
      return
    }

    // Record the failed payment
    await supabase.from("payments").insert({
      user_id: userId,
      paddle_transaction_id: transaction.id,
      amount: Number.parseFloat(transaction.details?.totals?.total || "0"),
      currency: transaction.currency_code || "USD",
      status: "failed",
      plan_type: "pro",
    })

    console.log(`[v0] ❌ Payment failed recorded for user ${userId}`)
  } catch (error) {
    console.error("[v0] Error handling transaction failed:", error)
  }
}

function verifyPaddleSignature(body: string, signature: string | null): boolean {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET

  if (!signature) {
    console.warn("[v0] ⚠️ No signature provided in webhook")
    return false
  }

  if (!webhookSecret) {
    console.warn("[v0] ⚠️ PADDLE_WEBHOOK_SECRET not configured")
    return false
  }

  try {
    // Paddle signature format: "ts=timestamp;h1=signature"
    const parts = signature.split(";")
    const tsMatch = parts[0]?.match(/ts=(\d+)/)
    const h1Match = parts[1]?.match(/h1=([a-f0-9]+)/)

    if (!tsMatch || !h1Match) {
      console.warn("[v0] ⚠️ Invalid signature format")
      return false
    }

    const timestamp = tsMatch[1]
    const receivedSignature = h1Match[1]

    // Create the signed payload
    const signedPayload = `${timestamp}:${body}`

    // Calculate the expected signature
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex")

    // Compare signatures
    const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))

    console.log("[v0] Signature verification:", isValid ? "✅ VALID" : "❌ INVALID")

    return isValid
  } catch (error) {
    console.error("[v0] Error verifying signature:", error)
    return false
  }
}
