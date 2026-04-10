import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { settings } from '@/storage/database/shared/schema';

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

// 获取网站设置
export async function GET() {
  try {
    const siteSettings = await getDb().select().from(settings).limit(1);
    const settingsData = siteSettings[0] || {
      siteName: '',
      siteDescription: '',
      enableContactForm: true,
      enableAiChat: true,
      contactEmail: '',
      aiPersona: '',
    };
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error('获取网站设置失败:', error);
    return NextResponse.json(
      { error: '获取网站设置失败' },
      { status: 500 }
    );
  }
}

// 保存网站设置
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 删除现有数据
    await getDb().delete(settings);

    // 插入新数据
    await getDb().insert(settings).values(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存网站设置失败:', error);
    return NextResponse.json(
      { error: '保存网站设置失败' },
      { status: 500 }
    );
  }
}
