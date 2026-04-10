# AIGC Creator Portfolio Website - 部署指南

## 📦 代码打包文件

代码已打包完成：`/workspace/projects-code.zip`

---

## 🚀 GitHub 部署步骤

### 方式一：使用已有的 GitHub 仓库

如果您已经有 GitHub 仓库：

```bash
# 克隆您的仓库
git clone https://github.com/您的用户名/您的仓库名.git
cd 您的仓库名

# 如果是新仓库，添加远程
git remote add origin https://github.com/您的用户名/您的仓库名.git
git push -u origin main
```

### 方式二：创建新的 GitHub 仓库

#### 步骤 1：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `aigc-portfolio`（或您喜欢的名字）
   - Description: `AIGC创作者个人网站`
   - 选择 Private（私有）或 Public（公开）
   - **不要勾选** "Add a README file"
   - **不要选择** .gitignore（我们会用项目自带的）

3. 点击 "Create repository"

#### 步骤 2：初始化本地 Git 并推送到 GitHub

在项目目录中执行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: AIGC创作者个人网站，包含作品集、AI数字分身、后台管理系统"

# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/aigc-portfolio.git

# 推送到 GitHub
git push -u origin main
```

#### 步骤 3：验证推送成功

访问您的 GitHub 仓库页面，确认代码已上传。

---

## ⚙️ 本地开发环境配置

### 1. 解压代码（如果使用打包文件）

```bash
unzip projects-code.zip
cd projects
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下内容：

```env
# 数据库配置（使用您自己的数据库或云数据库）
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database

# 或使用 coze-coding-dev-sdk 的配置
COZE_DB_HOST=your-db-host
COZE_DB_USER=your-db-user
COZE_DB_PASSWORD=your-db-password
COZE_DB_NAME=your-db-name

# SMTP 邮件配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
RECIPIENT_EMAIL=recipient@example.com

# 飞书机器人配置
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx
FEISHU_WEBHOOK_SECRET=your-secret

# 后台管理员账号
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5000

---

## 🌐 生产环境部署

### 使用 Vercel（推荐）

1. 将代码推送到 GitHub
2. 访问 https://vercel.com/new
3. 导入您的 GitHub 仓库
4. 配置环境变量
5. 点击 Deploy

### 使用 Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./
COPY --from=builder /app/public ./public
EXPOSE 5000
CMD ["node", "server.js"]
```

### 使用 PM2

```bash
pnpm build
pm2 start pnpm --name "aigc-portfolio" -- start
```

---

## 📁 项目结构

```
aigc-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 后台管理页面
│   │   ├── api/              # API 接口
│   │   │   ├── chat/         # AI 对话
│   │   │   ├── contact/       # 联系表单 + 飞书机器人
│   │   │   ├── profile/       # 个人名片
│   │   │   ├── portfolios/    # 作品集
│   │   │   └── settings/      # 网站设置
│   │   ├── chat/              # AI 交流页面
│   │   ├── contact/           # 联系我页面
│   │   └── portfolio/         # 作品集页面
│   ├── components/            # React 组件
│   │   └── admin/             # 后台管理组件
│   └── storage/               # 数据库管理
├── public/                    # 静态资源
├── .env.example              # 环境变量模板
├── package.json
└── README.md
```

---

## 🔑 主要功能

### 1. 后台管理系统（/admin）
- 用户名：`admin`
- 密码：`admin123`
- 功能：个人名片管理、作品集管理、网站设置

### 2. 作品集（/portfolio）
- 分类展示
- 拖拽排序
- 详情查看

### 3. AI 数字分身（/chat）
- 流式对话
- 生图功能
- 作品推荐

### 4. 联系表单（/contact）
- 邮件发送
- 飞书机器人实时推送

---

## 🛠️ 技术栈

- **前端框架**: Next.js 16 + React 19
- **类型系统**: TypeScript 5
- **样式**: Tailwind CSS 4 + shadcn/ui
- **数据库**: PostgreSQL + Drizzle ORM
- **AI 集成**: coze-coding-dev-sdk
- **邮件**: Nodemailer + SMTP
- **消息推送**: 飞书自定义机器人

---

## ❓ 常见问题

### Q: 数据库如何创建？
```bash
# 使用 Drizzle Studio
pnpm drizzle-kit studio
```

### Q: 飞书机器人如何配置？
参考项目中的 `FEISHU_*.md` 文件

### Q: 如何修改管理员密码？
编辑 `.env` 文件中的 `NEXT_PUBLIC_ADMIN_PASSWORD`

### Q: 生产环境需要注意什么？
1. 修改默认管理员密码
2. 配置正确的数据库连接
3. 配置 SSL 证书
4. 设置环境变量

---

## 📞 获取帮助

如有问题，请提交 GitHub Issue 或联系开发者。
