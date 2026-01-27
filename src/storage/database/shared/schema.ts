import { pgTable, text, timestamp, varchar, integer, index, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 个人名片表
export const profile = pgTable(
  "profile",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    bio: text("bio").notNull(),
    location: varchar("location", { length: 255 }),
    email: varchar("email", { length: 255 }),
    github: varchar("github", { length: 255 }),
    linkedin: varchar("linkedin", { length: 255 }),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    idIdx: index("profile_id_idx").on(table.id),
  })
)

// 网站设置表
export const settings = pgTable(
  "settings",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    siteName: varchar("site_name", { length: 255 }).notNull(),
    siteDescription: text("site_description"),
    enableContactForm: boolean("enable_contact_form").notNull().default(true),
    enableAiChat: boolean("enable_ai_chat").notNull().default(true),
    contactEmail: varchar("contact_email", { length: 255 }).notNull(),
    aiPersona: text("ai_persona"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    idIdx: index("settings_id_idx").on(table.id),
  })
)

// 联系信息表
export const contactInfo = pgTable(
  "contact_info",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    resumeKey: text("resume_key"),
    resumeFileName: text("resume_file_name"),
    downloadCount: integer("download_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    idIdx: index("contact_info_id_idx").on(table.id),
  })
)

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
    sortOrder: integer("sort_order").notNull().default(0),
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
    sortOrderIdx: index("portfolios_sort_order_idx").on(table.sortOrder),
  })
)

// 使用 createSchemaFactory 配置 date coercion
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

// Zod schemas for validation
export const insertContactInfoSchema = createCoercedInsertSchema(contactInfo).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
})

export const updateContactInfoSchema = createCoercedInsertSchema(contactInfo)
  .pick({
    email: true,
    phone: true,
    location: true,
    resumeKey: true,
    resumeFileName: true,
  })
  .partial()

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
export type Profile = typeof profile.$inferSelect
export type Settings = typeof settings.$inferSelect
export type ContactInfo = typeof contactInfo.$inferSelect
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>
export type UpdateContactInfo = z.infer<typeof updateContactInfoSchema>
export type Portfolio = typeof portfolios.$inferSelect
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>
export type UpdatePortfolio = z.infer<typeof updatePortfolioSchema>

