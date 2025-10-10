import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = "Snippetly <hello@snippetly.xyz>"
export const SUPPORT_EMAIL = "hello@snippetly.xyz"
