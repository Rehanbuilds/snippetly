"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Star, Edit, Trash2, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface SnippetDetailProps {
  snippetId: string
}

// Mock data - in real app this would come from API/database
const mockSnippet = {
  id: 1,
  title: "useLocalStorage Hook",
  description:
    "Custom React hook for managing localStorage with state synchronization. This hook provides a simple interface for storing and retrieving data from localStorage while keeping the component state in sync.",
  language: "React",
  tags: ["hooks", "react", "localStorage", "state-management"],
  code: `import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;

// Usage example:
// const [name, setName] = useLocalStorage('name', 'Bob');`,
  isFavorite: true,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T14:20:00Z",
}

export function SnippetDetail({ snippetId }: SnippetDetailProps) {
  const [copied, setCopied] = useState(false)
  const [isFavorite, setIsFavorite] = useState(mockSnippet.isFavorite)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockSnippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFavorite}>
            <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current text-yellow-500" : ""}`} />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
          <Link href={`/dashboard/snippet/${snippetId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Snippet Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{mockSnippet.title}</CardTitle>
              <p className="text-muted-foreground">{mockSnippet.description}</p>
            </div>
          </div>

          {/* Tags and Language */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Badge variant="secondary" className="font-medium">
              {mockSnippet.language}
            </Badge>
            {mockSnippet.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Code Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Code</CardTitle>
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>{mockSnippet.code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">
                {new Date(mockSnippet.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Last updated:</span>
              <p className="font-medium">
                {new Date(mockSnippet.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
