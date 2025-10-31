import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Snippetly – Save, Organize & Share Code Snippets",
    template: "%s | Snippetly",
  },
  description:
    "Snippetly helps developers and teams capture, organize, and share code snippets instantly. Build your personal snippet vault with tags, search, and sharing for faster workflows and better collaboration.",
  generator: "v0.app",
  verification: {
    google: "x9BTAQ3mXrilyVOaXnRDOpRr7Giu6EDXKCaLjGQB6WM",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
