"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InviteCandidateModal from "@/components/InviteCandidateModal";
import CandidatesTable from "@/components/CandidatesTable";
import { InterviewDetailsProps } from "@/types";

const InterviewCandidatesDetails = ({
    candidates,
    interviewId,
    interviewRole,
}: InterviewDetailsProps) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleOpenInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const handleCloseInviteModal = () => {
        setIsInviteModalOpen(false);
    };

    return (
        <>
            <div className="px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Candidates</h2>
                    <Button
                        onClick={handleOpenInviteModal}
                        className="bg-primary-200 hover:bg-primary-200/80 text-dark-100"
                    >
                        Invite Candidate
                    </Button>
                </div>

                <CandidatesTable candidates={candidates} interviewId={interviewId} />
            </div>

            <InviteCandidateModal
                isOpen={isInviteModalOpen}
                onClose={handleCloseInviteModal}
                interviewId={interviewId}
                interviewRole={interviewRole}
            />
        </>
    );
};

export default InterviewCandidatesDetails;
