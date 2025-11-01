import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { SnippetlyLogo } from "@/components/snippetly-logo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog - Snippetly",
  description:
    "Read the latest articles about code snippet management, developer productivity, and best practices for organizing your code.",
  openGraph: {
    title: "Snippetly Blog - Developer Productivity & Code Management Tips",
    description: "Expert insights on code snippet management and developer workflow optimization",
    type: "website",
  },
}

const blogPosts = [
  {
    slug: "hidden-cost-of-copy-pasting-code",
    title: "The Hidden Cost of Copy-Pasting Code: Why You Need a Snippet Manager",
    excerpt:
      "Discover how much time developers waste searching for code snippets and why a proper snippet manager is essential for productivity.",
    coverImage: "/images/blog/copy-paste-code-cover.jpg",
    date: "2025-01-30",
    author: "Rehan",
    authorRole: "Founder",
    readTime: "5 min read",
    tags: ["Productivity", "Developer Tools", "Code Management"],
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pt-2">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-gray-200 dark:border-gray-800 rounded-full shadow-lg">
            <div className="flex justify-between items-center h-12 px-3 sm:px-4">
              <SnippetlyLogo href="/" />
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    Home
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Snippetly Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights on code management, developer productivity, and building better workflows
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; 2025 Snippetly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
