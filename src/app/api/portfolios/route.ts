import { NextRequest, NextResponse } from "next/server"
import { portfolioManager } from "@/storage/database/portfolioManager"

// GET - 获取所有作品集
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const featured = searchParams.get("featured")

    if (featured === "true") {
      const portfolios = await portfolioManager.getFeaturedPortfolios()
      return NextResponse.json(portfolios)
    }

    const portfolios = await portfolioManager.getPortfolios(category)

    return NextResponse.json(portfolios)
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
