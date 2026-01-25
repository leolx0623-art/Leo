import { eq, desc, asc, SQL } from "drizzle-orm"
import { getDb } from "coze-coding-dev-sdk"
import {
  portfolios,
  insertPortfolioSchema,
  updatePortfolioSchema,
} from "./shared/schema"
import type { Portfolio, InsertPortfolio, UpdatePortfolio } from "./shared/schema"

export class PortfolioManager {
  async createPortfolio(data: InsertPortfolio): Promise<Portfolio> {
    const db = await getDb()
    const validated = insertPortfolioSchema.parse(data)
    const [portfolio] = await db.insert(portfolios).values(validated).returning()
    return portfolio
  }

  async getPortfolios(category?: string): Promise<Portfolio[]> {
    const db = await getDb()
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
    const db = await getDb()
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
    const db = await getDb()
    const validated = updatePortfolioSchema.parse(data)
    const [portfolio] = await db
      .update(portfolios)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(portfolios.id, id))
      .returning()
    return portfolio || null
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const db = await getDb()
    const result = await db.delete(portfolios).where(eq(portfolios.id, id))
    return (result.rowCount ?? 0) > 0
  }

  async updatePortfoliosOrder(updates: Array<{ id: string; sortOrder: number }>): Promise<void> {
    const db = await getDb()
    for (const update of updates) {
      await db
        .update(portfolios)
        .set({ sortOrder: update.sortOrder, updatedAt: new Date() })
        .where(eq(portfolios.id, update.id))
    }
  }
}

export const portfolioManager = new PortfolioManager()
