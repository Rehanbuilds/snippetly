import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Upload all files to Vercel Blob
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)

        // Get the relative path if it exists (for folder uploads)
        const relativePath = (file as any).webkitRelativePath || file.name

        // Create a unique filename preserving the folder structure
        const filename = `boilerplates/${timestamp}-${randomId}/${relativePath}`

        const blob = await put(filename, file, {
          access: "public",
        })

        return {
          url: blob.url,
          name: file.name,
          size: file.size,
          type: file.type,
          path: relativePath, // Store the relative path for folder structure
        }
      }),
    )

    return NextResponse.json({
      files: uploadedFiles,
      count: uploadedFiles.length,
    })
  } catch (error) {
    console.error("[v0] Multiple file upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
