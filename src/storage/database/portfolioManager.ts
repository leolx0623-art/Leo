import { eq, desc, asc } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import {
  portfolios,
  insertPortfolioSchema,
  updatePortfolioSchema,
} from "./shared/schema"
import type { Portfolio, InsertPortfolio, UpdatePortfolio } from "./shared/schema"

// 创建数据库连接池
const pool = new Pool({
  host: process.env.COZE_DB_HOST || process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER || process.env.COZE_DB_USER,
  password: process.env.PGPASSWORD || process.env.COZE_DB_PASSWORD,
  database: process.env.PGDATABASE || process.env.COZE_DB_NAME,
})

// 创建 drizzle 实例
const db = drizzle(pool)

export class PortfolioManager {
  async createPortfolio(data: InsertPortfolio): Promise<Portfolio> {
    const validated = insertPortfolioSchema.parse(data)
    const [portfolio] = await db.insert(portfolios).values(validated).returning()
    return portfolio
  }

  async getPortfolios(category?: string): Promise<Portfolio[]> {
    if (category) {
      return db
        .select()
        .from(portfolios)
        .where(eq(portfolios.category, category))
        .orderBy(asc(portfolios.sortOrder), desc(portfolios.createdAt))
    }
    return db.select().from(portfolios).orderBy(asc(portfolios.sortOrder), desc(portfolios.createdAt))
  }

  async getPortfolioById(id: string): Promise<Portfolio | null> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
    return portfolio || null
  }

  async updatePortfolio(
    id: string,
    data: UpdatePortfolio
  ): Promise<Portfolio | null> {
    const validated = updatePortfolioSchema.parse(data)
    const [portfolio] = await db
      .update(portfolios)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(portfolios.id, id))
      .returning()
    return portfolio || null
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const result = await db.delete(portfolios).where(eq(portfolios.id, id))
    return (result.rowCount ?? 0) > 0
  }

  async updatePortfoliosOrder(updates: Array<{ id: string; sortOrder: number }>): Promise<void> {
    for (const update of updates) {
      await db
        .update(portfolios)
        .set({ sortOrder: update.sortOrder, updatedAt: new Date() })
        .where(eq(portfolios.id, update.id))
    }
  }
}

export const portfolioManager = new PortfolioManager()
