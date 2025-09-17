"use client";

import { useEffect } from "react";
import { deleteChatMessagesByInterviewId } from "@/lib/actions/interviewTranscript.action";

interface RetakeHandlerProps {
    interviewId: string;
    userId: string;
}

const RetakeHandler = ({ interviewId, userId }: RetakeHandlerProps) => {

    useEffect(() => {
        // Check if the URL has a #retake hash
        const hash = window.location.hash.slice(1);

        const handleRetake = async () => {
            if (hash === "retake") {
                try {
                    // Delete previous chat messages
                    await deleteChatMessagesByInterviewId(interviewId, userId, true);

                    // Remove the hash from the URL without refreshing the page
                    window.history.replaceState(
                        null,
                        document.title,
                        window.location.pathname
                    );
                } catch (error) {
                    console.error("Error deleting chat messages:", error);
                }
            }
        };

        handleRetake();
    }, [interviewId, userId]);

    // This component doesn't render anything
    return null;
};

export default RetakeHandler;
