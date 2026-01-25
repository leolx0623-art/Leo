import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '未选择文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '仅支持PDF和JPG格式' },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过10MB' },
        { status: 400 }
      );
    }

    // 初始化S3存储
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传文件
    const fileExtension = file.type === 'application/pdf' ? 'pdf' : 'jpg';
    const fileName = `resume_${Date.now()}.${fileExtension}`;
    const key = await storage.uploadFile({
      fileContent: buffer,
      fileName: `resumes/${fileName}`,
      contentType: file.type,
    });

    // 生成签名URL（有效期7天）
    const downloadUrl = await storage.generatePresignedUrl({
      key: key,
      expireTime: 604800, // 7天
    });

    return NextResponse.json({
      success: true,
      key: key,
      downloadUrl: downloadUrl,
      fileName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error('简历上传失败:', error);
    return NextResponse.json(
      { error: '简历上传失败，请重试' },
      { status: 500 }
    );
  }
}
