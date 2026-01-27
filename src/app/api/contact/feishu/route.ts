import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// 飞书机器人消息发送接口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    // 验证必填字段
    if (!name || !message) {
      return NextResponse.json(
        { error: '请填写姓名和留言内容' },
        { status: 400 }
      );
    }

    // 从环境变量获取飞书 Webhook URL 和密钥
    const feishuWebhookUrl = process.env.FEISHU_WEBHOOK_URL;
    const feishuWebhookSecret = process.env.FEISHU_WEBHOOK_SECRET;

    if (!feishuWebhookUrl) {
      console.error('❌ 飞书 Webhook URL 未配置');
      return NextResponse.json(
        { error: '飞书机器人未配置，请联系管理员' },
        { status: 500 }
      );
    }

    // 验证密钥格式（飞书密钥应该是32个字符）
    if (feishuWebhookSecret && feishuWebhookSecret.length !== 32) {
      console.error(`❌ 飞书密钥长度不正确: ${feishuWebhookSecret.length} 字符 (应该是 32 字符)`);
      console.error(`❌ 当前密钥: ${feishuWebhookSecret}`);
      return NextResponse.json(
        {
          error: '飞书机器人密钥配置错误：密钥长度不正确（应该是32个字符），请重新复制完整密钥',
          debug: {
            currentLength: feishuWebhookSecret.length,
            expectedLength: 32,
            currentSecret: feishuWebhookSecret.substring(0, 5) + '...' + feishuWebhookSecret.substring(-5)
          }
        },
        { status: 500 }
      );
    }

    if (!feishuWebhookSecret) {
      console.warn('⚠️ 飞书机器人密钥未配置，将使用无签名模式（可能失败）');
    }

    // 获取当前时间戳（秒）
    const timestamp = Math.floor(Date.now() / 1000);

    // 构建飞书机器人消息
    const currentTime = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const feishuMessage = {
      msg_type: "text",
      content: {
        text: `📬 新的访客留言\n\n👤 访客姓名：${name}\n📅 留言时间：${currentTime}\n💬 留言内容：\n${message}`
      }
    };

    console.log('📤 准备发送飞书消息:', JSON.stringify(feishuMessage));
    console.log('🔑 使用密钥:', feishuWebhookSecret ? '已配置' : '未配置');

    // 构建请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // 如果配置了密钥，添加签名验证
    if (feishuWebhookSecret) {
      // 计算签名：HMAC-SHA256(secret, timestamp)
      const sign = createHmac('sha256', feishuWebhookSecret)
        .update(timestamp.toString())
        .digest('base64');

      console.log('🔐 签名信息:', {
        timestamp,
        sign: sign.substring(0, 20) + '...' // 只显示前20个字符
      });

      headers['timestamp'] = timestamp.toString();
      headers['sign'] = sign;
    }

    // 发送到飞书机器人
    const response = await fetch(feishuWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(feishuMessage),
    });

    console.log('📊 飞书API响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 飞书机器人发送失败:', errorText);
      return NextResponse.json(
        { error: `消息发送失败: ${errorText}` },
        { status: 500 }
      );
    }

    const responseData = await response.json();
    console.log('✅ 飞书API响应数据:', responseData);

    // 检查飞书返回的code（0表示成功）
    if (responseData.code !== undefined && responseData.code !== 0) {
      console.error('❌ 飞书返回错误:', responseData);
      return NextResponse.json(
        { error: `飞书返回错误: ${responseData.msg || '未知错误'}` },
        { status: 500 }
      );
    }

    console.log('🎉 飞书机器人消息发送成功:', { name, message });

    return NextResponse.json(
      {
        success: true,
        message: '留言已发送！我会尽快查看并回复您。'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 飞书机器人消息发送失败:', error);
    return NextResponse.json(
      { error: '消息发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
