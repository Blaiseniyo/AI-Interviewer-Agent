import { db } from "@/firebase/admin";
import { withAuthHandler } from "@/lib/middleware/auth.middleware";

export const PATCH = withAuthHandler(async (request: Request, user: User) => {
    try {
        // Extract invitation ID from URL
        const invitationId = request.url.split('/').slice(-2)[0];

        // Parse request body to get the new status
        const { status } = await request.json();

        if (!status) {
            return Response.json({
                success: false,
                error: "Status field is required"
            }, { status: 400 });
        }

        // Fetch the invitation to verify it belongs to the current user
        const invitationDoc = await db.collection("invitations").doc(invitationId).get();

        if (!invitationDoc.exists) {
            return Response.json({
                success: false,
                error: "Invitation not found"
            }, { status: 404 });
        }

        const invitationData = invitationDoc.data() as Invitation;

        // Check if the invitation belongs to the current user
        if (invitationData.recipientId !== user.id) {
            return Response.json({
                success: false,
                error: "Unauthorized: This invitation does not belong to you"
            }, { status: 403 });
        }

        // Update the invitation status
        await db.collection("invitations").doc(invitationId).update({
            status,
            updatedAt: new Date().toISOString()
        });

        return Response.json({
            success: true,
            message: "Invitation status updated successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating invitation status:", error);
        return Response.json({
            success: false,
            error: "Failed to update invitation status"
        }, { status: 500 });
    }
});
