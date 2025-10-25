"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, LinkIcon, Code } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your description...",
  rows = 5,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatButtons = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: Heading1, label: "Heading 1", action: () => insertMarkdown("# ", "") },
    { icon: Heading2, label: "Heading 2", action: () => insertMarkdown("## ", "") },
    { icon: List, label: "Bullet List", action: () => insertMarkdown("- ", "") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertMarkdown("1. ", "") },
    { icon: LinkIcon, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: Code, label: "Code Block", action: () => insertMarkdown("```\n", "\n```") },
  ]

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "write" && (
            <div className="flex items-center gap-1">
              {formatButtons.map((button) => (
                <Button
                  key={button.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="h-8 w-8 p-0"
                  title={button.label}
                >
                  <button.icon className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            id="markdown-textarea"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="font-mono text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supports Markdown: **bold**, *italic*, # headings, lists, links, and code blocks
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2">
            {value ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
