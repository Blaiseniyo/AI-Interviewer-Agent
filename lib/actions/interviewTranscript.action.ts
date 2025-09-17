"use server";

import { db } from "@/firebase/admin";
// import { getUserSession } from "./auth.action";

// export async function saveChatMessage(
//     interviewId: string,
//     senderId: string,
//     senderType: 'user' | 'assistant',
//     content: string
// ): Promise<ChatMessage | null> {
//     try {
//         const message = {
//             interviewId,
//             senderId,
//             senderType,
//             content,
//             timestamp: new Date().toISOString(),
//         };

//         const docRef = await db.collection("interviewTranscription").add(message);

//         return {
//             id: docRef.id,
//             ...message,
//         } as ChatMessage;
//     } catch (error) {
//         console.error("Error saving chat message:", error);
//         return null;
//     }
// }

export async function saveChatMessage(
    interviewId: string,
    senderId: string,
    senderType: 'user' | 'assistant',
    content: string,
    isMockInterview: boolean = false
): Promise<ChatMessage | null> {
    try {

        const message = {
            interviewId,
            senderId,
            senderType,
            content,
            timestamp: new Date().toISOString(),
        };

        const collectionName = isMockInterview ? "mockInterviewTranscription" : "interviewTranscription";

        const docRef = await db.collection(collectionName).add(message);

        return {
            id: docRef.id,
            ...message,
        } as ChatMessage;
    } catch (error) {
        console.error("Error saving chat message:", error);
        return null;
    }
}


export async function deleteChatMessagesByInterviewId(
    interviewId: string, userId: string, isMockInterview: boolean = false
): Promise<{ success: boolean; message: string }> {
    try {

        const collectionName = isMockInterview ? "mockInterviewTranscription" : "interviewTranscription";

        const querySnapshot = await db
            .collection(collectionName)
            .where("interviewId", "==", interviewId)
            .where("senderId", "==", userId)
            .get();

        if (querySnapshot.empty) {
            return { success: true, message: "No messages to delete." };
        }

        const batch = db.batch();
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        return { success: true, message: "Messages deleted successfully." };
    } catch (error) {
        console.error("Error deleting chat messages:", error);
        return { success: false, message: "Error deleting messages." };
    }
}

export async function getChatMessagesByInterviewId(
    interviewId: string, isMockInterview: boolean = false
): Promise<ChatMessage[] | null> {
    try {

        const collectionName = isMockInterview ? "mockInterviewTranscription" : "interviewTranscription";

        const querySnapshot = await db
            .collection(collectionName)
            .where("interviewId", "==", interviewId)
            .get();

        if (querySnapshot.empty) return [];

        // Get all messages and sort them in memory by timestamp
        const messages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ChatMessage[];

        // Sort by timestamp
        messages.sort((a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });

        return messages;
    } catch (error) {
        console.error("Error getting chat messages:", error);
        return null;
    }
}
