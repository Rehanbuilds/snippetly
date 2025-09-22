import { DashboardLayout } from "@/components/dashboard-layout"
import { NewSnippetForm } from "@/components/new-snippet-form"

export default function NewSnippetPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Snippet</h1>
          <p className="text-muted-foreground">Save a new code snippet to your collection</p>
        </div>
        <NewSnippetForm />
      </div>
    </DashboardLayout>
  )
}
