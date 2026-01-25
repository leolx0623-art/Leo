import { pgTable, text, timestamp, varchar, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 作品集表
export const portfolios = pgTable(
  "portfolios",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).notNull().default("other"),
    imageUrl: text("image_url"),
    videoUrl: text("video_url"),
    websiteUrl: text("website_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    createdAtIdx: index("portfolios_created_at_idx").on(table.createdAt),
    categoryIdx: index("portfolios_category_idx").on(table.category),
  })
)

// 使用 createSchemaFactory 配置 date coercion
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

// Zod schemas for validation
export const insertPortfolioSchema = createCoercedInsertSchema(portfolios).pick({
  title: true,
  description: true,
  category: true,
  imageUrl: true,
  videoUrl: true,
  websiteUrl: true,
})

export const updatePortfolioSchema = createCoercedInsertSchema(portfolios)
  .pick({
    title: true,
    description: true,
    category: true,
    imageUrl: true,
    videoUrl: true,
    websiteUrl: true,
  })
  .partial()

// TypeScript types
export type Portfolio = typeof portfolios.$inferSelect
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>
export type UpdatePortfolio = z.infer<typeof updatePortfolioSchema>

