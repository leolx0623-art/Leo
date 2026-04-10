import { eq, desc, asc, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import {
  portfolios,
  insertPortfolioSchema,
  updatePortfolioSchema,
} from "./shared/schema"
import type { Portfolio, InsertPortfolio, UpdatePortfolio } from "./shared/schema"

// 延迟创建数据库连接 - 避免在没有数据库环境时报错
let poolInstance: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    const host = process.env.COZE_DB_HOST || process.env.PGHOST;
    if (!host) {
      throw new Error('Database not configured');
    }
    poolInstance = new Pool({
      host,
      port: parseInt(process.env.PGPORT || "5432"),
      user: process.env.PGUSER || process.env.COZE_DB_USER,
      password: process.env.PGPASSWORD || process.env.COZE_DB_PASSWORD,
      database: process.env.PGDATABASE || process.env.COZE_DB_NAME,
    });
    dbInstance = drizzle(poolInstance);
  }
  return dbInstance;
}

export class PortfolioManager {
  async createPortfolio(data: InsertPortfolio): Promise<Portfolio> {
    const validated = insertPortfolioSchema.parse(data)
    const [portfolio] = await getDb().insert(portfolios).values(validated).returning()
    return portfolio
  }

  async getPortfolios(category?: string): Promise<Portfolio[]> {
    if (category) {
      return getDb()
        .select()
        .from(portfolios)
        .where(eq(portfolios.category, category))
        .orderBy(asc(portfolios.sortOrder), desc(portfolios.createdAt))
    }
    return getDb().select().from(portfolios).orderBy(asc(portfolios.sortOrder), desc(portfolios.createdAt))
  }

  async getFeaturedPortfolios(): Promise<Portfolio[]> {
    return getDb()
      .select()
      .from(portfolios)
      .where(eq(portfolios.featured, true))
      .orderBy(asc(portfolios.sort), desc(portfolios.createdAt))
  }

  async getPortfolioById(id: string): Promise<Portfolio | null> {
    const [portfolio] = await getDb()
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
    const [portfolio] = await getDb()
      .update(portfolios)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(portfolios.id, id))
      .returning()
    return portfolio || null
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const result = await getDb().delete(portfolios).where(eq(portfolios.id, id))
    return (result.rowCount ?? 0) > 0
  }

  async updatePortfoliosOrder(updates: Array<{ id: string; sortOrder: number }>): Promise<void> {
    for (const update of updates) {
      await getDb()
        .update(portfolios)
        .set({ sortOrder: update.sortOrder, updatedAt: new Date() })
        .where(eq(portfolios.id, update.id))
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    await getDb()
      .update(portfolios)
      .set({
        viewCount: sql`${portfolios.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.id, id))
  }
}

export const portfolioManager = new PortfolioManager()
