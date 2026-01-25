import { eq, sql } from "drizzle-orm"
import { getDb } from "coze-coding-dev-sdk"
import {
  contactInfo,
  ContactInfo,
  InsertContactInfo,
  UpdateContactInfo,
} from "./shared/schema"
import { S3Storage } from 'coze-coding-dev-sdk';

export class ContactInfoManager {
  private storage: S3Storage;

  constructor() {
    this.storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });
  }

  // 获取联系信息（只返回第一条记录）
  async getContactInfo(): Promise<ContactInfo | null> {
    const db = await getDb()
    const result = await db.select().from(contactInfo).limit(1);
    return result[0] || null;
  }

  // 创建联系信息
  async createContactInfo(data: InsertContactInfo): Promise<ContactInfo> {
    const db = await getDb()
    const [newInfo] = await db.insert(contactInfo).values(data).returning();
    return newInfo;
  }

  // 更新联系信息
  async updateContactInfo(id: string, data: UpdateContactInfo): Promise<ContactInfo | null> {
    const db = await getDb()
    const [updated] = await db
      .update(contactInfo)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contactInfo.id, id))
      .returning();
    return updated || null;
  }

  // 获取或创建联系信息（默认只返回一条记录）
  async getOrCreateContactInfo(): Promise<ContactInfo> {
    let info = await this.getContactInfo();
    if (!info) {
      info = await this.createContactInfo({
        email: 'hello@aigccreator.com',
        phone: '+86 138-8888-8888',
        location: '中国，北京',
        resumeKey: null,
        resumeFileName: null,
      });
    }
    return info;
  }

  // 获取简历下载链接
  async getResumeDownloadUrl(resumeKey: string): Promise<string | null> {
    if (!resumeKey) return null;

    try {
      const url = await this.storage.generatePresignedUrl({
        key: resumeKey,
        expireTime: 604800, // 7天
      });
      return url;
    } catch (error) {
      console.error('获取简历下载链接失败:', error);
      return null;
    }
  }

  // 增加下载次数
  async incrementDownloadCount(id: string): Promise<void> {
    const db = await getDb()
    await db
      .update(contactInfo)
      .set({ downloadCount: sql`${contactInfo.downloadCount} + 1` })
      .where(eq(contactInfo.id, id));
  }
}

// 单例导出
export const contactInfoManager = new ContactInfoManager();
