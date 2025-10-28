import { PublicSnippetView } from "@/components/public-snippet-view"

interface PublicSnippetPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PublicSnippetPage({ params }: PublicSnippetPageProps) {
  const { id } = await params
  console.log("[v0] Public snippet page - publicId:", id)
  return <PublicSnippetView publicId={id} />
}
