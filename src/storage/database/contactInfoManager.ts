import { eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import {
  contactInfo,
  ContactInfo,
  InsertContactInfo,
  UpdateContactInfo,
} from "./shared/schema"

// 延迟创建数据库连接 - 避免在没有数据库环境时报错
let poolInstance: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    const host = process.env.COZE_DB_HOST || process.env.PGHOST;
    if (!host) {
      throw new Error("Database not configured");
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

export class ContactInfoManager {
  // 获取联系信息（只返回第一条记录）
  async getContactInfo(): Promise<ContactInfo | null> {
    const result = await getDb().select().from(contactInfo).limit(1);
    return result[0] || null;
  }

  // 创建联系信息
  async createContactInfo(data: InsertContactInfo): Promise<ContactInfo> {
    const [newInfo] = await getDb().insert(contactInfo).values(data).returning();
    return newInfo;
  }

  // 更新联系信息
  async updateContactInfo(id: string, data: UpdateContactInfo): Promise<ContactInfo | null> {
    const [updated] = await getDb()
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getResumeDownloadUrl(_resumeKey: string): Promise<string | null> {
    // TODO: 使用 S3 SDK 生成签名 URL
    return null;
  }

  // 增加下载次数
  async incrementDownloadCount(id: string): Promise<void> {
    await getDb()
      .update(contactInfo)
      .set({ downloadCount: sql`${contactInfo.downloadCount} + 1` })
      .where(eq(contactInfo.id, id));
  }
}

// 单例导出
export const contactInfoManager = new ContactInfoManager();
