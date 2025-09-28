"use server"

export async function createPaddleCheckoutUrl(userId: string, userEmail: string) {
  console.log("[v0] Creating direct Paddle checkout for user:", userId, userEmail)

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snippetly.xyz"

    const hostedCheckoutUrl = "https://pay.paddle.io/hsc_01k67f4hx53vfjgte0qgxfrqz9_67x2pq5w3fhfx5e547ymtbhcjst78qzq"

    const checkoutParams = new URLSearchParams({
      customer_email: userEmail,
      "custom_data[user_id]": userId,
      "custom_data[plan_type]": "pro",
      success_url: `${siteUrl}/dashboard/upgrade/success`,
      cancel_url: `${siteUrl}/dashboard`,
    })

    const checkoutUrl = `${hostedCheckoutUrl}?${checkoutParams.toString()}`

    console.log("[v0] Direct checkout URL created successfully:", checkoutUrl)
    return { success: true, checkoutUrl }
  } catch (error) {
    console.error("[v0] Error creating Paddle checkout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}
