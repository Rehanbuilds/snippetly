"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Search, Share, Star, Zap, Users, Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SnippetlyLogo } from "@/components/snippetly-logo"

const SectionTag = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
    <span
      className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse"
      aria-hidden="true"
    />
    {label}
  </span>
)

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "How does Snippetly work?",
      answer:
        "Snippetly is a simple yet powerful code snippet manager. You can save code snippets with syntax highlighting, organize them with tags, search through your collection instantly, and share them with your team. It's designed to be your personal vault for all your useful code pieces.",
    },
    {
      question: "Is there a limit to how many snippets I can save?",
      answer:
        "The free plan allows up to 50 snippets, which is perfect for getting started. Our Pro plan offers unlimited snippets along with advanced features and collaboration tools coming soon.",
    },
    {
      question: "What programming languages are supported?",
      answer:
        "Snippetly supports syntax highlighting for up to 50 programming languages including JavaScript, Python, Java, C++, HTML, CSS, SQL, and many more. We're constantly adding support for new languages based on user feedback.",
    },
    {
      question: "Can I share my snippets with others?",
      answer:
        "Yes! You can easily share your snippets with export options and export to multiple formats. You can also share individual snippets or collections with your team members for seamless collaboration.",
    },
    {
      question: "What is your pricing and refund policy?",
      answer:
        "We offer a free plan with up to 50 snippets and full search functionality. Our Pro plan is available and you can easily upgrade to get unlimited snippets and advanced features. Please note that we currently offer one-time pricing and do not support refunds yet, but we're working on implementing a more flexible refund policy.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <SnippetlyLogo href="/" />

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
          <SectionTag label="Hero" />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Your personal snippet vault never lose a line of code again
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Save, organize, and share code in seconds. The ultimate tool for developers, students, and professionals.
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6 bg-transparent">
              View Demo
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              <img
                src="/images/snippetly-dashboard.png"
                alt="Snippetly Dashboard Preview - Manage and organize your code snippets"
                className="w-full h-auto rounded-2xl border border-white/20 shadow-2xl shadow-black/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
                  backdropFilter: "blur(10px)",
                }}
              />
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/5 to-transparent pointer-events-none" />
              {/* Transparent border effect */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <SectionTag label="Problem & Solution" />
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
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-background rounded p-4 font-mono text-sm">
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
        </div>
      </section>

      {/* Features Highlights */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="mb-2 flex justify-center">
              <SectionTag label="Feature" />
            </div>
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
                  Quickly save code snippets with syntax highlighting for up to 50 languages
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

            <Card className="relative">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              </div>
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
            <div className="mb-2 flex justify-center">
              <SectionTag label="Demo video" />
            </div>
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
          <div className="mb-2 flex justify-center">
            <SectionTag label="Pricing" />
          </div>
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
                    <span>Up to 50 snippets</span>
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
                  $9<span className="text-lg font-normal text-muted-foreground"> one time</span>
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
                    <span>Team collaboration (coming soon)</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-3 text-green-600" />
                    <span>Advanced features</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Builder behind this Product. */}
      <section id="builder" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-10 text-center">
            <div className="mb-2 flex justify-center">
              <SectionTag label="Founder" />
            </div>
            <div className="mb-2 flex justify-center">
              <SectionTag label="Builder behind this Product" />
            </div>
            <h2 className="text-3xl font-bold text-balance">Mr Rehan</h2>
          </div>

          <div className="bg-card rounded-lg border p-8 max-w-4xl mx-auto">
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold">Mr Rehan</h3>
                  <p className="text-sm text-muted-foreground mb-4">Entrepreneur / Product Engineer</p>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Learning and building SaaS products and sharing build in public journey. From concept to deployment,
                    I focus on creating scalable solutions that deliver real value, while sharing my journey to inspire
                    other builders and founders.
                  </p>

                  <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
                    <a
                      href="https://x.com/MRehan_5"
                      aria-label="X (Twitter) - Builder profile"
                      className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 hover:text-gray-800"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/Rehanbuilds"
                      aria-label="GitHub - Builder profile"
                      className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 hover:text-gray-800"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/muhammad-rehan-575908378"
                      aria-label="LinkedIn - Builder profile"
                      className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 hover:text-gray-800"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7 0h3.84v2.11h.05c.53-1 1.83-2.11 3.76-2.11 4.02 0 4.76 2.65 4.76 6.1V24h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V24h-4V8.5z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="justify-self-center md:justify-self-end w-full max-w-[220px]">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/20 bg-background/40 backdrop-blur-sm">
                    <img
                      src="/images/builder-rehan.jpg"
                      alt="Portrait of the builder"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-white/15 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="mb-2 flex justify-center">
              <SectionTag label="FAQs" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Snippetly
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed mt-4">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto">
          <SectionTag label="CTA Section" />
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-black border-gray-800 text-white p-8 sm:p-12 lg:p-16 rounded-2xl shadow-2xl">
              <CardContent className="p-0">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-balance mb-8 text-white">
                  Ready to organize your code snippets?
                </h2>
                <p className="text-base sm:text-xl text-slate-300 text-balance mb-12 max-w-2xl mx-auto">
                  Join thousands of developers who have already transformed their workflow. Start building your personal
                  snippet vault today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6 bg-white text-slate-900 hover:bg-slate-100"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6 border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                  >
                    View Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <SectionTag label="Footer" />
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <SnippetlyLogo />
              </div>
              <p className="text-muted-foreground mb-4">Your personal snippet vault for better code management.</p>
              <div className="flex items-center space-x-3">
                <a
                  href="https://x.com/snippetly_xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  aria-label="Follow us on X (Twitter)"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/Rehanbuilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  aria-label="View our GitHub repository"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammad-rehan-575908378"
                  aria-label="LinkedIn - Builder profile"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-gray-800"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7 0h3.84v2.11h.05c.53-1 1.83-2.11 3.76-2.11 4.02 0 4.76 2.65 4.76 6.1V24h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V24h-4V8.5z" />
                  </svg>
                </a>
              </div>
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
