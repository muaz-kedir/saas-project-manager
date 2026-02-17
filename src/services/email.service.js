const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP)
  // For production, use real SMTP service (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Development: Log to console instead of sending
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 EMAIL WOULD BE SENT:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.html || mailOptions.text);
      console.log('\n');
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

// Send invitation email
exports.sendInvitationEmail = async ({ to, name, workspaceName, inviterName, token }) => {
  const transporter = createTransporter();
  
  const acceptUrl = `${process.env.CLIENT_URL}/accept-invitation/${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@projecthub.com',
    to,
    subject: `You've been invited to join ${workspaceName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 ProjectHub Invitation</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p><strong>${inviterName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> on ProjectHub.</p>
            <p>Click the button below to accept the invitation and get started:</p>
            <center>
              <a href="${acceptUrl}" class="button">Accept Invitation</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${acceptUrl}</p>
            <p><small>This invitation will expire in 7 days.</small></p>
          </div>
          <div class="footer">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name}!

${inviterName} has invited you to join the workspace "${workspaceName}" on ProjectHub.

Accept the invitation by visiting this link:
${acceptUrl}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invitation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
