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

    const paddleApiUrl = "https://api.paddle.com/transactions"

    const requestBody = {
      items: [
        {
          price: {
            id: "pri_01k5zjvykxzy0qfww05j76351c", // Replace with your actual Paddle price ID
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      custom_data: {
        user_id: userId,
        plan_type: "pro",
      },
      checkout: {
        url: `${siteUrl}/dashboard/upgrade/success`,
      },
      collection_mode: "automatic",
    }

    console.log("[v0] Request body:", JSON.stringify(requestBody, null, 2))
    console.log("[v0] API Key (first 10 chars):", process.env.PADDLE_API_KEY?.substring(0, 10))
    console.log("[v0] Making request to Paddle API...")

    const response = await fetch(paddleApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
        "Paddle-Version": "1",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Paddle API response status:", response.status)
    console.log("[v0] Paddle API response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("[v0] Paddle API raw response:", responseText)

    if (!response.ok) {
      console.error("[v0] Paddle API error response:", responseText)

      let errorMessage = `Paddle API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(responseText)
        if (errorData.error && errorData.error.detail) {
          errorMessage = errorData.error.detail
        } else if (errorData.error && errorData.error.code) {
          errorMessage = `${errorData.error.code}: ${errorData.error.detail || errorData.error.message || "Unknown error"}`
        } else if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].detail || errorData.errors[0].message
        }
      } catch (parseError) {
        console.error("[v0] Could not parse error response:", parseError)
      }

      return { success: false, error: errorMessage }
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] Could not parse success response:", parseError)
      return { success: false, error: "Invalid response format from Paddle API" }
    }

    console.log("[v0] Paddle API success response:", data)

    if (!data || !data.data || !data.data.checkout || !data.data.checkout.url) {
      console.error("[v0] Invalid response structure from Paddle:", data)
      return {
        success: false,
        error: "Invalid response from Paddle API - missing checkout URL",
      }
    }

    console.log("[v0] Checkout URL created successfully:", data.data.checkout.url)
    return { success: true, checkoutUrl: data.data.checkout.url }
  } catch (error) {
    console.error("[v0] Error creating Paddle checkout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}
