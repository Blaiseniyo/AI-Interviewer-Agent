import { db } from "@/firebase/admin";

export async function verifyInvitationToken(interviewId: string, token: string): Promise<Invitation | null> {
    try {
        const querySnapshot = await db.collection("invitations").where("interviewId", "==", interviewId).where("invitationToken", "==", token).get();

        if (querySnapshot.empty) return null;

        const invitation = querySnapshot.docs[0].data() as Invitation;
        return invitation;
    } catch (error) {
        console.error("Error verifying invitation token:", error);
        return null;
    }
}

export async function getUserInvitation(interviewId: string, userId: string): Promise<Invitation | null> {
    try {
        const querySnapshot = await db.collection("invitations")
            .where("interviewId", "==", interviewId)
            .where("recipientId", "==", userId)
            .get();

        if (querySnapshot.empty) return null;

        const invitation = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
        } as Invitation;

        return invitation;
    } catch (error) {
        console.error("Error checking user invitation:", error);
        return null;
    }
}
