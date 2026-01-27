/**
 * 飞书机器人无签名模式测试脚本
 *
 * 用于测试飞书机器人在未开启签名校验时是否能正常工作
 * 使用方法：npx tsx scripts/test-feishu-no-sign.ts
 */

async function testFeishuNoSignature() {
  console.log('========================================');
  console.log('🧪 飞书机器人无签名模式测试');
  console.log('========================================\n');

  // 从环境变量读取配置
  const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL || 'https://open.feishu.cn/open-apis/bot/v2/hook/da839b28-73d4-4572-854e-ef941033ee6f';
  const SECRET = process.env.FEISHU_WEBHOOK_SECRET || 'ONHtg1cudF3QKiJ8edyrce';

  console.log('📋 配置信息：');
  console.log(`  Webhook URL: ${WEBHOOK_URL}`);
  console.log(`  密钥: ${SECRET}`);
  console.log(`  密钥长度: ${SECRET.length} 字符`);

  // 判断是否启用签名
  const useSignature = SECRET.length === 32;
  console.log(`  签名模式: ${useSignature ? '已启用' : '未启用'}\n`);

  // 构建测试消息
  const testMessage = {
    msg_type: "text",
    content: {
      text: `🧪 飞书机器人无签名模式测试\n\n🕒 测试时间：${new Date().toLocaleString('zh-CN')}\n🔑 密钥长度：${SECRET.length} 字符\n📤 发送模式：${useSignature ? '带签名' : '无签名'}\n\n✅ 如果收到此消息，说明配置正确！`
    }
  };

  console.log('📤 准备发送测试消息...');
  console.log(`  消息类型: ${testMessage.msg_type}`);
  console.log(`  消息预览: ${testMessage.content.text.substring(0, 50)}...\n`);

  // 构建请求头
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 如果密钥是32位，添加签名
  if (useSignature) {
    const { createHmac } = await import('crypto');
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = createHmac('sha256', SECRET)
      .update(timestamp.toString())
      .digest('base64');

    headers['timestamp'] = timestamp.toString();
    headers['sign'] = sign;

    console.log('🔐 已添加签名验证：');
    console.log(`  时间戳: ${timestamp}`);
    console.log(`  签名: ${sign.substring(0, 20)}...\n`);
  } else {
    console.log('📤 使用无签名模式发送消息（不添加签名）\n');
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(testMessage),
    });

    console.log('📊 响应信息：');
    console.log(`  状态码: ${response.status} ${response.statusText}\n`);

    const responseData = await response.json();
    console.log('📦 响应数据：');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('');

    if (responseData.code === 0) {
      console.log('✅ 测试成功！请检查飞书群是否收到测试消息');
      console.log('');
      console.log('📋 配置总结：');
      console.log(`  当前模式: ${useSignature ? '签名验证模式' : '无签名模式'}`);
      console.log(`  密钥长度: ${SECRET.length} 字符`);

      if (!useSignature) {
        console.log('');
        console.log('💡 说明：');
        console.log('  飞书机器人当前使用"无签名模式"');
        console.log('  这种模式虽然可以正常工作，但安全性较低');
        console.log('  建议在飞书机器人设置中开启"签名校验"以提升安全性');
      }
    } else {
      console.log('❌ 测试失败：');
      console.log(`  错误码: ${responseData.code}`);
      console.log(`  错误信息: ${responseData.msg}\n`);

      // 根据错误码提供解决方案
      if (responseData.code === 19021) {
        console.log('⚠️ 签名验证失败（code: 19021）');
        console.log('');
        console.log('可能原因：');
        console.log('  1. 飞书机器人开启了"签名校验"，但您未提供正确的32位密钥');
        console.log('  2. 当前密钥长度不是32字符，无法通过签名验证');
        console.log('');
        console.log('解决方案：');
        console.log('  方案A：关闭飞书机器人的"签名校验"功能（简单但安全性低）');
        console.log('  方案B：重新开启"签名校验"并获取32位完整密钥（推荐）');
        console.log('');
        console.log('🔧 方案A操作步骤：');
        console.log('  1. 打开飞书群聊 → 机器人管理 → 找到机器人 → 设置');
        console.log('  2. 进入"安全设置"');
        console.log('  3. 取消勾选"签名校验"');
        console.log('  4. 保存设置');
        console.log('  5. 重新运行测试：npx tsx scripts/test-feishu-no-sign.ts');
      } else if (responseData.code === 99991663) {
        console.log('⚠️ 机器人不存在或已被删除（code: 99991663）');
        console.log('解决方案：重新创建机器人并获取新的 Webhook URL\n');
      }
    }
  } catch (error) {
    console.log('💥 请求失败：');
    console.log(error);
  }

  console.log('========================================\n');
}

// 运行测试
testFeishuNoSignature().catch(console.error);
