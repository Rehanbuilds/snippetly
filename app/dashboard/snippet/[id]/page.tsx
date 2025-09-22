import { DashboardLayout } from "@/components/dashboard-layout"
import { SnippetDetail } from "@/components/snippet-detail"

interface SnippetPageProps {
  params: {
    id: string
  }
}

export default function SnippetPage({ params }: SnippetPageProps) {
  return (
    <DashboardLayout>
      <SnippetDetail snippetId={params.id} />
    </DashboardLayout>
  )
}
