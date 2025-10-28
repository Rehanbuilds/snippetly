import { PublicSnippetView } from "@/components/public-snippet-view"

interface PublicSnippetPageProps {
  params: {
    id: string
  }
}

export default function PublicSnippetPage({ params }: PublicSnippetPageProps) {
  return <PublicSnippetView publicId={params.id} />
}
