interface BaseTemplateProps {
    baseUrl: string;
}

interface InvitationEmailTemplateProps extends BaseTemplateProps {
    recipientEmail: string;
    senderName: string;
    receiverName: string;
    invitationLink: string;
    interviewRole: string;
    interviewLevel: string;
}

// Base template with common CSS and layout
export function baseEmailTemplate(content: string): string {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        max-width: 600px; 
        margin: 0 auto; 
      }
      .container { 
        padding: 20px; 
        border: 1px solid #e1e1e1; 
        border-radius: 5px; 
      }
      .header { 
        background-color: #6870a6; 
        color: white; 
        padding: 10px 20px; 
        border-radius: 5px 5px 0 0; 
        margin-top: 20px; 
      }
      .content { 
        padding: 20px; 
        background-color: #f9f9f9; 
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #cac5fe;
        color: #24273a;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        margin-top: 20px;
      }
      .footer { 
        margin-top: 20px; 
        font-size: 12px; 
        color: #777; 
        text-align: center; 
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
    </div>
  </body>
  </html>
  `;
}

// Interview invitation template
export function invitationEmailTemplate({
    senderName,
    receiverName,
    invitationLink,
    interviewRole,
    interviewLevel
}: InvitationEmailTemplateProps): string {
    const content = `
    <div class="header">
      <h2>Mock Interview Invitation</h2>
    </div>
    <div class="content">
      <p>Hello, <strong>${receiverName}</strong></p>
      <p>You've been invited by <strong>${senderName}</strong> to take an interview for a <strong>${interviewRole}</strong> position at <strong>${interviewLevel}</strong> level.</p>
      <p>Please click the button below to access your interview:</p>
      <div style="text-align: center;">
        <a href="${invitationLink}" class="button">Start Your Interview</a>
      </div>
      <p>The link will remain active until you complete the interview.</p>
    </div>
    <div class="footer">
      <p>This is an automated email from AMALITECH. Please do not reply to this email.</p>
    </div>
  `;

    return baseEmailTemplate(content);
}

// Confirmation email template
export function confirmationEmailTemplate(props: {
    baseUrl: string;
    recipientName: string;
    interviewDate: string;
    interviewType: string;
    confirmationCode: string;
}): string {
    const content = `
    <div class="header">
      <h2>Interview Confirmation</h2>
    </div>
    <div class="content">
      <p>Hello ${props.recipientName},</p>
      <p>Your mock interview has been successfully scheduled for <strong>${props.interviewDate}</strong>.</p>
      <p>Interview type: <strong>${props.interviewType}</strong></p>
      <p>Your confirmation code is: <strong>${props.confirmationCode}</strong></p>
      <p>Please keep this information for your records.</p>
      <div style="text-align: center;">
        <a href="${props.baseUrl}/dashboard" class="button">View Your Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated email from AI Mock Interviews. Please do not reply to this email.</p>
    </div>
  `;

    return baseEmailTemplate(content);
}

// Feedback email template
export function feedbackEmailTemplate(props: {
    baseUrl: string;
    recipientName: string;
    interviewRole: string;
    overallScore: number;
    feedbackLink: string;
}): string {
    const content = `
    <div class="header">
      <h2>Interview Feedback Available</h2>
    </div>
    <div class="content">
      <p>Hello ${props.recipientName},</p>
      <p>Your feedback for the <strong>${props.interviewRole}</strong> mock interview is now available.</p>
      <p>Overall Score: <strong>${props.overallScore}/100</strong></p>
      <p>Click the button below to view your detailed feedback:</p>
      <div style="text-align: center;">
        <a href="${props.feedbackLink}" class="button">View Feedback</a>
      </div>
      <p>Use this feedback to improve your interview skills for future opportunities.</p>
    </div>
    <div class="footer">
      <p>This is an automated email from AI Mock Interviews. Please do not reply to this email.</p>
    </div>
  `;

    return baseEmailTemplate(content);
}
