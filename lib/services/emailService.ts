import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    text?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
    }>;
}

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            // Optional: configure additional settings
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            // Retry on failure
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    // Method to send email
    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const emailDefaults = {
                from: `"AI Mock Interviews" <${process.env.EMAIL_USER}>`,
            };

            const info = await this.transporter.sendMail({
                ...emailDefaults,
                ...options,
            });

            console.log("Email sent: %s", info.messageId);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }

    // Verify connection configuration
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error("Email connection verification failed:", error);
            return false;
        }
    }
}

// Export singleton instance
export const emailService = new EmailService();
