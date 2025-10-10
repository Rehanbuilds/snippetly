import { Resend } from "resend"

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables")
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }

  return resendInstance
}

// For backward compatibility
export const resend = new Proxy({} as Resend, {
  get(target, prop) {
    return getResend()[prop as keyof Resend]
  },
})

export const EMAIL_FROM = "Snippetly <hello@snippetly.xyz>"
export const SUPPORT_EMAIL = "hello@snippetly.xyz"
