"use client";

import React, { useState, useEffect, Fragment } from "react";
import { getChatMessagesByInterviewId } from "@/lib/actions/interviewTranscript.action";
import { Button } from "./ui/button";
import { ChevronUp, MessageCircle } from "lucide-react";

interface InterviewTranscriptProps {
    interviewId: string;
    userId: string;
    compact?: boolean;
}

const InterviewTranscript = ({ interviewId, userId, compact = false }: InterviewTranscriptProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const fetchedMessages = await getChatMessagesByInterviewId(interviewId);
                if (fetchedMessages) {
                    setMessages(fetchedMessages);
                }
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [interviewId]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Loading conversation history...</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return <div className="text-center py-4">No conversation history found.</div>;
    }

    // Calculate a simple summary of the conversation
    // const questionCount = messages.filter(m => m.senderType === 'assistant').length;
    // const messageCount = messages.length;
    // const conversationSummary = `${messageCount} messages (${questionCount} questions)`;

    const ToggleButton = () => (
        <Button
            onClick={toggleExpand}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 my-4 border-gradient p-0 rounded-xl overflow-hidden"
        >
            <div className="w-full dark-gradient py-2.5 flex items-center justify-center">
                {isExpanded ? (
                    <div className="flex items-center">
                        <ChevronUp size={16} className="mr-2 text-primary-200" />
                        <span className="text-light-100">Hide Interview Chat</span>
                        {/* <span className="text-xs ml-2 text-light-400">({conversationSummary})</span> */}
                    </div>
                ) : (
                    <div className="flex items-center">
                        <MessageCircle size={16} className="mr-2 text-primary-200" />
                        <span className="text-light-100">View Interview Chat</span>
                        {/* <span className="text-xs ml-2 text-light-400">({conversationSummary})</span> */}
                    </div>
                )}
            </div>
        </Button>
    );

    // Group messages by sender to create chat bubbles
    const groupMessages = (msgs: ChatMessage[]) => {
        const groups: ChatMessage[][] = [];
        let currentGroup: ChatMessage[] = [];

        msgs.forEach((message, index) => {
            // If this is the first message or the sender changed
            if (index === 0 || message.senderType !== msgs[index - 1].senderType) {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const messageGroups = groupMessages(messages);

    if (compact && !isExpanded) {
        return <ToggleButton />;
    }

    return (
        <div className="chat-history-container mb-8">
            {compact && <ToggleButton />}

            <div className="border-gradient rounded-xl">
                <div className="dark-gradient rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4 border-b border-light-400/20 pb-3">
                        <h3 className="text-xl font-medium text-primary-200">Interview Conversation</h3>
                        {!compact && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleExpand}
                                className="text-light-400 hover:text-light-100"
                            >
                                <ChevronUp size={16} className="mr-1" /> Hide
                            </Button>
                        )}
                    </div>

                    <div className="chat-messages flex flex-col gap-5 max-h-[650px] overflow-y-auto pr-2">
                        {messageGroups.map((group, groupIndex) => {
                            const senderType = group[0].senderType;
                            const isUser = senderType === 'user';

                            // Add a timestamp divider if there's a big gap between message groups
                            const showTimeDivider = groupIndex > 0 &&
                                group[0].timestamp &&
                                messageGroups[groupIndex - 1][0].timestamp &&
                                (new Date(group[0].timestamp).getTime() -
                                    new Date(messageGroups[groupIndex - 1][0].timestamp).getTime() > 300000); // 5 min gap

                            return (
                                <Fragment key={`group-wrapper-${groupIndex}`}>
                                    {showTimeDivider && (
                                        <div className="flex justify-center my-2">
                                            <div className="px-3 py-1 bg-dark-200 rounded-full text-xs text-light-400">
                                                {new Date(group[0].timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`chat-message-group flex ${isUser ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {!isUser && (
                                            <div className="w-8 h-8 rounded-full bg-primary-200/20 flex items-center justify-center mr-2 self-start">
                                                <span className="text-xs text-primary-200">AI</span>
                                            </div>
                                        )}

                                        <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                                            {group.map((message, messageIndex) => (
                                                <div key={message.id} className="message-container w-full">
                                                    <div
                                                        className={`message-bubble p-3 ${isUser
                                                            ? 'bg-primary-200/40 text-light-100'
                                                            : 'bg-dark-200 text-light-100'
                                                            } ${
                                                            // First message in group
                                                            messageIndex === 0
                                                                ? isUser
                                                                    ? 'rounded-l-2xl rounded-tr-2xl rounded-br-lg'
                                                                    : 'rounded-r-2xl rounded-tl-2xl rounded-bl-lg'
                                                                // Last message in group
                                                                : messageIndex === group.length - 1
                                                                    ? isUser
                                                                        ? 'rounded-l-2xl rounded-tr-lg rounded-br-2xl'
                                                                        : 'rounded-r-2xl rounded-tl-lg rounded-bl-2xl'
                                                                    // Middle message in group
                                                                    : isUser
                                                                        ? 'rounded-l-2xl rounded-r-lg'
                                                                        : 'rounded-r-2xl rounded-l-lg'
                                                            } ${group.length > 1 && messageIndex !== group.length - 1
                                                                ? 'mb-1'
                                                                : ''
                                                            }`}
                                                    >
                                                        <div className="message-content whitespace-pre-wrap">{message.content}</div>
                                                    </div>

                                                    {/* Only show timestamp for the last message in a group */}
                                                    {messageIndex === group.length - 1 && message.timestamp && (
                                                        <div className={`text-xs text-light-400 mt-1 ${isUser ? 'text-right' : 'text-left'
                                                            }`}>
                                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {isUser && (
                                            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center ml-2 self-start">
                                                <span className="text-xs text-dark-100">You</span>
                                            </div>
                                        )}
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewTranscript;
