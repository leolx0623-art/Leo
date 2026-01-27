/**
 * 飞书机器人详细诊断工具
 *
 * 帮助用户诊断飞书机器人配置问题
 * 使用方法：npx tsx scripts/diagnose-feishu.ts
 */

import { createHmac } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// 读取.env文件
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env: Record<string, string> = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });

    return env;
  } catch (error) {
    console.error('❌ 无法读取 .env 文件');
    return {};
  }
}

function diagnoseFeishu() {
  console.log('========================================');
  console.log('🔍 飞书机器人配置诊断');
  console.log('========================================\n');

  const env = loadEnv();

  // 1. 检查 Webhook URL
  console.log('📋 步骤 1：检查 Webhook URL');
  const webhookUrl = env.FEISHU_WEBHOOK_URL;
  console.log(`  Webhook URL: ${webhookUrl || '未配置'}`);

  if (!webhookUrl) {
    console.log('  ❌ Webhook URL 未配置\n');
    return;
  }

  // 验证 URL 格式
  const urlPattern = /^https:\/\/open\.feishu\.cn\/open-apis\/bot\/v2\/hook\/[a-f0-9-]+$/i;
  if (!urlPattern.test(webhookUrl)) {
    console.log('  ⚠️ Webhook URL 格式可能不正确\n');
  } else {
    console.log('  ✅ Webhook URL 格式正确\n');
  }

  // 2. 检查密钥
  console.log('🔑 步骤 2：检查密钥配置');
  const secret = env.FEISHU_WEBHOOK_SECRET;
  console.log(`  密钥长度: ${secret?.length || 0} 字符`);

  if (!secret) {
    console.log('  ❌ 密钥未配置');
    console.log('  💡 解决方案：在 .env 文件中添加 FEISHU_WEBHOOK_SECRET\n');
    return;
  }

  // 验证密钥长度
  if (secret.length !== 32) {
    console.log(`  ❌ 密钥长度不正确！`);
    console.log(`     当前长度: ${secret.length} 字符`);
    console.log(`     要求长度: 32 字符`);
    console.log(`     缺少: ${32 - secret.length} 字符\n`);

    console.log('  🔍 密钥详情：');
    console.log(`     完整密钥: ${secret}`);
    console.log(`     前10位: ${secret.substring(0, 10)}`);
    console.log(`     后10位: ${secret.substring(-10)}`);

    // 检查是否包含特殊字符
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(secret);
    if (hasSpecialChars) {
      console.log('  ⚠️ 警告：密钥包含非字母数字字符，可能复制错误\n');
    }

    console.log('\n  💡 解决方案：');
    console.log('     1. 打开飞书群聊 → 机器人管理 → 找到机器人 → 设置');
    console.log('     2. 进入"安全设置" → 确认"签名校验"已开启');
    console.log('     3. 使用"复制"按钮完整复制密钥（必须是32字符）');
    console.log('     4. 粘贴到 .env 文件的 FEISHU_WEBHOOK_SECRET\n');
    return;
  }

  console.log('  ✅ 密钥长度正确（32字符）\n');

  // 3. 测试签名计算
  console.log('🔐 步骤 3：测试签名计算');
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = createHmac('sha256', secret)
    .update(timestamp.toString())
    .digest('base64');

  console.log(`  当前时间戳: ${timestamp}`);
  console.log(`  计算的签名: ${sign}`);
  console.log(`  签名长度: ${sign.length} 字符`);
  console.log('  ✅ 签名计算成功\n');

  // 4. 验证时间戳格式
  console.log('⏰ 步骤 4：验证时间戳');
  const currentDate = new Date(timestamp * 1000);
  console.log(`  时间戳日期: ${currentDate.toISOString()}`);
  console.log(`  本地日期: ${currentDate.toLocaleString('zh-CN')}`);

  // 检查时间戳是否在合理范围内（1小时内）
  const now = Date.now();
  const diff = Math.abs(now - timestamp * 1000);
  const diffMinutes = Math.floor(diff / 1000 / 60);

  if (diffMinutes > 60) {
    console.log(`  ⚠️ 警告：时间戳偏差 ${diffMinutes} 分钟，可能超出飞书允许范围`);
  } else {
    console.log('  ✅ 时间戳在合理范围内\n');
  }

  // 5. 模拟发送请求
  console.log('📤 步骤 5：模拟发送请求');

  const testMessage = {
    msg_type: "text",
    content: {
      text: `🧪 飞书机器人诊断测试\n\n🕒 测试时间：${new Date().toLocaleString('zh-CN')}\n🔑 密钥长度：${secret.length} 字符\n⏰ 时间戳：${timestamp}\n🔐 签名：${sign.substring(0, 20)}...\n\n如果收到此消息，说明配置正确！`
    }
  };

  console.log(`  请求头：`);
  console.log(`    Content-Type: application/json`);
  console.log(`    timestamp: ${timestamp}`);
  console.log(`    sign: ${sign.substring(0, 20)}...\n`);

  console.log(`  消息体：`);
  console.log(`    ${JSON.stringify(testMessage).substring(0, 100)}...\n`);

  // 6. 总结
  console.log('========================================');
  console.log('📊 诊断总结');
  console.log('========================================\n');

  const allChecksPassed = secret.length === 32;

  if (allChecksPassed) {
    console.log('✅ 所有检查通过！');
    console.log('\n🎉 下一步：');
    console.log('  1. 运行实际测试：npx tsx scripts/test-feishu-webhook.ts');
    console.log('  2. 或者在网站联系页面提交测试留言');
    console.log('  3. 检查飞书群是否收到消息\n');
  } else {
    console.log('❌ 发现配置问题！');
    console.log('\n🔧 请按照上述提示修复问题后重新运行诊断。\n');
  }

  console.log('========================================\n');
}

// 运行诊断
diagnoseFeishu().catch(console.error);
