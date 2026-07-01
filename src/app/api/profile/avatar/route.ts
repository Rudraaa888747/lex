import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

async function saveLocally(buffer: Buffer, userId: string, ext: string) {
  const uploadsDir = path.join(process.cwd(), "public", "avatars")
  await fs.mkdir(uploadsDir, { recursive: true })
  const filename = `${userId}-${Date.now()}${ext}`
  await fs.writeFile(path.join(uploadsDir, filename), buffer)
  return `/avatars/${filename}`
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("avatar")

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP or GIF" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 })
    }

    let avatarUrl: string
    if (process.env.CLOUDINARY_URL) {
      const base64 = buffer.toString("base64")
      const dataUri = `data:${file.type};base64,${base64}`
      const { v2: cloudinary } = await import("cloudinary")
      cloudinary.config({ secure: true })
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "avatars",
        transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
      })
      avatarUrl = result.secure_url
    } else {
      const ext = file.type.split("/")[1].replace("jpeg", "jpg")
      avatarUrl = await saveLocally(buffer, session.user.id, `.${ext}`)
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: avatarUrl },
    })

    return NextResponse.json({ avatarUrl })
  } catch (err) {
    console.error("[profile/avatar]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
