import { db } from "@/firebase/admin";
import { getInterviewById } from "@/lib/actions/general.action";
import { withAuthHandler } from "@/lib/middleware/auth.middleware";
import { getUserReceivedInvitations } from "@/lib/actions/userInvitations.action";

export const GET = withAuthHandler(async (request: Request, user: User) => {
    try {

        console.log("Fetching invitations for user:", user);
        // Get invitations where user is the recipient
        const invitations = await getUserReceivedInvitations(user.id);

        if (invitations.length === 0) {
            return Response.json({
                success: true,
                data: []
            }, { status: 200 });
        }

        // Get invitation data with interview details and sender details
        const invitationsWithDetails = await Promise.all(
            invitations.map(async (invitation) => {
                // Fetch the associated interview
                const interview = await getInterviewById(invitation.interviewId);

                // Fetch sender details
                const senderDoc = await db.collection("users").doc(invitation.senderId).get();
                const senderData = senderDoc.exists ? senderDoc.data() : null;

                return {
                    invitation,
                    interview: interview || null,
                    sender: senderData ? {
                        id: senderDoc.id,
                        name: senderData.name,
                        email: senderData.email
                    } : null
                };
            })
        );

        // Filter out any entries where interview couldn't be found
        const validInvitations = invitationsWithDetails.filter(item => item.interview !== null);

        return Response.json({
            success: true,
            data: validInvitations
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user invitations:", error);
        return Response.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
});
