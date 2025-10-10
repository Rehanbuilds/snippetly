import { getResend, EMAIL_FROM } from "@/lib/resend"
import { WelcomeEmail } from "./templates/welcome-email"
import { ProUpgradeEmail } from "./templates/pro-upgrade-email"

export async function sendWelcomeEmail(to: string, userName: string, dashboardUrl = "https://snippetly.xyz/dashboard") {
  console.log("[v0 Resend] Attempting to send welcome email to:", to)
  console.log("[v0 Resend] From address:", EMAIL_FROM)
  console.log("[v0 Resend] API Key exists:", !!process.env.RESEND_API_KEY)

  try {
    const resend = getResend()
    console.log("[v0 Resend] Resend client initialized successfully")

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Welcome to Snippetly! 🎉",
      react: WelcomeEmail({ userName, dashboardUrl }),
    })

    if (error) {
      console.error("[v0 Resend] Error sending welcome email:", error)
      return { success: false as const, error: error.message }
    }

    console.log("[v0 Resend] Welcome email sent successfully:", data?.id)
    return { success: true as const, data }
  } catch (error) {
    console.error("[v0 Resend] Failed to send welcome email:", error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

export async function sendProUpgradeEmail(
  to: string,
  userName: string,
  transactionId: string,
  dashboardUrl = "https://snippetly.xyz/dashboard",
) {
  try {
    const resend = getResend()

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Welcome to Snippetly Pro! 🚀",
      react: ProUpgradeEmail({ userName, transactionId, dashboardUrl }),
    })

    if (error) {
      console.error("[v0 Resend] Error sending Pro upgrade email:", error)
      return { success: false as const, error: error.message }
    }

    console.log("[v0 Resend] Pro upgrade email sent successfully:", data?.id)
    return { success: true as const, data }
  } catch (error) {
    console.error("[v0 Resend] Failed to send Pro upgrade email:", error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

export async function sendCustomEmail(to: string, subject: string, html: string) {
  try {
    const resend = getResend()

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("[v0 Resend] Error sending custom email:", error)
      return { success: false as const, error: error.message }
    }

    console.log("[v0 Resend] Custom email sent successfully:", data?.id)
    return { success: true as const, data }
  } catch (error) {
    console.error("[v0 Resend] Failed to send custom email:", error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
