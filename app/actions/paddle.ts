"use server"

// Server action to create Paddle checkout URL
export async function createPaddleCheckoutUrl(userId: string, userEmail: string) {
  try {
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
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/upgrade/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/upgrade/failed`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, checkoutUrl: data.data.url }
  } catch (error) {
    console.error("Error creating Paddle checkout:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}
