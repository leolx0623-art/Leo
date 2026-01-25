import { NextRequest, NextResponse } from "next/server"
import { S3Storage } from "coze-coding-dev-sdk"

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
})

// POST - 上传文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 })
    }

    // 检查文件类型
    const fileType = file.type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"]

    if (!allowedImageTypes.includes(fileType) && !allowedVideoTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "不支持的文件类型，仅支持图片和视频" },
        { status: 400 }
      )
    }

    // 检查文件大小（限制为 50MB）
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小超过限制（最大 50MB）" },
        { status: 400 }
      )
    }

    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 确定文件目录
    const folder = fileType.startsWith("image") ? "portfolio-images" : "portfolio-videos"

    // 上传文件
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: `${folder}/${Date.now()}_${file.name}`,
      contentType: fileType,
    })

    // 生成签名 URL
    const signedUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400, // 1天
    })

    return NextResponse.json({
      key: fileKey,
      url: signedUrl,
      type: fileType.startsWith("image") ? "image" : "video",
    })
  } catch (error) {
    console.error("文件上传失败:", error)
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 })
  }
}
