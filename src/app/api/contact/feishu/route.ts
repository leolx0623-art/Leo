import { NextRequest, NextResponse } from 'next/server';

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

    if (!feishuWebhookUrl) {
      console.error('飞书 Webhook URL 未配置');
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

    const feishuMessage = {
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

    // 发送到飞书机器人
    const response = await fetch(feishuWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feishuMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('飞书机器人发送失败:', errorText);
      return NextResponse.json(
        { error: '消息发送失败，请稍后重试' },
        { status: 500 }
      );
    }

    console.log('飞书机器人消息发送成功:', { name, message });

    return NextResponse.json(
      {
        success: true,
        message: '留言已发送！我会尽快查看并回复您。'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('飞书机器人消息发送失败:', error);
    return NextResponse.json(
      { error: '消息发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
