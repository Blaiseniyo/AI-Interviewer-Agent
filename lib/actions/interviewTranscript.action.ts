"use server";

import { db } from "@/firebase/admin";
// import { getUserSession } from "./auth.action";

export async function saveChatMessage(
    interviewId: string,
    senderId: string,
    senderType: 'user' | 'assistant',
    content: string
): Promise<ChatMessage | null> {
    try {
        const message = {
            interviewId,
            senderId,
            senderType,
            content,
            timestamp: new Date().toISOString(),
        };

        const docRef = await db.collection("interviewTranscription").add(message);

        return {
            id: docRef.id,
            ...message,
        } as ChatMessage;
    } catch (error) {
        console.error("Error saving chat message:", error);
        return null;
    }
}

export async function getChatMessagesByInterviewId(
    interviewId: string
): Promise<ChatMessage[] | null> {
    try {
        // Modified query to avoid requiring a composite index
        // We only filter by interviewId and then sort in memory
        const querySnapshot = await db
            .collection("interviewTranscription")
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
