/**
 * 飞书机器人 Webhook 测试脚本
 *
 * 用于验证飞书机器人配置是否正确
 * 使用方法：npx tsx scripts/test-feishu-webhook.ts
 */

import { createHmac } from 'crypto';

// 从环境变量读取配置（或者手动设置）
const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL || 'https://open.feishu.cn/open-apis/bot/v2/hook/da839b28-73d4-4572-854e-ef941033ee6f';
const WEBHOOK_SECRET = process.env.FEISHU_WEBHOOK_SECRET || 'ONHtg1cudF3QKiJ8edyrce';

async function testFeishuWebhook() {
  console.log('========================================');
  console.log('🧪 飞书机器人 Webhook 测试');
  console.log('========================================\n');

  // 1. 检查配置
  console.log('📋 配置检查：');
  console.log(`  Webhook URL: ${WEBHOOK_URL}`);
  console.log(`  密钥长度: ${WEBHOOK_SECRET.length} 字符`);

  if (WEBHOOK_SECRET.length !== 32) {
    console.log(`  ❌ 密钥长度不正确！应该是 32 字符，当前是 ${WEBHOOK_SECRET.length} 字符`);
    console.log(`  当前密钥: ${WEBHOOK_SECRET}`);
    console.log('\n⚠️ 解决方案：请重新复制飞书机器人的完整密钥（32个字符）\n');
    return;
  }
  console.log(`  ✅ 密钥长度正确\n`);

  // 2. 计算签名
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = createHmac('sha256', WEBHOOK_SECRET)
    .update(timestamp.toString())
    .digest('base64');

  console.log('🔐 签名信息：');
  console.log(`  时间戳: ${timestamp}`);
  console.log(`  签名: ${sign}`);
  console.log(`  签名预览: ${sign.substring(0, 20)}...\n`);

  // 3. 构建测试消息
  const testMessage = {
    msg_type: "text",
    content: {
      text: `🧪 飞书机器人测试消息\n\n🕒 测试时间：${new Date().toLocaleString('zh-CN')}\n🔑 密钥长度：${WEBHOOK_SECRET.length}\n✅ 签名验证已启用\n\n如果您看到这条消息，说明配置正确！`
    }
  };

  console.log('📤 准备发送测试消息...');
  console.log(`  消息内容: ${JSON.stringify(testMessage).substring(0, 100)}...\n`);

  // 4. 发送请求
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'timestamp': timestamp.toString(),
    'sign': sign,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(testMessage),
    });

    console.log('📊 响应信息：');
    console.log(`  状态码: ${response.status} ${response.statusText}`);
    console.log(`  Content-Type: ${response.headers.get('content-type')}\n`);

    const responseData = await response.json();
    console.log('📦 响应数据：');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('');

    if (responseData.code === 0) {
      console.log('✅ 测试成功！请检查飞书群是否收到测试消息\n');
    } else {
      console.log('❌ 测试失败：');
      console.log(`  错误码: ${responseData.code}`);
      console.log(`  错误信息: ${responseData.msg}\n`);

      // 根据错误码提供解决方案
      if (responseData.code === 19021) {
        console.log('⚠️ 签名验证失败（code: 19021）');
        console.log('可能原因：');
        console.log('  1. 密钥复制不完整（必须 32 个字符）');
        console.log('  2. 飞书机器人未开启"签名校验"');
        console.log('  3. 密钥已过期或被重置');
        console.log('\n解决方案：');
        console.log('  1. 进入飞书群 -> 机器人管理 -> 机器人设置');
        console.log('  2. 确认"签名校验"已开启');
        console.log('  3. 重新复制完整的 32 位密钥');
        console.log('  4. 更新 .env 文件中的 FEISHU_WEBHOOK_SECRET\n');
      } else if (responseData.code === 99991663) {
        console.log('⚠️ 机器人不存在或已被删除（code: 99991663）');
        console.log('解决方案：重新创建机器人并获取新的 Webhook URL\n');
      }
    }
  } catch (error) {
    console.log('💥 请求失败：');
    console.log(error);
  }

  console.log('========================================');
}

// 运行测试
testFeishuWebhook().catch(console.error);
