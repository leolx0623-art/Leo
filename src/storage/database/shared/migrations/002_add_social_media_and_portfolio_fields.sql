-- Migration: 添加社交媒体字段到 profile 表 + 扩展 portfolio 表
-- Date: 2026-04-10

-- 1. Profile 表添加社交媒体字段
ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "twitter" varchar(255);
ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "douyin" varchar(255);
ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "xiaohongshu" varchar(255);
ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "bilibili" varchar(255);
ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "weixin" varchar(255);

-- 2. Portfolio 表添加新字段
ALTER TABLE "portfolios" ADD COLUMN IF NOT EXISTS "tags" text;
ALTER TABLE "portfolios" ADD COLUMN IF NOT EXISTS "view_count" integer NOT NULL DEFAULT 0;
ALTER TABLE "portfolios" ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
ALTER TABLE "portfolios" ADD COLUMN IF NOT EXISTS "sort" integer NOT NULL DEFAULT 0;

-- 3. 添加索引
CREATE INDEX IF NOT EXISTS "portfolios_featured_idx" ON "portfolios" ("featured");
