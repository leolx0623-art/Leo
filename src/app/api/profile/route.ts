import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { profile } from '@/storage/database/shared/schema';

// 获取个人名片数据
export async function GET() {
  try {
    const db = await getDb();
    const profiles = await db.select().from(profile).limit(1);
    const profileData = profiles[0] || {
      name: '',
      title: '',
      bio: '',
      location: '',
      email: '',
      github: '',
      linkedin: '',
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
    const db = await getDb();

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
