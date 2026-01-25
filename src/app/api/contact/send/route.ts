import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 邮件发送接口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 从环境变量获取 SMTP 配置
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL || smtpUser;

    // 检查 SMTP 配置
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP 配置缺失');
      return NextResponse.json(
        { error: '邮件服务配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 构建邮件内容
    const mailOptions = {
      from: `"${name}" <${smtpUser}>`,
      to: recipientEmail,
      subject: `[网站咨询] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
              📬 新的合作咨询
            </h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0; color: #666;">
                <strong>姓名：</strong>
                <span style="color: #333; background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${name}</span>
              </p>
              <p style="margin: 10px 0; color: #666;">
                <strong>邮箱：</strong>
                <a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a>
              </p>
              <p style="margin: 10px 0; color: #666;">
                <strong>主题：</strong>
                <span style="color: #333;">${subject}</span>
              </p>
            </div>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0; color: #666;"><strong>留言内容：</strong></p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6; color: #333; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #999; font-size: 12px;">
              <p>此邮件由 AIGC 创作者网站发送</p>
              <p>发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>
          </div>
        </div>
      `,
      text: `
        新的合作咨询
        
        姓名：${name}
        邮箱：${email}
        主题：${subject}
        
        留言内容：
        ${message}
        
        ---
        此邮件由 AIGC 创作者网站发送
        发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    console.log('邮件发送成功:', { to: recipientEmail, from: email, subject });

    return NextResponse.json(
      { 
        success: true, 
        message: '消息发送成功！我们会尽快回复您。' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('邮件发送失败:', error);
    return NextResponse.json(
      { error: '消息发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
