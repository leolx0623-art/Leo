import { NextRequest, NextResponse } from "next/server"
import { portfolioManager } from "@/storage/database/portfolioManager"
import { S3Storage } from "coze-coding-dev-sdk"

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
})

// GET - 获取单个作品集
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const portfolio = await portfolioManager.getPortfolioById(id)

    if (!portfolio) {
      return NextResponse.json({ error: "作品集不存在" }, { status: 404 })
    }

    // 生成签名 URL
    const portfolioWithUrls: any = { ...portfolio }

    if (portfolio.imageUrl) {
      portfolioWithUrls.imageUrl = await storage.generatePresignedUrl({
        key: portfolio.imageUrl,
        expireTime: 86400,
      })
    }

    if (portfolio.videoUrl) {
      portfolioWithUrls.videoUrl = await storage.generatePresignedUrl({
        key: portfolio.videoUrl,
        expireTime: 86400,
      })
    }

    return NextResponse.json(portfolioWithUrls)
  } catch (error) {
    console.error("获取作品集失败:", error)
    return NextResponse.json(
      { error: "获取作品集失败" },
      { status: 500 }
    )
  }
}

// PUT - 更新作品集
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const portfolio = await portfolioManager.updatePortfolio(id, body)

    if (!portfolio) {
      return NextResponse.json({ error: "作品集不存在" }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("更新作品集失败:", error)
    return NextResponse.json(
      { error: "更新作品集失败" },
      { status: 500 }
    )
  }
}

// DELETE - 删除作品集
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await portfolioManager.deletePortfolio(id)

    if (!success) {
      return NextResponse.json({ error: "作品集不存在" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除作品集失败:", error)
    return NextResponse.json(
      { error: "删除作品集失败" },
      { status: 500 }
    )
  }
}
