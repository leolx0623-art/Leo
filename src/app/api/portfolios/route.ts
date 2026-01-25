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

// GET - 获取所有作品集
export async function GET() {
  try {
    const portfolios = await portfolioManager.getPortfolios()

    // 为每个作品集生成签名 URL
    const portfoliosWithUrls = await Promise.all(
      portfolios.map(async (portfolio) => {
        const portfolioWithUrls: any = { ...portfolio }

        if (portfolio.imageUrl) {
          portfolioWithUrls.imageUrl = await storage.generatePresignedUrl({
            key: portfolio.imageUrl,
            expireTime: 86400, // 1天
          })
        }

        if (portfolio.videoUrl) {
          portfolioWithUrls.videoUrl = await storage.generatePresignedUrl({
            key: portfolio.videoUrl,
            expireTime: 86400, // 1天
          })
        }

        return portfolioWithUrls
      })
    )

    return NextResponse.json(portfoliosWithUrls)
  } catch (error) {
    console.error("获取作品集失败:", error)
    return NextResponse.json(
      { error: "获取作品集失败" },
      { status: 500 }
    )
  }
}

// POST - 创建作品集
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const portfolio = await portfolioManager.createPortfolio(body)
    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error("创建作品集失败:", error)
    return NextResponse.json(
      { error: "创建作品集失败" },
      { status: 500 }
    )
  }
}
