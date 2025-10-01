import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import GAListener from "@/components/ga"
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script
          id="ga-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QXTV38Q06W"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QXTV38Q06W', { send_page_view: true });
        `}</Script>

        <Suspense fallback={null}>{children}</Suspense>

        <GAListener />

        <Analytics />
      </body>
    </html>
  )
}
