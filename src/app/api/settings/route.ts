import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { settings } from '@/storage/database/shared/schema';

// 获取网站设置
export async function GET() {
  try {
    const db = await getDb();
    const siteSettings = await db.select().from(settings).limit(1);
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
    const db = await getDb();

    // 删除现有数据
    await db.delete(settings);

    // 插入新数据
    await db.insert(settings).values(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存网站设置失败:', error);
    return NextResponse.json(
      { error: '保存网站设置失败' },
      { status: 500 }
    );
  }
}
