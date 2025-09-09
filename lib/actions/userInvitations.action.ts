import { db } from "@/firebase/admin";

export async function getUserSentInvitations(userId: string): Promise<Invitation[]> {
    try {
        const querySnapshot = await db.collection("invitations")
            .where("senderId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        if (querySnapshot.empty) return [];

        const invitations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Invitation[];

        return invitations;
    } catch (error) {
        console.error("Error getting user sent invitations:", error);
        return [];
    }
}

export async function getUserReceivedInvitations(userId: string): Promise<Invitation[]> {
    try {
        // Only search by recipientId for consistency
        const querySnapshot = await db.collection("invitations")
            .where("recipientId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        if (querySnapshot.empty) return [];

        const invitations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Invitation[];

        return invitations;
    } catch (error) {
        console.error("Error getting user received invitations:", error);
        return [];
    }
}

export async function getAllUserInvitations(userId: string): Promise<{
    sent: Invitation[],
    received: Invitation[]
}> {
    try {
        const [sent, received] = await Promise.all([
            getUserSentInvitations(userId),
            getUserReceivedInvitations(userId)
        ]);

        return { sent, received };
    } catch (error) {
        console.error("Error getting all user invitations:", error);
        return { sent: [], received: [] };
    }
}
