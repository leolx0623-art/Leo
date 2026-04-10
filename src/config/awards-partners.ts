// 荣誉奖项和合作方配置
// 前端 JSON 常量定义，不需要数据库表

export interface Award {
  id: string
  name: string        // 奖项名称
  organization: string // 颁发机构
  date: string         // 获奖日期
  icon: string         // 图标 emoji
  description?: string // 描述
}

export interface Partner {
  id: string
  name: string      // 合作方名称
  logoUrl: string   // Logo URL
  link?: string     // 链接
  description?: string // 描述
}

// 荣誉奖项列表（示例数据，后续由用户维护）
export const AWARDS: Award[] = [
  // {
  //   id: '1',
  //   name: '最佳AIGC创作者',
  //   organization: '中国AI创意大赛',
  //   date: '2024-06',
  //   icon: '🏆',
  //   description: '凭借AI生成视频作品获得年度最佳AIGC创作者奖项',
  // },
]

// 合作方列表（示例数据，后续由用户维护）
export const PARTNERS: Partner[] = [
  // {
  //   id: '1',
  //   name: '字节跳动',
  //   logoUrl: '/assets/partners/bytedance.svg',
  //   link: 'https://www.bytedance.com',
  //   description: 'AI视频创作合作',
  // },
]
