import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 生成飞书机器人签名
function generateFeishuSign(timestamp: number, secret: string): string {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'utf-8'));
  const signature = hmac.update(Buffer.from(stringToSign, 'utf-8')).digest();
  return signature.toString('base64');
}

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

    // 从环境变量获取飞书 Webhook URL
    const feishuWebhookUrl = process.env.FEISHU_WEBHOOK_URL;
    const feishuSecret = process.env.FEISHU_WEBHOOK_SECRET;

    console.log('🔧 飞书 Webhook URL:', feishuWebhookUrl);
    console.log('🔐 飞书 Secret 是否配置:', !!feishuSecret);

    if (!feishuWebhookUrl) {
      console.error('❌ 飞书 Webhook URL 未配置');
      return NextResponse.json(
        { error: '飞书机器人未配置，请联系管理员' },
        { status: 500 }
      );
    }

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

    const feishuMessage: any = {
      msg_type: "interactive",
      card: {
        config: {
          wide_screen_mode: true
        },
        header: {
          title: {
            tag: "plain_text",
            content: "📬 新的访客留言"
          },
          template: "orange"
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**👤 访客姓名：** ${name}\n**📅 留言时间：** ${currentTime}\n**💬 留言内容：**\n${message}`
            }
          },
          {
            tag: "action",
            actions: [
              {
                tag: "button",
                text: {
                  tag: "plain_text",
                  content: "📧 回复邮件"
                },
                type: "primary",
                url: "mailto:hello@aigccreator.com"
              }
            ]
          }
        ]
      }
    };

    // 如果配置了密钥，添加签名验证
    if (feishuSecret) {
      const timestamp = Date.now();
      const sign = generateFeishuSign(timestamp, feishuSecret);
      feishuMessage.timestamp = timestamp;
      feishuMessage.sign = sign;
      console.log('🔐 已添加签名验证:', { timestamp, sign });
    } else {
      console.log('⚠️  未配置密钥，使用无签名模式');
    }

    console.log('📤 准备发送飞书消息:', JSON.stringify(feishuMessage, null, 2));

    // 发送到飞书机器人
    const response = await fetch(feishuWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    // 检查飞书返回的code
    if (responseData.code !== 0) {
      console.error('❌ 飞书返回错误:', responseData);
      return NextResponse.json(
        { error: `飞书返回错误: ${responseData.msg}` },
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
