"use client";

import { useState } from "react";
import InterviewTranscript from "@/components/InterviewTranscription";
import { Button } from "@/components/ui/button";
import { Star, Calendar, User, Award } from "lucide-react";
import Link from "next/link";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import Section from "@/components/ui/Section";
import InfoRow from "@/components/ui/InfoRow";
import ScorePill from "@/components/ui/ScorePill";
import { IconContainer } from "./ui/IconContainer";

type FeedbackTabsProps = {
    interview: Interview;
    feedback: Feedback;
    candidate: User;
    interviewId: string;
};

const tabs = [
    { key: "summary", label: "Summary" },
    { key: "transcript", label: "Transcript" },
];

const FeedbackTabs = ({ feedback, candidate, interviewId }: FeedbackTabsProps) => {
    const [activeTab, setActiveTab] = useState<string>("summary");

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="px-8">
                <div className="flex items-center justify-around gap-2 border-b border-light-600/20">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 hover:cursor-pointer py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? "text-secondary-100 border-secondary-100 "
                                : "text-light-100 border-transparent hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "summary" && (
                <div className="mt-6">
                    <Section title="Candidate Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoRow
                                icon={User}
                                label="Candidate"
                                primary={candidate.name}
                                secondary={candidate.email}
                            />
                            <InfoRow
                                icon={Calendar}
                                label="Completed"
                                primary={formatDate(feedback.createdAt)}
                            />
                            <div className="flex items-center gap-3">
                                <IconContainer icon={Award} />
                                <div>
                                    <ScorePill score={feedback.totalScore} colorClass={getScoreColor(feedback.totalScore)} label="Overall Score" />
                                    <p className="text-sm text-light-100">{getScoreLabel(feedback.totalScore)}</p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <div className="px-8 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Category Breakdown</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {feedback.categoryScores.map((category, index) => (
                                <div key={index} className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                                                {category.score}/100
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-light-100 text-sm leading-relaxed">{category.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Section title="Strengths">
                        <ul className="space-y-3">
                            {feedback.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-light-100">{strength}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Areas for Improvement">
                        <ul className="space-y-3">
                            {feedback.areasForImprovement.map((area, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-light-100">{area}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Final Assessment">
                        <p className="text-light-100 leading-relaxed whitespace-pre-wrap">{feedback.finalAssessment}</p>
                    </Section>

                    <div className="px-8 pb-8">
                        <div className="flex gap-4">
                            <Button
                                asChild
                                variant="outline"
                                className="border-light-600/30 text-light-100 hover:text-white hover:bg-dark-300"
                            >
                                <Link href={`/admin/interviews/${interviewId}`}>Back to Interview</Link>
                            </Button>
                            <Button className="bg-primary-200 hover:bg-primary-200/80 text-dark-100">Download Report</Button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "transcript" && (
                <div className="mt-6 px-8 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Interview Transcript</h2>
                    </div>
                    <InterviewTranscript
                        interviewId={interviewId}
                        userId={candidate.id}
                        compact={false}
                        previewMode={false}
                        fullPage={true}
                        user={candidate}
                    />
                </div>
            )}
        </div>
    );
};

export default FeedbackTabs;


