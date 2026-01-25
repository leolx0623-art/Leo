import { NextRequest, NextResponse } from 'next/server';
import { contactInfoManager } from '@/storage/database/contactInfoManager';
import { S3Storage } from 'coze-coding-dev-sdk';

// GET - 获取联系信息
export async function GET() {
  try {
    const contactData = await contactInfoManager.getOrCreateContactInfo();

    // 如果有简历key，生成下载链接
    let downloadUrl = null;
    if (contactData.resumeKey) {
      const storage = new S3Storage({
        endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
        accessKey: '',
        secretKey: '',
        bucketName: process.env.COZE_BUCKET_NAME,
        region: 'cn-beijing',
      });

      downloadUrl = await storage.generatePresignedUrl({
        key: contactData.resumeKey,
        expireTime: 604800, // 7天
      });
    }

    return NextResponse.json({
      id: contactData.id,
      email: contactData.email,
      phone: contactData.phone,
      location: contactData.location,
      resumeKey: contactData.resumeKey,
      resumeFileName: contactData.resumeFileName,
      downloadCount: contactData.downloadCount,
      downloadUrl: downloadUrl,
    });
  } catch (error) {
    console.error('获取联系信息失败:', error);
    return NextResponse.json(
      { error: '获取联系信息失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新联系信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, phone, location, resumeKey, resumeFileName } = body;

    // 验证必填字段
    if (!id || !email || !phone || !location) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const updated = await contactInfoManager.updateContactInfo(id, {
      email,
      phone,
      location,
      resumeKey,
      resumeFileName,
    });

    if (!updated) {
      return NextResponse.json(
        { error: '联系信息不存在' },
        { status: 404 }
      );
    }

    // 如果有简历key，生成下载链接
    let downloadUrl = null;
    if (updated.resumeKey) {
      const storage = new S3Storage({
        endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
        accessKey: '',
        secretKey: '',
        bucketName: process.env.COZE_BUCKET_NAME,
        region: 'cn-beijing',
      });

      downloadUrl = await storage.generatePresignedUrl({
        key: updated.resumeKey,
        expireTime: 604800, // 7天
      });
    }

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      phone: updated.phone,
      location: updated.location,
      resumeKey: updated.resumeKey,
      resumeFileName: updated.resumeFileName,
      downloadCount: updated.downloadCount,
      downloadUrl: downloadUrl,
    });
  } catch (error) {
    console.error('更新联系信息失败:', error);
    return NextResponse.json(
      { error: '更新联系信息失败' },
      { status: 500 }
    );
  }
}
