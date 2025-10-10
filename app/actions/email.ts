"use server"

import { sendWelcomeEmail as sendWelcome, sendProUpgradeEmail as sendProUpgrade } from "@/lib/emails/send-email"

export async function sendWelcomeEmailAction(email: string, name: string) {
  console.log("[v0] sendWelcomeEmailAction called")
  console.log("[v0] Email:", email)
  console.log("[v0] Name:", name)
  console.log("[v0] Environment check - RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)

  if (!email || !name) {
    console.error("[v0] Missing required parameters")
    return {
      success: false,
      error: "Email and name are required",
    }
  }

  try {
    console.log("[v0] Calling sendWelcome function...")
    const result = await sendWelcome(email, name)
    console.log("[v0] sendWelcomeEmailAction result:", JSON.stringify(result, null, 2))

    if (!result) {
      console.error("[v0] sendWelcome returned undefined!")
      return {
        success: false,
        error: "Email function returned undefined",
      }
    }

    return result
  } catch (error) {
    console.error("[v0] sendWelcomeEmailAction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendProUpgradeEmailAction(email: string, name: string, transactionId: string) {
  console.log("[v0] sendProUpgradeEmailAction called with:", { email, name, transactionId })

  try {
    const result = await sendProUpgrade(email, name, transactionId)
    console.log("[v0] sendProUpgradeEmailAction result:", result)
    return result
  } catch (error) {
    console.error("[v0] sendProUpgradeEmailAction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
