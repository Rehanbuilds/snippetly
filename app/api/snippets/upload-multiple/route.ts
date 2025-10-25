import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log("[v0] Uploading", files.length, "files for user", user.id)

    const uploadedFiles = []

    for (const file of files) {
      try {
        // Get the relative path if available (for folder uploads)
        const relativePath = (file as any).webkitRelativePath || file.name

        // Upload to Vercel Blob
        const blob = await put(`snippets/${user.id}/${Date.now()}-${file.name}`, file, {
          access: "public",
        })

        uploadedFiles.push({
          url: blob.url,
          name: file.name,
          size: file.size,
          type: file.type,
          path: relativePath,
        })

        console.log("[v0] Uploaded file:", file.name, "->", blob.url)
      } catch (error) {
        console.error("[v0] Error uploading file:", file.name, error)
        // Continue with other files even if one fails
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: "Failed to upload any files" }, { status: 500 })
    }

    console.log("[v0] Successfully uploaded", uploadedFiles.length, "files")

    return NextResponse.json({
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload files" },
      { status: 500 },
    )
  }
}
