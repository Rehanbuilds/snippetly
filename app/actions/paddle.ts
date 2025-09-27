"use server"

// Server action to create Paddle checkout URL
export async function createPaddleCheckoutUrl(userId: string, userEmail: string) {
  console.log("[v0] Starting Paddle checkout creation for user:", userId, userEmail)

  try {
    // This approach doesn't require special API permissions and works with basic Paddle setup
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snippetly.xyz"

    // Create checkout URL using Paddle's hosted checkout with query parameters
    // This is the recommended approach for simple checkouts
    const priceId = "pri_01k5zjvykxzy0qfww05j76351c" // Your Paddle price ID

    const checkoutParams = new URLSearchParams({
      "items[0][price_id]": priceId,
      "items[0][quantity]": "1",
      customer_email: userEmail,
      "custom_data[user_id]": userId,
      "custom_data[plan_type]": "pro",
      success_url: `${siteUrl}/dashboard/upgrade/success`,
      cancel_url: `${siteUrl}/dashboard`,
    })

    // Use Paddle's hosted checkout URL format
    const checkoutUrl = `https://buy.paddle.com/checkout?${checkoutParams.toString()}`

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
