import { db } from "@/firebase/admin";
import { getUserByEmail, getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { emailService } from "@/lib/services/emailService";
import { checkEmailConfig } from "@/lib/services/emailConfig";
import { invitationEmailTemplate } from "@/lib/templates/emailTemplates";
import { SendInvitationEmailParams } from "@/types";

export async function POST(request: Request) {
    try {
        // Get current user from session cookie
        const user = await getCurrentUser();

        if (!user) {
            return Response.json({
                success: false,
                error: "Unauthorized. Please sign in first."
            }, { status: 401 });
        }

        if (user.role !== "admin") {
            return Response.json({
                success: false,
                error: "Unauthorized. Admin access required."
            }, { status: 403 });
        }

        const { interviewId, recipientEmail } = await request.json();

        // Validate required fields
        if (!interviewId || !recipientEmail) {
            return Response.json({
                success: false,
                error: "Missing required fields"
            }, { status: 400 });
        }

        // Try to find existing user by email, but don't require it
        const recipientUser = await getUserByEmail(recipientEmail);

        // If user doesn't exist, we'll create an invitation for them to sign up
        const recipientId = recipientUser?.id || null;

        // Generate a display name from email if user doesn't exist
        const recipientName = recipientUser?.name || recipientEmail.split('@')[0];

        // Check if interview exists
        const interviewRef = db.collection("interviews").doc(interviewId);
        const interviewDoc = await interviewRef.get();

        if (!interviewDoc.exists) {
            return Response.json({
                success: false,
                error: "Interview not found"
            }, { status: 404 });
        }

        // Create invitation
        const invitation = {
            interviewId,
            senderName: user.name,
            senderId: user.id,
            recipientId: recipientId,
            recipientEmail: recipientEmail,
            recipientName: recipientName,
            status: "pending",
            createdAt: new Date().toISOString(),
            invitationToken: generateInvitationToken(),
        };

        const docRef = await db.collection("invitations").add(invitation);

        // Get interview details to include in the email
        const interview = await getInterviewById(interviewId);

        // Create invitation link
        const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interviewId}?invitationToken=${invitation.invitationToken}`;

        try {
            // Check if email is configured
            const { isConfigured, missingConfigs } = await checkEmailConfig();

            let emailSent = false;
            let emailStatus = "Invitation created but email was not sent: Email not configured";

            // Only attempt to send email if properly configured
            if (isConfigured) {
                emailSent = await sendInvitationEmail({
                    recipientEmail,
                    senderName: user.name,
                    receiverName: recipientName,
                    invitationLink,
                    interviewRole: interview?.role || "Interview",
                    interviewLevel: interview?.level || "Entry",
                });

                emailStatus = emailSent
                    ? "Invitation email sent successfully"
                    : "Failed to send invitation email, but invitation was created";
            } else {
                console.warn("Email not configured properly:", missingConfigs);
            }

            return Response.json({
                success: true,
                emailSent,
                emailStatus,
                emailConfigured: isConfigured,
                data: {
                    id: docRef.id,
                    ...invitation,
                    invitationLink
                }
            }, { status: 201 });
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError);

            // Still return success as the invitation was created in the database
            return Response.json({
                success: true,
                emailSent: false,
                emailStatus: "Error sending invitation email, but invitation was created",
                data: {
                    id: docRef.id,
                    ...invitation,
                    invitationLink
                }
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Error creating invitation:", error);
        return Response.json({
            success: false,
            error: error
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return Response.json({
                success: false,
                error: "Missing userId parameter"
            }, { status: 400 });
        }

        // Get all invitations for the user
        const invitations = await db
            .collection("invitations")
            .where("senderId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        const invitationsData = invitations.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return Response.json({
            success: true,
            data: invitationsData
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching invitations:", error);
        return Response.json({
            success: false,
            error: error
        }, { status: 500 });
    }
}

// Helper function to generate a random invitation token
function generateInvitationToken() {
    return Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join('');
}


async function sendInvitationEmail({
    recipientEmail,
    senderName,
    receiverName,
    invitationLink,
    interviewRole,
    interviewLevel,
}: SendInvitationEmailParams): Promise<boolean> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

        // Generate the HTML content using our template
        const htmlContent = invitationEmailTemplate({
            baseUrl,
            recipientEmail,
            senderName,
            receiverName,
            invitationLink,
            interviewRole,
            interviewLevel,
        });

        // Send the email using our email service
        const emailSent = await emailService.sendEmail({
            to: recipientEmail,
            subject: `Mock Interview Invitation from ${senderName}`,
            html: htmlContent,
        });

        return emailSent;
    } catch (error) {
        console.error("Error sending invitation email:", error);
        return false;
    }
}
