"use server"

// Server action to create Paddle checkout URL
export async function createPaddleCheckoutUrl(userId: string, userEmail: string) {
  console.log("[v0] Starting Paddle checkout creation for user:", userId, userEmail)

  try {
    // Check if API key exists
    if (!process.env.PADDLE_API_KEY) {
      console.error("[v0] PADDLE_API_KEY is not set")
      return { success: false, error: "Paddle API key not configured" }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snippetly.xyz"
    console.log("[v0] Using site URL:", siteUrl)

    console.log("[v0] Making request to Paddle API...")

    // Import Paddle server SDK
    const response = await fetch("https://api.paddle.com/checkout-sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            price_id: "pri_01k5zjvykxzy0qfww05j76351c",
            quantity: 1,
          },
        ],
        customer_email: userEmail,
        custom_data: {
          user_id: userId,
          plan_type: "pro",
        },
        success_url: `${siteUrl}/dashboard/upgrade/success`,
        cancel_url: `${siteUrl}/dashboard/upgrade/failed`,
      }),
    })

    console.log("[v0] Paddle API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Paddle API error response:", errorText)
      throw new Error(`Paddle API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Paddle API success response:", data)

    if (!data.data || !data.data.url) {
      console.error("[v0] Invalid response structure from Paddle:", data)
      return { success: false, error: "Invalid response from Paddle API" }
    }

    console.log("[v0] Checkout URL created successfully:", data.data.url)
    return { success: true, checkoutUrl: data.data.url }
  } catch (error) {
    console.error("[v0] Error creating Paddle checkout:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create checkout session" }
  }
}
