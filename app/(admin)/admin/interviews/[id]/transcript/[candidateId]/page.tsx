import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Award } from "lucide-react";

import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getUserById } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import InterviewTranscript from "@/components/InterviewTranscription";
import TranscriptActions from "@/components/TranscriptActions";
import { formatDate, getScoreColor } from "@/lib/utils";

interface RouteParams {
    params: Promise<{ id: string; candidateId: string }>;
}

const AdminTranscriptPage = async ({ params }: RouteParams) => {
    const { id, candidateId } = await params;

    const interview = await getInterviewById(id);
    const candidate = await getUserById(candidateId);
    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: candidateId,
    });

    if (!interview || !candidate) {
        redirect("/admin/interviews");
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/interviews/${id}/feedback/${candidateId}`}>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Interview Transcript</h1>
                            <p className="text-light-400 mt-1">
                                Full conversation for <span className="capitalize text-primary-200">{interview.role}</span> Interview
                            </p>
                        </div>
                    </div>

                    <TranscriptActions />
                </div>

                <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-200" />
                            </div>
                            <div>
                                <p className="text-sm text-light-100">Candidate</p>
                                <p className="text-white font-medium">{candidate.name}</p>
                                <p className="text-sm text-light-100">{candidate.email}</p>
                            </div>
                        </div>

                        {feedback && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                        <Award className="w-5 h-5 text-primary-200" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-100">Overall Score</p>
                                        <p className={`text-2xl font-bold ${getScoreColor(feedback.totalScore)}`}>
                                            {feedback.totalScore}/100
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                        <span className="text-primary-200 text-xs font-bold">DATE</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-100">Completed</p>
                                        <p className="text-white font-medium">
                                            {formatDate(feedback.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="transcript-container">
                    <InterviewTranscript
                        interviewId={id}
                        userId={candidateId}
                        compact={false}
                        fullPage={true}
                        user={candidate}
                    />
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-light-600/20">
                    <Link href={`/admin/interviews/${id}/feedback/${candidateId}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Feedback
                        </Button>
                    </Link>

                    <div className="flex gap-3">
                        <Link href={`/admin/interviews/${id}`}>
                            <Button variant="outline">
                                Interview Overview
                            </Button>
                        </Link>
                        <Link href="/admin/interviews">
                            <Button className="bg-primary-200 hover:bg-primary-200/80 text-dark-100">
                                All Interviews
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTranscriptPage;
