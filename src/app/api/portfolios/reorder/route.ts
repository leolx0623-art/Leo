import { NextRequest, NextResponse } from "next/server"
import { portfolioManager } from "@/storage/database/portfolioManager"

// PUT - 批量更新排序
export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    // 验证数据格式
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "无效的数据格式，必须是数组" },
        { status: 400 }
      )
    }

    // 验证每个项目
    for (const update of updates) {
      if (!update.id || typeof update.sortOrder !== 'number') {
        return NextResponse.json(
          { error: "每个项目必须包含 id 和 sortOrder" },
          { status: 400 }
        )
      }
    }

    await portfolioManager.updatePortfoliosOrder(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("更新排序失败:", error)
    return NextResponse.json(
      { error: "更新排序失败" },
      { status: 500 }
    )
  }
}
