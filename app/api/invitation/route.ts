import { db } from "@/firebase/admin";
import { getUserByEmail } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { withAdminAuthHandler, withAuthHandler } from "@/lib/middleware/auth.middleware";
import { emailService } from "@/lib/services/emailService";
import { checkEmailConfig } from "@/lib/services/emailConfig";
import { invitationEmailTemplate } from "@/lib/templates/emailTemplates";
import { randomUUID } from "crypto";

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

export const POST = withAdminAuthHandler(async (request: Request, user: User) => {
    try {
        const { interviewId, recipientEmail, recipientName, deadline } = await request.json();

        // Validate required fields
        if (!interviewId || !recipientEmail || !deadline) {
            return Response.json({
                success: false,
                error: "Missing required fields"
            }, { status: 400 });
        }

        // check if the deadline is a valid date
        if (isNaN(Date.parse(deadline))) {
            return Response.json({
                success: false,
                error: "Invalid deadline format"
            }, { status: 400 });
        }

        // Check if user exists, if not create a temporary account
        let recipientUser = await getUserByEmail(recipientEmail);
        let accountCreated = false;

        if (!recipientUser) {
            // Create a temporary user account in Firestore
            const temporaryUserId = randomUUID();
            const defaultName = recipientName || recipientEmail.split('@')[0];

            try {
                // Create user in Firestore (not creating Firebase Auth account yet)
                await db.collection("users").doc(temporaryUserId).set({
                    name: defaultName,
                    email: recipientEmail,
                    role: UserRole.USER, // Default user role
                    profileURL: "",
                    temporaryAccount: true,
                    createdAt: new Date().toISOString()
                });

                // Get the newly created user
                recipientUser = {
                    id: temporaryUserId,
                    name: defaultName,
                    email: recipientEmail,
                    role: UserRole.USER,
                    profileURL: "",
                    temporaryAccount: true
                };

                accountCreated = true;
            } catch (error) {
                console.error("Error creating temporary account:", error);
                return Response.json({
                    success: false,
                    error: "Failed to create temporary account for the recipient"
                }, { status: 500 });
            }
        }

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
            senderId: user.id,
            recipientId: recipientUser.id,
            status: "sent",
            deadline: deadline,
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
                    recipientEmail: recipientUser.email,
                    senderName: user.name,
                    receiverName: recipientUser.name || recipientUser.email.split('@')[0],
                    invitationLink,
                    interviewRole: interview?.role || "technical",
                    interviewLevel: interview?.level || "intermediate",
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
                accountCreated,
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
                accountCreated,
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
});

export const GET = withAuthHandler(async (request: Request, user: User) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || user.id;

        // If a userId is specified and the current user is not an admin, validate
        if (userId !== user.id && user.role !== 'admin') {
            return Response.json({
                success: false,
                error: "You can only view your own invitations unless you are an admin"
            }, { status: 403 });
        }

        // Get all invitations for the user
        const invitations = await db
            .collection("invitations")
            .where("senderId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        // Get all invitation data
        const invitationsData = await Promise.all(invitations.docs.map(async doc => {
            const invitation = {
                id: doc.id,
                ...doc.data()
            } as Invitation;

            // Fetch recipient details
            const recipientDoc = await db.collection("users").doc(invitation.recipientId).get();
            const recipientData = recipientDoc.exists ? recipientDoc.data() : null;

            return {
                ...invitation,
                recipient: recipientData ? {
                    id: recipientDoc.id,
                    name: recipientData.name,
                    email: recipientData.email
                } : null
            };
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
});
