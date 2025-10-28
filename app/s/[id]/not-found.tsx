import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold">Snippet Not Found</h1>
        <p className="text-muted-foreground">This snippet doesn't exist or is not publicly available.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
