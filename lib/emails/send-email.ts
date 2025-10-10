"use server"

import { resend, EMAIL_FROM } from "@/lib/resend"
import { WelcomeEmail } from "./templates/welcome-email"
import { ProUpgradeEmail } from "./templates/pro-upgrade-email"

export async function sendWelcomeEmail(to: string, userName: string, dashboardUrl = "https://snippetly.xyz/dashboard") {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Welcome to Snippetly! 🎉",
      react: WelcomeEmail({ userName, dashboardUrl }),
    })

    if (error) {
      console.error("[Resend] Error sending welcome email:", error)
      return { success: false, error: error.message }
    }

    console.log("[Resend] Welcome email sent successfully:", data?.id)
    return { success: true, data }
  } catch (error) {
    console.error("[Resend] Failed to send welcome email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendProUpgradeEmail(
  to: string,
  userName: string,
  transactionId: string,
  dashboardUrl = "https://snippetly.xyz/dashboard",
) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Welcome to Snippetly Pro! 🚀",
      react: ProUpgradeEmail({ userName, transactionId, dashboardUrl }),
    })

    if (error) {
      console.error("[Resend] Error sending Pro upgrade email:", error)
      return { success: false, error: error.message }
    }

    console.log("[Resend] Pro upgrade email sent successfully:", data?.id)
    return { success: true, data }
  } catch (error) {
    console.error("[Resend] Failed to send Pro upgrade email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

// Generic email sender for custom use cases
export async function sendCustomEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("[Resend] Error sending custom email:", error)
      return { success: false, error: error.message }
    }

    console.log("[Resend] Custom email sent successfully:", data?.id)
    return { success: true, data }
  } catch (error) {
    console.error("[Resend] Failed to send custom email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
