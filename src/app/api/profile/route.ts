import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { profile } from '@/storage/database/shared/schema';

// 创建数据库连接池
const pool = new Pool({
  host: process.env.COZE_DB_HOST || process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER || process.env.COZE_DB_USER,
  password: process.env.PGPASSWORD || process.env.COZE_DB_PASSWORD,
  database: process.env.PGDATABASE || process.env.COZE_DB_NAME,
});

// 创建 drizzle 实例
const db = drizzle(pool);

// 获取个人名片数据
export async function GET() {
  try {
    const profiles = await db.select().from(profile).limit(1);
    const profileData = profiles[0] || {
      name: '',
      title: '',
      bio: '',
      location: '',
      email: '',
      github: '',
      linkedin: '',
      twitter: '',
      douyin: '',
      xiaohongshu: '',
      bilibili: '',
      weixin: '',
      avatar: '',
    };
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('获取个人名片失败:', error);
    return NextResponse.json(
      { error: '获取个人名片失败' },
      { status: 500 }
    );
  }
}

// 保存个人名片数据
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 删除现有数据
    await db.delete(profile);

    // 插入新数据
    await db.insert(profile).values(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存个人名片失败:', error);
    return NextResponse.json(
      { error: '保存个人名片失败' },
      { status: 500 }
    );
  }
}
