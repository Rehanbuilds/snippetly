import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Contact — Snippetly",
  description: "Have questions or feedback? Get in touch with the Snippetly team using our quick contact form.",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-pretty">Contact</h1>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-muted-foreground">Use the contact form or DM us on X.</p>
        <div className="flex gap-2">
          <Button asChild className="bg-black text-white hover:bg-zinc-900">
            <a href="https://x.com/snippetly_xyz" target="_blank" rel="noopener noreferrer" aria-label="DM us on X">
              DM us on X
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg border bg-background">
        <iframe
          src="https://tally.so/r/mJ7NYY?transparentBackground=1"
          title="Contact form"
          className="w-full h-[80vh]"
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
        />
      </div>
    </main>
  )
}
