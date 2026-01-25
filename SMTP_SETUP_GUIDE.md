# SMTP 邮件服务配置指南

本指南将帮助您配置 SMTP 邮件服务，让联系表单的消息能够发送到您的邮箱。

## 快速开始

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件（参考 `.env.example`）：

```bash
cp .env.example .env
```

### 2. 填写 SMTP 配置

编辑 `.env` 文件，填写您的邮箱配置信息。

## 常用邮箱服务商配置

### Gmail

**SMTP 配置：**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
RECIPIENT_EMAIL=your-email@gmail.com
```

**获取应用专用密码：**
1. 访问 [Google 账号安全页面](https://myaccount.google.com/security)
2. 启用两步验证（如果未启用）
3. 搜索"应用专用密码"或访问 https://myaccount.google.com/apppasswords
4. 选择"邮件"和"其他（自定义名称）"，输入名称如"AIGC Website"
5. 点击生成，复制生成的16位密码

**注意：** 不能使用 Gmail 登录密码，必须使用应用专用密码。

---

### QQ 邮箱

**SMTP 配置：**
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=your-email@qq.com
SMTP_PASS=your-authorization-code
RECIPIENT_EMAIL=your-email@qq.com
```

**获取授权码：**
1. 登录 QQ 邮箱网页版
2. 进入"设置" -> "账户"
3. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启"IMAP/SMTP服务"
5. 按提示发送短信验证
6. 复制生成的16位授权码

---

### 163 邮箱

**SMTP 配置：**
```
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_USER=your-email@163.com
SMTP_PASS=your-authorization-code
RECIPIENT_EMAIL=your-email@163.com
```

**获取授权码：**
1. 登录 163 邮箱网页版
2. 进入"设置" -> "POP3/SMTP/IMAP"
3. 开启"IMAP/SMTP服务"
4. 按提示发送短信验证
5. 复制生成的授权码

**注意：** 163 邮箱建议使用 465 端口（SSL加密）。

---

### Outlook / Hotmail

**SMTP 配置：**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
RECIPIENT_EMAIL=your-email@outlook.com
```

---

### 企业邮箱 / 其他服务商

请咨询您的邮箱服务商获取 SMTP 配置信息。

通常需要：
- SMTP 服务器地址
- 端口号
- 用户名
- 密码/授权码

## 配置说明

### 环境变量说明

| 变量名 | 说明 | 示例 | 必填 |
|--------|------|------|------|
| SMTP_HOST | SMTP 服务器地址 | smtp.gmail.com | ✅ |
| SMTP_PORT | SMTP 端口 | 587 | ✅ |
| SMTP_USER | 发件邮箱 | user@example.com | ✅ |
| SMTP_PASS | 邮箱密码或授权码 | xyz123abc | ✅ |
| RECIPIENT_EMAIL | 收件邮箱 | recipient@example.com | ❌（默认使用 SMTP_USER） |

### 端口说明

| 端口 | 加密方式 | 说明 |
|------|----------|------|
| 25 | 无加密 | 不推荐，可能被防火墙拦截 |
| 587 | TLS加密 | 推荐使用 |
| 465 | SSL加密 | 推荐使用 |

### 收件人配置

- 如果只配置 `SMTP_USER`，邮件将发送到此邮箱
- 如果配置 `RECIPIENT_EMAIL`，邮件将发送到此邮箱（可以使用其他邮箱）

## 测试配置

配置完成后，重启开发服务器：

```bash
# 停止当前服务
# 然后启动
coze dev
```

在联系页面填写表单并发送，检查您的邮箱是否收到邮件。

## 常见问题

### 1. 邮件发送失败 - SMTP 配置错误

**原因：** SMTP 服务器地址、端口或凭据不正确

**解决：**
- 检查 SMTP_HOST 和 SMTP_PORT 是否正确
- 确认 SMTP_USER 和 SMTP_PASS 是否匹配
- 对于 Gmail/QQ/163，确保使用授权码而非登录密码

### 2. 邮件发送失败 - 认证失败

**原因：** 密码或授权码错误

**解决：**
- Gmail：重新生成应用专用密码
- QQ/163：重新生成授权码
- 检查是否有空格或特殊字符

### 3. 邮件发送失败 - 连接超时

**原因：** 网络问题或防火墙拦截

**解决：**
- 检查网络连接
- 尝试更换端口（587 或 465）
- 检查防火墙设置

### 4. 收到邮件但格式错乱

**原因：** 邮件客户端不支持 HTML

**解决：** 代码已包含纯文本版本，兼容所有邮件客户端

### 5. 邮件进入垃圾箱

**原因：** 邮件服务商的反垃圾邮件机制

**解决：**
- 将发件邮箱地址添加到联系人/白名单
- 检查邮箱的垃圾邮件文件夹

## 安全建议

1. **不要提交敏感信息到代码仓库**
   - `.env` 文件已在 `.gitignore` 中
   - 只提交 `.env.example`

2. **使用授权码而非登录密码**
   - Gmail、QQ、163 等都要求使用授权码
   - 授权码可以随时撤销

3. **限制发送频率**
   - 当前代码没有限流，建议在生产环境添加限流机制

4. **定期更换密码**
   - 建议定期更换 SMTP 密码或授权码

## 生产环境部署

部署到生产环境时，需要在部署平台配置环境变量：

- **Vercel**: Settings -> Environment Variables
- **Netlify**: Site settings -> Environment variables
- **Docker**: 使用 `-e` 参数或 `env_file`

## 需要帮助？

如果遇到问题：
1. 检查 `.env` 文件配置是否正确
2. 查看服务器日志中的错误信息
3. 确认邮箱服务是否启用 SMTP
4. 联系邮箱服务商获取帮助
