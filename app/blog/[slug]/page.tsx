import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import { SnippetlyLogo } from "@/components/snippetly-logo"

type BlogPost = {
  slug: string
  title: string
  content: string
  coverImage: string
  date: string
  author: string
  authorRole: string
  authorBio: string
  readTime: string
  tags: string[]
}

const blogPosts: Record<string, BlogPost> = {
  "hidden-cost-of-copy-pasting-code": {
    slug: "hidden-cost-of-copy-pasting-code",
    title: "The Hidden Cost of Copy-Pasting Code: Why You Need a Snippet Manager",
    coverImage: "/images/blog/copy-paste-code-cover.jpg",
    date: "2025-01-30",
    author: "Rehan",
    authorRole: "Founder & Product Engineer",
    authorBio:
      "Entrepreneur and product engineer passionate about building tools that make developers' lives easier. Creator of Snippetly.",
    readTime: "5 min read",
    tags: ["Productivity", "Developer Tools", "Code Management"],
    content: `
We've all been there. You're working on a project, and you need that perfect regex pattern you wrote last month. Or maybe it's that API integration snippet you spent hours perfecting. You know you saved it somewhere, but where?

You start searching through old projects, scrolling through Slack messages, checking your notes app, and browsing through bookmarked Stack Overflow answers. Twenty minutes later, you're still looking. Sound familiar?

## The Real Cost of Disorganized Code

According to recent developer surveys, the average developer spends **30-45 minutes per day** searching for code snippets they've used before. That's nearly **4 hours per week** or **200 hours per year** just looking for code you've already written.

Let's break down what this really costs:

### Time Waste
- **30-45 minutes daily** searching for snippets
- **2-3 hours weekly** recreating code you've written before
- **Countless hours** context-switching between tasks

### Productivity Loss
- Breaking your flow state to search for code
- Rewriting solutions you've already solved
- Missing deadlines because of inefficient workflows

### Mental Overhead
- Remembering where you saved different snippets
- Managing multiple storage locations (notes, bookmarks, old projects)
- Decision fatigue about where to save new snippets

## Why Traditional Methods Fall Short

Many developers try to solve this problem with makeshift solutions:

### 1. Scattered Text Files
You save snippets in random .txt files across your computer. Good luck finding them later when you need them.

### 2. Code Comments in Old Projects
"I'll just remember which project I used this in." Spoiler: You won't.

### 3. Browser Bookmarks
Bookmarking Stack Overflow answers works until you have 500+ bookmarks with no organization.

### 4. Note-Taking Apps
Generic note apps aren't built for code. No syntax highlighting, no language detection, no proper formatting.

### 5. GitHub Gists
Great for sharing, but terrible for personal organization. No tags, limited search, and no folder structure.

## The Snippet Manager Solution

A dedicated snippet manager solves all these problems by providing:

### Centralized Storage
All your code snippets in one place. No more hunting through multiple locations.

### Smart Organization
- **Tags** for categorization
- **Folders** for project-based organization
- **Favorites** for frequently used snippets
- **Language detection** for automatic syntax highlighting

### Instant Search
Find any snippet in seconds with full-text search across titles, tags, and code content.

### Proper Code Formatting
Syntax highlighting for 50+ programming languages makes your snippets readable and professional.

### Easy Sharing
Share snippets with your team or keep them private. Export in multiple formats when needed.

## Real-World Impact

Let's do the math on what a snippet manager can save you:

**Before Snippet Manager:**
- 30 minutes/day searching for code = 2.5 hours/week
- 2.5 hours/week × 50 weeks = 125 hours/year
- At $50/hour developer rate = **$6,250 in lost productivity**

**After Snippet Manager:**
- 5 minutes/day finding snippets = 0.4 hours/week
- 0.4 hours/week × 50 weeks = 20 hours/year
- **Savings: 105 hours and $5,250 per year**

And that's just the time savings. The real value comes from:
- Maintaining your flow state
- Reducing context switching
- Building a personal knowledge base
- Improving code quality through reuse

## Getting Started with Snippet Management

Here's how to start organizing your code snippets effectively:

### 1. Audit Your Current Snippets
Gather all the code snippets you've saved across different locations. You'll be surprised how many you have.

### 2. Choose the Right Tool
Look for a snippet manager that offers:
- Fast search functionality
- Syntax highlighting
- Tag-based organization
- Easy copy/paste workflow
- Cross-platform access

### 3. Develop a Tagging System
Create consistent tags like:
- Language (javascript, python, css)
- Purpose (authentication, api, database)
- Framework (react, nextjs, django)

### 4. Make It a Habit
Whenever you write a useful piece of code, save it immediately. Future you will thank present you.

### 5. Regular Maintenance
Review and update your snippets monthly. Remove outdated code and add notes for context.

## Common Snippet Categories to Start With

Here are the most valuable snippet categories developers maintain:

### Authentication & Security
- JWT token handling
- Password hashing
- OAuth flows
- API key management

### Database Operations
- Common SQL queries
- ORM patterns
- Migration templates
- Connection pooling

### API Integration
- HTTP request templates
- Error handling patterns
- Rate limiting logic
- Response parsing

### UI Components
- Form validation
- Modal patterns
- Loading states
- Error boundaries

### Utility Functions
- Date formatting
- String manipulation
- Array operations
- Object transformations

## The Compound Effect

The beauty of a snippet manager is the compound effect. Every snippet you save today makes you more productive tomorrow. Over time, you build a personal library of battle-tested code that:

- Speeds up your development
- Reduces bugs (reusing proven code)
- Improves consistency across projects
- Serves as documentation for your team

## Conclusion

The hidden cost of copy-pasting code isn't just the time spent searching. It's the broken flow, the recreated solutions, and the mental overhead of managing scattered snippets.

A dedicated snippet manager isn't just a nice-to-have tool—it's an investment in your productivity and professional growth. The time you save compounds over your career, and the knowledge base you build becomes increasingly valuable.

Stop losing your code snippets. Start building your personal snippet vault today.

---

**Ready to organize your code snippets?** Try [Snippetly](https://snippetly.xyz) free and see how much time you can save. No credit card required.
    `,
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Snippetly Blog`,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160),
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pt-2">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-gray-200 dark:border-gray-800 rounded-full shadow-lg">
            <div className="flex justify-between items-center h-12 px-3 sm:px-4">
              <SnippetlyLogo href="/" />
              <div className="flex items-center space-x-2">
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
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

      {/* Article */}
      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">{post.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <div>
                  <div className="font-medium text-foreground">{post.author}</div>
                  <div className="text-sm">{post.authorRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-2xl mb-12">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-3xl font-bold mt-12 mb-6">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-2xl font-semibold mt-8 mb-4">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              } else if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <p key={index} className="text-xl font-semibold my-6">
                    {paragraph.replace(/\*\*/g, "")}
                  </p>
                )
              } else if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n")
                return (
                  <ul key={index} className="list-disc pl-6 my-6 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-lg">
                        {item.replace("- ", "").replace(/\*\*/g, "")}
                      </li>
                    ))}
                  </ul>
                )
              } else if (paragraph.startsWith("---")) {
                return <hr key={index} className="my-12 border-border" />
              } else {
                return (
                  <p key={index} className="text-lg leading-relaxed my-6 text-muted-foreground">
                    {paragraph.split("**").map((part, i) =>
                      i % 2 === 0 ? (
                        part
                      ) : (
                        <strong key={i} className="font-semibold text-foreground">
                          {part}
                        </strong>
                      ),
                    )}
                  </p>
                )
              }
            })}
          </div>

          {/* Author Bio */}
          <div className="mt-16 p-8 bg-muted rounded-2xl border border-border">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-2xl font-bold text-white">
                  {post.author[0]}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{post.author}</h3>
                <p className="text-sm text-muted-foreground mb-3">{post.authorRole}</p>
                <p className="text-muted-foreground">{post.authorBio}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to organize your code snippets?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of developers who have already transformed their workflow with Snippetly.
            </p>
            <Link href="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; 2025 Snippetly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
