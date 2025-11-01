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
    default: "Snippetly – Save, Organize & Share Code Snippets Instantly",
    template: "%s | Snippetly",
  },
  description:
    "Stop losing your best code! Snippetly is the ultimate code snippet manager for developers. Save, organize, and find your code snippets in seconds. Free forever with 50 snippets. Join 10,000+ developers building their personal code vault.",
  keywords: [
    "code snippet manager",
    "save code snippets",
    "organize code",
    "developer tools",
    "code vault",
    "snippet organizer",
    "code library",
    "programming snippets",
    "developer productivity",
    "code management",
    "snippet storage",
    "code repository",
    "developer workflow",
    "code sharing",
    "syntax highlighting",
  ],
  authors: [{ name: "Snippetly Team" }],
  creator: "Snippetly",
  publisher: "Snippetly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.app",
  verification: {
    google: "x9BTAQ3mXrilyVOaXnRDOpRr7Giu6EDXKCaLjGQB6WM",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  // Open Graph metadata for social sharing (Variation 1: Developer-focused)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.snippetly.xyz",
    siteName: "Snippetly",
    title: "Snippetly – Your Personal Code Snippet Vault | Never Lose Code Again",
    description:
      "The #1 code snippet manager trusted by 10,000+ developers. Save, organize, and search your code snippets instantly. Free forever with 50 snippets. Start building your code library today!",
    images: [
      {
        url: "https://www.snippetly.xyz/images/snippetly-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Snippetly Dashboard - Code Snippet Manager",
      },
    ],
  },
  // Twitter Card metadata (Variation 2: Productivity-focused)
  twitter: {
    card: "summary_large_image",
    site: "@snippetly_xyz",
    creator: "@snippetly_xyz",
    title: "10X Your Coding Speed with Snippetly | Free Code Snippet Manager",
    description:
      "Stop wasting time searching for code! Snippetly helps you save, organize, and reuse your best code snippets. Lightning-fast search, smart tags, and instant copy. Free to start!",
    images: ["https://www.snippetly.xyz/images/snippetly-dashboard.png"],
  },
  // Additional metadata for better SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.snippetly.xyz",
  },
  category: "technology",
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
