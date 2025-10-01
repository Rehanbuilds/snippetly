export const metadata = {
  title: "Contact — Snippetly",
  description: "Have questions or feedback? Get in touch with the Snippetly team using our quick contact form.",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-pretty">Contact</h1>

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
