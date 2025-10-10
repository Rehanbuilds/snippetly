"use server"

import { sendWelcomeEmail as sendWelcome, sendProUpgradeEmail as sendProUpgrade } from "@/lib/emails/send-email"

export async function sendWelcomeEmailAction(email: string, name: string) {
  console.log("[v0] sendWelcomeEmailAction called with:", { email, name })

  try {
    const result = await sendWelcome(email, name)
    console.log("[v0] sendWelcomeEmailAction result:", result)
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
