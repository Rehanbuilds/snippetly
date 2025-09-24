"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Search, Share, Star, Zap, Users, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Code className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Snippetly</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Home
              </button>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Pricing
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up Free</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-foreground hover:text-primary hover:bg-muted"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left"
                >
                  Home
                </button>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <button
                  onClick={() => scrollToSection("features")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left"
                >
                  Pricing
                </button>
                <div className="border-t border-border pt-4 mt-4">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full mb-2">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Your personal snippet vault never lose a line of code again
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Save, organize, and share code in seconds. The ultimate tool for developers, students, and professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              View Demo
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heropic.PNG-uqKbwKpHQtLxfuIa1xtTidbmLRQ6pc.png"
                alt="Snippetly Dashboard Preview - Manage and organize your code snippets"
                className="w-full h-auto rounded-lg border border-gray-200 shadow-2xl shadow-gray-500/20 backdrop-blur-sm"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
                }}
              />
              {/* Subtle overlay for better visual integration */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Stop losing your code snippets</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Tired of searching through old projects, scattered files, and bookmarks to find that perfect piece of
                code? We've all been there - spending more time looking for snippets than actually coding.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Zap className="h-5 w-5 mr-3 text-primary" />
                  <span>Instant search across all your snippets</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-primary" />
                  <span>Organize with tags and favorites</span>
                </li>
                <li className="flex items-center">
                  <Share className="h-5 w-5 mr-3 text-primary" />
                  <span>Share snippets with your team</span>
                </li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-muted p-4 rounded font-mono text-sm">
                <div className="text-muted-foreground mb-2">// Before Snippetly</div>
                <div className="text-destructive">❌ Lost in scattered files</div>
                <div className="text-destructive">❌ No organization system</div>
                <div className="text-destructive">❌ Hard to share with team</div>
                <div className="text-muted-foreground mt-4 mb-2">// After Snippetly</div>
                <div className="text-green-600">✅ Centralized snippet vault</div>
                <div className="text-green-600">✅ Smart tagging & search</div>
                <div className="text-green-600">✅ Easy sharing & collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage code snippets</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your development workflow more efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Save Snippets</CardTitle>
                <CardDescription>
                  Quickly save code snippets with syntax highlighting for 100+ languages
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Smart Search</CardTitle>
                <CardDescription>
                  Find any snippet instantly with powerful search across titles, tags, and code content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Organize</CardTitle>
                <CardDescription>
                  Tag snippets, mark favorites, and filter by language for perfect organization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Share className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Share & Collaborate</CardTitle>
                <CardDescription>Share snippets with your team or make them public for the community</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Built for speed - save, search, and copy snippets in milliseconds</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Team Ready</CardTitle>
                <CardDescription>Perfect for individual developers and teams of any size</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Screenshots/Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See Snippetly in action</h2>
            <p className="text-lg text-muted-foreground">A clean, intuitive interface designed for developers</p>
          </div>

          <div className="bg-card rounded-lg border p-8 max-w-4xl mx-auto">
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <Badge variant="secondary">Dashboard Preview</Badge>
              </div>
              <div className="bg-background rounded p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">// React Hook Example</div>
                <div>
                  <span className="text-blue-600">const</span>{" "}
                  <span>useLocalStorage = (key, initialValue) =&gt; {"{"}</span>
                </div>
                <div className="ml-4">
                  <div>
                    <span className="text-blue-600">const</span>{" "}
                    <span>[storedValue, setStoredValue] = useState(() =&gt; {"{"}</span>
                  </div>
                  <div className="ml-4 text-muted-foreground">// Implementation...</div>
                  <div>{"})"}</div>
                </div>
                <div>{"};"}</div>
                <div className="mt-4 flex items-center space-x-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Hooks</Badge>
                  <Badge variant="outline">localStorage</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">
                  $0<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Code className="h-4 w-4 mr-3 text-green-600" />
                    <span>Up to 100 snippets</span>
                  </li>
                  <li className="flex items-center">
                    <Search className="h-4 w-4 mr-3 text-green-600" />
                    <span>Full search functionality</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 mr-3 text-green-600" />
                    <span>Tags and favorites</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For power users and teams</CardDescription>
                <div className="text-3xl font-bold">
                  $9<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Code className="h-4 w-4 mr-3 text-green-600" />
                    <span>Unlimited snippets</span>
                  </li>
                  <li className="flex items-center">
                    <Share className="h-4 w-4 mr-3 text-green-600" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-3 text-green-600" />
                    <span>Advanced features</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 mr-2" />
                <span className="text-lg font-bold">Snippetly</span>
              </div>
              <p className="text-muted-foreground">Your personal snippet vault for better code management.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Snippetly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
