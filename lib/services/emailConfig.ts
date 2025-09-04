import { emailService } from "./emailService";

export async function checkEmailConfig(): Promise<{
    isConfigured: boolean;
    missingConfigs: string[];
}> {
    const missingConfigs: string[] = [];

    if (!process.env.EMAIL_SERVICE) {
        missingConfigs.push("EMAIL_SERVICE");
    }

    if (!process.env.EMAIL_USER) {
        missingConfigs.push("EMAIL_USER");
    }

    if (!process.env.EMAIL_PASSWORD) {
        missingConfigs.push("EMAIL_PASSWORD");
    }

    // Only verify connection if we have all the required configs
    let connectionVerified = false;
    if (missingConfigs.length === 0) {
        connectionVerified = await emailService.verifyConnection();
        if (!connectionVerified) {
            missingConfigs.push("CONNECTION_FAILED");
        }
    }

    return {
        isConfigured: missingConfigs.length === 0 && connectionVerified,
        missingConfigs,
    };
}
