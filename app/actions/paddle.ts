"use server"

// Server action to create Paddle checkout URL
export async function createPaddleCheckoutUrl(userId: string, userEmail: string) {
  console.log("[v0] Starting Paddle checkout creation for user:", userId, userEmail)

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snippetly.xyz"

    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "pri_01k5zjvykxzy0qfww05j76351c"

    if (!priceId) {
      throw new Error(
        "Paddle price ID not configured. Please add NEXT_PUBLIC_PADDLE_PRICE_ID to your environment variables.",
      )
    }

    console.log("[v0] Using price ID:", priceId)

    const checkoutParams = new URLSearchParams({
      customer_email: userEmail,
      "custom_data[user_id]": userId,
      "custom_data[plan_type]": "pro",
      success_url: `${siteUrl}/dashboard/upgrade/success`,
      cancel_url: `${siteUrl}/dashboard`,
    })

    // Use the correct Paddle checkout URL format
    const checkoutUrl = `https://buy.paddle.com/product/${priceId}?${checkoutParams.toString()}`

    console.log("[v0] Checkout URL created successfully:", checkoutUrl)
    return { success: true, checkoutUrl }
  } catch (error) {
    console.error("[v0] Error creating Paddle checkout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}
