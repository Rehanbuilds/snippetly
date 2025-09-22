"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, Star, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface SnippetGridProps {
  favoritesOnly?: boolean
}

// Mock data for snippets
const mockSnippets = [
  {
    id: 1,
    title: "useLocalStorage Hook",
    description: "Custom React hook for managing localStorage with state synchronization",
    language: "React",
    tags: ["hooks", "react", "localStorage"],
    code: `const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};`,
    isFavorite: true,
    createdAt: "2 days ago",
  },
  {
    id: 2,
    title: "API Error Handler",
    description: "Centralized error handling utility for API responses",
    language: "JavaScript",
    tags: ["utils", "api", "error-handling"],
    code: `const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 401:
        return 'Unauthorized access';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error occurred';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    return 'Network error - please check your connection';
  } else {
    return 'Request failed to send';
  }
};`,
    isFavorite: false,
    createdAt: "1 week ago",
  },
  {
    id: 3,
    title: "Debounce Function",
    description: "Utility function to debounce rapid function calls",
    language: "JavaScript",
    tags: ["utils", "performance"],
    code: `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Usage example:
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);`,
    isFavorite: true,
    createdAt: "3 days ago",
  },
  {
    id: 4,
    title: "CSS Grid Layout",
    description: "Responsive grid layout with auto-fit columns",
    language: "CSS",
    tags: ["css", "layout", "responsive"],
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`,
    isFavorite: false,
    createdAt: "5 days ago",
  },
]

export function SnippetGrid({ favoritesOnly = false }: SnippetGridProps) {
  const snippets = favoritesOnly ? mockSnippets.filter((snippet) => snippet.isFavorite) : mockSnippets

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {favoritesOnly ? "No favorite snippets yet." : "No snippets found."}
        </p>
        <Link href="/dashboard/new">
          <Button>Create Your First Snippet</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <Card key={snippet.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link href={`/dashboard/snippet/${snippet.id}`}>
                  <CardTitle className="text-lg mb-1 hover:text-primary cursor-pointer">{snippet.title}</CardTitle>
                </Link>
                <CardDescription className="text-sm">{snippet.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/snippet/${snippet.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    {snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {/* Code Preview */}
            <Link href={`/dashboard/snippet/${snippet.id}`}>
              <div className="bg-muted rounded-md p-3 mb-4 font-mono text-sm overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors">
                <pre className="text-xs leading-relaxed line-clamp-4">{snippet.code}</pre>
              </div>
            </Link>

            {/* Tags and Language */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{snippet.language}</Badge>
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{snippet.createdAt}</span>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${snippet.isFavorite ? "text-yellow-500" : ""}`}
                >
                  <Star className={`h-4 w-4 ${snippet.isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
